document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltip managers
    const tooltipManager = new TooltipManager();
    const trendTooltipManager = new TooltipManager();
    
    tooltipManager.initialize('#tooltip', '.timeline-container');
    trendTooltipManager.initialize('#trend-tooltip', '.timeline-container');

    // Initialize visualization
    const svg = d3.select('#timeline-svg');
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const margin = { top: 60, right: 100, bottom: 50, left: 35 };
    const titleOffset = 50;
    const timelineOffset = 150;

    // Create scales
    const xScale = d3.scalePoint()
        .domain(["1965-1975", "1976-1985", "1986-1995", "1996-2005", "2006-2015", "2016-2025"])
        .range([margin.left + timelineOffset, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, 7])
        .range([height - margin.bottom, margin.top]);

    const colors = {
        tech: '#FFE4E1',
        economy: '#E1F0FF',
        politics: '#E6E6FF',
        society: '#E0FFE0',
        environment: '#FFFACD',
        education: '#FFE6E0'
    };

    const categories = ['education', 'environment', 'society', 'politics', 'economy', 'tech'];
    const categorySpacing = 1.1;
    const categoryOffset = {};
    categories.forEach((cat, index) => {
        categoryOffset[cat] = index * categorySpacing;
    });

    // Draw main timeline
    categories.forEach(category => {
        const data = timelineData[category];
        const categoryGroup = svg.append('g')
            .attr('class', `category-${category}`);

        const line = d3.line()
            .x(d => xScale(d.period))
            .y(d => yScale(categoryOffset[category] + d.level / 6))
            .curve(d3.curveMonotoneX);

        categoryGroup.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', colors[category])
            .style('stroke-width', 2);

        // Draw nodes and labels
        data.forEach((d, i) => {
            const x = xScale(d.period);
            const y = yScale(categoryOffset[category] + d.level / 6);

            // Add permanent trend label
            const labelGroup = categoryGroup.append('g')
                .attr('class', 'trend-label-group')
                .attr('transform', `translate(${x}, ${y - 30})`);

            // Add label background
            labelGroup.append('rect')
                .attr('class', 'label-bg')
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('fill', '#fff')
                .attr('stroke', colors[category])
                .attr('stroke-width', 1)
                .attr('opacity', 0.9);

            // Add main title
            const titleText = labelGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '-0.2em')
                .attr('fill', '#333')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(d.title);

            // Add subtitle
            const subtitleText = labelGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '1em')
                .attr('fill', '#666')
                .style('font-size', '10px')
                .text(d.subtitle.join(' · '));

            // Adjust background size for both texts
            const titleBox = titleText.node().getBBox();
            const subtitleBox = subtitleText.node().getBBox();
            const totalWidth = Math.max(titleBox.width, subtitleBox.width);
            const totalHeight = titleBox.height + subtitleBox.height;

            labelGroup.select('.label-bg')
                .attr('x', -totalWidth/2 - 4)
                .attr('y', titleBox.y - 2)
                .attr('width', totalWidth + 8)
                .attr('height', totalHeight + 8);

            // Add trend indicator
            if (i < data.length - 1) {
                const next = data[i + 1];
                const change = next.level - d.level;
                if (Math.abs(change) >= 0.5) {
                    const icon = change > 0 ? '↑' : '↓';
                    const iconX = (x + xScale(next.period)) / 2;
                    const iconY = y - 20;

                    const iconGroup = categoryGroup.append('g')
                        .attr('class', 'trend-icon')
                        .attr('transform', `translate(${iconX}, ${iconY})`);

                    iconGroup.append('circle')
                        .attr('r', 12)
                        .attr('fill', 'white')
                        .attr('stroke', colors[category])
                        .attr('stroke-width', 1.5)
                        .style('cursor', 'pointer')
                        .on('mouseenter', (event) => {
                            const content = `<strong>趨勢變化</strong><br>${d.trend}`;
                            trendTooltipManager.show(event, content, event.target);
                        })
                        .on('mouseleave', () => {
                            trendTooltipManager.hide();
                        });

                    iconGroup.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '0.35em')
                        .attr('fill', colors[category])
                        .style('font-size', '16px')
                        .style('pointer-events', 'none')
                        .text(icon);
                }
            }

            // Draw node
            categoryGroup.append('circle')
                .attr('class', 'node')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 8)
                .style('fill', colors[category])
                .style('stroke', '#fff')
                .style('stroke-width', 2)
                .on('mouseenter', function(event) {
                    const content = `
                        <strong>${d.title}</strong><br>
                        <strong>重要事件：</strong><br>
                        ${d.events.join('<br>')}
                    `;
                    tooltipManager.show(event, content, this);
                })
                .on('mouseleave', () => {
                    tooltipManager.hide();
                });
        });

        // Add category labels
        categoryGroup.append('text')
            .attr('x', margin.left + titleOffset)
            .attr('y', yScale(categoryOffset[category] + 0.3))
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .style('font-size', '18px')
            .style('fill', '#333')
            .style('font-weight', 'bold')
            .text(category === 'tech' ? '科技' :
                  category === 'economy' ? '經濟' :
                  category === 'politics' ? '政治' :
                  category === 'society' ? '社會' :
                  category === 'environment' ? '環境' :
                  '教育');
    });

    // Add x-axis with years
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
        .style('font-size', '12px');

    // Add legend click handlers
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = Array.from(item.classList)
                .find(cls => Object.keys(colors).includes(cls));
            
            const opacity = item.classList.contains('disabled') ? 1 : 0.2;
            svg.selectAll(`.category-${category}`).style('opacity', opacity);
            item.classList.toggle('disabled');
        });
    });
});
