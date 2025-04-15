document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltip manager
    const tooltipManager = new TooltipManager();
    tooltipManager.initialize('#tooltip', '.relationships-container');

    // Initialize SVG
    const svg = d3.select('#relationships-svg');
    const width = 1000;
    const height = 800;
    const padding = 80;

    const periods = ["1965-1975", "1976-1985", "1986-1995", "1996-2005", "2006-2015", "2016-2025"];
    const categories = ['tech', 'economy', 'politics', 'society', 'environment', 'education'];
    
    const categoryNames = {
        tech: '科技發展',
        economy: '經濟發展',
        politics: '政治發展',
        society: '社會發展',
        environment: '環境發展',
        education: '教育發展'
    };
    
    const colors = {
        tech: '#FFB6C1',
        economy: '#87CEFA',
        politics: '#B0B0FF',
        society: '#90EE90',
        environment: '#F0E68C',
        education: '#FFA07A'
    };

    // Draw grid
    periods.forEach((period, i) => {
        svg.append('line')
            .attr('x1', padding + (width - 2 * padding) * i / periods.length)
            .attr('y1', padding)
            .attr('x2', padding + (width - 2 * padding) * i / periods.length)
            .attr('y2', height - padding)
            .attr('stroke', '#ddd')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');
    });

    categories.forEach((category, i) => {
        svg.append('line')
            .attr('x1', padding)
            .attr('y1', padding + (height - 2 * padding) * i / categories.length)
            .attr('x2', width - padding)
            .attr('y2', padding + (height - 2 * padding) * i / categories.length)
            .attr('stroke', '#ddd')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');
    });

    // Draw background
    svg.selectAll('.period-bg')
        .data(periods)
        .enter()
        .append('rect')
        .attr('class', 'period-bg')
        .attr('x', (d, i) => padding + (width - 2 * padding) * i / periods.length)
        .attr('y', padding)
        .attr('width', (width - 2 * padding) / periods.length)
        .attr('height', height - 2 * padding)
        .attr('fill', (d, i) => i % 2 === 0 ? '#f8f9fa' : '#fff')
        .attr('opacity', 0.5);

    // Add labels
    svg.selectAll('.period-label')
        .data(periods)
        .enter()
        .append('text')
        .attr('class', 'period-label')
        .attr('x', (d, i) => padding + (width - 2 * padding) * (i + 0.5) / periods.length)
        .attr('y', padding - 20)
        .attr('text-anchor', 'middle')
        .text(d => d);

    svg.selectAll('.category-label')
        .data(categories)
        .enter()
        .append('text')
        .attr('class', 'category-label')
        .attr('x', padding - 10)
        .attr('y', (d, i) => padding + (height - 2 * padding) * (i + 0.5) / categories.length)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .text(d => categoryNames[d])
        .style('fill', d => colors[d]);

    // Create nodes and links
    const nodes = [];
    const links = [];

    // Process data
    categories.forEach(category => {
        timelineData[category].forEach(d => {
            nodes.push({
                id: `${category}-${d.period}`,
                category: category,
                title: d.title,
                period: d.period,
                periodIndex: periods.indexOf(d.period),
                color: colors[category],
                trend: d.trend,
                level: d.level,
                events: d.events,
                categoryIndex: categories.indexOf(category)
            });
        });
    });

    connections.forEach(conn => {
        links.push({
            source: conn.from,
            target: conn.to,
            type: conn.type,
            value: conn.level || 1
        });
    });

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('x', d3.forceX().x(d => 
            padding + (width - 2 * padding) * (d.periodIndex + 0.5) / periods.length
        ).strength(1))
        .force('y', d3.forceY().y(d => 
            padding + (height - 2 * padding) * (d.categoryIndex + 0.5) / categories.length
        ).strength(1))
        .force('collision', d3.forceCollide().radius(50));

    // Create arrow marker
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-10 -10 20 20')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M-6,-6 L 0,0 L -6,6')
        .attr('fill', '#999');

    // Draw links
    const link = svg.append('g')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('class', 'link')
        .attr('stroke', '#999')
        .attr('stroke-width', d => Math.sqrt(d.value))
        .attr('marker-end', 'url(#arrowhead)')
        .style('opacity', 0.6)
        .on('mouseenter', function(event, d) {
            d3.select(this)
                .attr('stroke-width', d => Math.sqrt(d.value) + 2)
                .style('opacity', 1);
            
            tooltipManager.show(event, `<strong>關聯性</strong><br>${d.type}`, this);
        })
        .on('mouseleave', function() {
            d3.select(this)
                .attr('stroke-width', d => Math.sqrt(d.value))
                .style('opacity', 0.6);
            tooltipManager.hide();
        });

    // Draw nodes
    const node = svg.append('g')
        .selectAll('.node-group')
        .data(nodes)
        .join('g')
        .attr('class', 'node-group')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Add background for text
    node.append('rect')
        .attr('class', 'text-bg')
        .attr('fill', '#fff')
        .attr('x', 12)
        .attr('y', -10)
        .attr('rx', 4)
        .attr('ry', 4)
        .style('opacity', 0.95);

    node.append('circle')
        .attr('r', 8)
        .attr('fill', d => d.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    const nodeText = node.append('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(d => d.title)
        .style('font-size', '12px')
        .style('fill', '#333');

    // Adjust text background size
    node.selectAll('.text-bg')
        .each(function(d) {
            const textElement = d3.select(this.parentNode).select('text').node();
            const bbox = textElement.getBBox();
            d3.select(this)
                .attr('width', bbox.width + 8)
                .attr('height', bbox.height + 4)
                .attr('y', bbox.y - 2);
        });

    // Add hover interactions
    node.on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
            .attr('r', 10)
            .attr('stroke-width', 3);

        const content = `
            <strong>${d.title}</strong><br>
            <strong>時期：</strong>${d.period}<br>
            <strong>趨勢：</strong>${d.trend}<br>
            <strong>重要事件：</strong><br>
            ${d.events.join('<br>')}
        `;
        tooltipManager.show(event, content, this);

        link.style('opacity', l => 
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
    })
    .on('mouseleave', function() {
        d3.select(this).select('circle')
            .attr('r', 8)
            .attr('stroke-width', 2);
        tooltipManager.hide();
        link.style('opacity', 0.6);
    });

    // Update positions
    simulation.on('tick', () => {
        link.attr('d', d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy) * 2;
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

        node.attr('transform', d => {
            // Keep nodes within bounds
            d.x = Math.max(padding + 50, Math.min(width - padding - 50, d.x));
            d.y = Math.max(padding + 30, Math.min(height - padding - 30, d.y));
            return `translate(${d.x},${d.y})`;
        });
    });

    // Drag functions
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        tooltipManager.hide();
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
});
