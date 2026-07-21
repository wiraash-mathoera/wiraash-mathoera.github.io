class LiveBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.initParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        let numberOfParticles = (this.canvas.width * this.canvas.height) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(212, 175, 55, 0.3)';

            this.particles.push(new Particle(this.ctx, x, y, directionX, directionY, size, color, this.canvas, this.mouse));
        }
    }

    init() {
        this.resize();
        this.initParticles();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
        this.connect();
    }

    connect() {
        let opacityValue = 1;
        let connectionDistance = (this.canvas.width / 7) * (this.canvas.height / 7);
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                let distance = ((this.particles[a].x - this.particles[b].x) * (this.particles[a].x - this.particles[b].x))
                + ((this.particles[a].y - this.particles[b].y) * (this.particles[a].y - this.particles[b].y));
                
                if (distance < connectionDistance) {
                    let opacityValue = 1 - (distance / connectionDistance);
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.4})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(ctx, x, y, directionX, directionY, size, color, canvas, mouse) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.canvas = canvas;
        this.mouse = mouse;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        if (this.x > this.canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse interaction
        let dx = this.mouse.x - this.x;
        let dy = this.mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.mouse.radius + this.size) {
            if (this.mouse.x < this.x && this.x < this.canvas.width - this.size * 10) {
                this.x += 1;
            }
            if (this.mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 1;
            }
            if (this.mouse.y < this.y && this.y < this.canvas.height - this.size * 10) {
                this.y += 1;
            }
            if (this.mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 1;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LiveBackground();
});
