class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.container = null;
        this.isVisible = false;
        this.currentTarget = null;
        this.lastMousePosition = { x: 0, y: 0 };
    }

    initialize(tooltipId, containerId) {
        this.tooltip = document.querySelector(tooltipId);
        this.container = document.querySelector(containerId);
        
        if (!this.tooltip || !this.container) {
            console.error('Tooltip or container not found');
            return;
        }

        // Add mousemove listener to update position
        this.container.addEventListener('mousemove', (event) => {
            this.lastMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            if (this.isVisible) {
                this.updatePosition(event);
            }
        });

        // Add scroll listener
        window.addEventListener('scroll', () => {
            if (this.isVisible) {
                this.updatePosition({ 
                    clientX: this.lastMousePosition.x,
                    clientY: this.lastMousePosition.y
                });
            }
        });
    }

    show(event, content, target) {
        if (!this.tooltip || !this.container) return;

        this.currentTarget = target;
        this.tooltip.innerHTML = content;
        this.tooltip.style.visibility = 'visible';
        this.tooltip.style.opacity = '0';

        // Position tooltip after content is set
        this.updatePosition(event);
        
        requestAnimationFrame(() => {
            this.tooltip.style.opacity = '1';
            this.isVisible = true;
        });
    }

    updatePosition(event) {
        const containerRect = this.container.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        // Calculate position relative to container
        let x = event.clientX - containerRect.left;
        let y = event.clientY - containerRect.top;

        // Add offset
        x += 15;
        y -= 5;

        // Adjust if tooltip would go outside container
        if (x + tooltipRect.width > containerRect.width - 20) {
            x = event.clientX - containerRect.left - tooltipRect.width - 15;
        }
        if (y + tooltipRect.height > containerRect.height - 20) {
            y = event.clientY - containerRect.top - tooltipRect.height - 15;
        }

        // Ensure tooltip stays within container bounds
        x = Math.max(10, Math.min(containerRect.width - tooltipRect.width - 10, x));
        y = Math.max(10, Math.min(containerRect.height - tooltipRect.height - 10, y));

        // Apply position
        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    hide() {
        if (!this.tooltip) return;
        
        this.tooltip.style.opacity = '0';
        this.isVisible = false;
        this.currentTarget = null;
        
        setTimeout(() => {
            if (!this.isVisible) {
                this.tooltip.style.visibility = 'hidden';
            }
        }, 200);
    }
}
