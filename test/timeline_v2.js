document.addEventListener('DOMContentLoaded', function() {
    const v2Container = document.getElementById('v2');
    if (!v2Container || !v2Container.classList.contains('active')) return;

    // Initialize tooltip managers
    const tooltipManager = new TooltipManager();
    const trendTooltipManager = new TooltipManager();
    
    tooltipManager.initialize('#tooltip-v2', '#v2 .timeline-container');
    trendTooltipManager.initialize('#trend-tooltip-v2', '#v2 .timeline-container');

    // Initialize visualization
    const svg = d3.select('#timeline-svg-v2');
    svg.selectAll("*").remove(); // Clear existing content

    // Set SVG dimensions
    const containerWidth = document.querySelector('#v2 .timeline-container').clientWidth;
    const containerHeight = 800;
    svg.attr('width', containerWidth)
       .attr('height', containerHeight);

    const width = containerWidth;
    const height = containerHeight;
    const margin = { top: 60, right: 100, bottom: 50, left: 50 };

    // Create main time axis
    const timeScale = d3.scaleLinear()
        .domain([1960, 2025])
        .range([margin.left, width - margin.right]);

    const mainAxis = svg.append('g')
        .attr('class', 'main-axis')
        .attr('transform', `translate(0, ${margin.top})`);

    // Add period backgrounds
    mainAxis.selectAll('.period-bg')
        .data(timeperiods)
        .enter()
        .append('rect')
        .attr('class', 'period-bg')
        .attr('x', d => timeScale(d.start))
        .attr('y', -20)
        .attr('width', d => timeScale(d.end) - timeScale(d.start))
        .attr('height', height - margin.top - margin.bottom + 40)
        .attr('fill', '#f8f9fa')
        .attr('stroke', '#dee2e6');

    // Add period labels
    mainAxis.selectAll('.period-label')
        .data(timeperiods)
        .enter()
        .append('text')
        .attr('class', 'period-label')
        .attr('x', d => timeScale(d.start) + (timeScale(d.end) - timeScale(d.start)) / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(d => d.label);

    // Draw category timelines
    const categorySpacing = (height - margin.top - margin.bottom) / Object.keys(eventData).length;
    
    Object.entries(eventData).forEach(([category, data], index) => {
        const categoryGroup = svg.append('g')
            .attr('class', `category-${category}`)
            .attr('transform', `translate(0, ${margin.top + categorySpacing * index})`);

        // Add category label
        categoryGroup.append('text')
            .attr('x', margin.left - 10)
            .attr('y', categorySpacing / 2)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(data.title);

        // Draw events for each period
        data.events.forEach(period => {
            const periodStart = timeperiods.find(t => t.label === period.period).start;
            const periodGroup = categoryGroup.append('g')
                .attr('class', 'period-events');

            // Draw period background
            periodGroup.append('rect')
                .attr('x', timeScale(periodStart))
                .attr('y', 0)
                .attr('width', timeScale(periodStart + 10) - timeScale(periodStart))
                .attr('height', categorySpacing)
                .attr('fill', data.color)
                .attr('opacity', 0.1);

            // Draw main events
            period.mainEvents.forEach(event => {
                const eventGroup = periodGroup.append('g')
                    .attr('class', 'event')
                    .attr('transform', `translate(${timeScale(event.year)}, ${categorySpacing / 2})`);

                // Add event node
                eventGroup.append('circle')
                    .attr('r', 6)
                    .attr('fill', data.color)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2)
                    .style('cursor', 'pointer')
                    .on('mouseenter', function(e) {
                        const content = `
                            <strong>${event.title}</strong><br>
                            ${event.description}<br>
                            <strong>影響：</strong><br>
                            ${event.impact.join('<br>')}
                        `;
                        tooltipManager.show(e, content, this);
                    })
                    .on('mouseleave', () => tooltipManager.hide());

                // Add event label
                eventGroup.append('text')
                    .attr('x', 0)
                    .attr('y', -10)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '11px')
                    .style('fill', '#666')
                    .text(event.title);
            });

            // Add period background info
            const bgGroup = periodGroup.append('g')
                .attr('class', 'period-bg-info')
                .attr('transform', `translate(${timeScale(periodStart)}, 0)`);

            bgGroup.append('text')
                .attr('x', 5)
                .attr('y', categorySpacing - 10)
                .style('font-size', '10px')
                .style('fill', '#999')
                .text(`背景：${period.background}`);

            // Add trends
            const trendGroup = periodGroup.append('g')
                .attr('class', 'period-trends')
                .attr('transform', `translate(${timeScale(periodStart)}, ${categorySpacing - 25})`);

            period.trends.forEach((trend, i) => {
                trendGroup.append('text')
                    .attr('x', 5)
                    .attr('y', i * 15)
                    .style('font-size', '10px')
                    .style('fill', '#666')
                    .text(`• ${trend}`);
            });
        });
    });
});
