class LiveBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.accentColor = 'rgba(212, 175, 55, 0.3)';
        this.lineColorRgb = '212, 175, 55';
        this.isStarMode = false;
        
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

        window.liveBackground = this;
    }

    setThemeColor(r, g, b) {
        this.lineColorRgb = `${r}, ${g}, ${b}`;
        this.accentColor = `rgba(${r}, ${g}, ${b}, 0.35)`;
        this.particles.forEach(p => {
            p.color = `rgba(${r}, ${g}, ${b}, ${p.baseOpacity || 0.4})`;
        });
    }

    morphToStar(durationMs = 6000) {
        if (this.isStarMode || !this.particles.length) return;
        this.isStarMode = true;

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const outerR = Math.min(this.canvas.width, this.canvas.height) * 0.28;
        const innerR = outerR * 0.38;

        // Generate 5-point star path points
        const starPoints = [];
        const numPoints = 10;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            starPoints.push({
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r
            });
        }

        // Interpolate along the star perimeter for all particles
        const perimeterSegments = [];
        for (let i = 0; i < numPoints; i++) {
            const p1 = starPoints[i];
            const p2 = starPoints[(i + 1) % numPoints];
            perimeterSegments.push({ p1, p2 });
        }

        this.particles.forEach((p, idx) => {
            p.origX = p.x;
            p.origY = p.y;
            p.origDx = p.directionX;
            p.origDy = p.directionY;

            // Distribute along star lines + some fill
            const seg = perimeterSegments[idx % perimeterSegments.length];
            const t = ((idx / this.particles.length) * 3) % 1;
            p.targetX = seg.p1.x + (seg.p2.x - seg.p1.x) * t + (Math.random() - 0.5) * 8;
            p.targetY = seg.p1.y + (seg.p2.y - seg.p1.y) * t + (Math.random() - 0.5) * 8;
            p.starGlow = true;
        });

        const startTime = performance.now();
        const animStar = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / 1200, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            this.particles.forEach(p => {
                if (p.targetX !== undefined) {
                    p.x = p.origX + (p.targetX - p.origX) * ease;
                    p.y = p.origY + (p.targetY - p.origY) * ease;
                }
            });

            if (progress < 1) {
                requestAnimationFrame(animStar);
            }
        };
        requestAnimationFrame(animStar);

        // Disperse back after duration
        setTimeout(() => {
            this.particles.forEach(p => {
                p.targetX = undefined;
                p.targetY = undefined;
                p.directionX = (Math.random() * 0.8) - 0.4;
                p.directionY = (Math.random() * 0.8) - 0.4;
                p.starGlow = false;
            });
            this.isStarMode = false;
        }, durationMs);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        let numberOfParticles = Math.min((this.canvas.width * this.canvas.height) / 9000, 150);
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.8) + 0.6;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let opacity = (Math.random() * 0.3) + 0.25;

            const p = new Particle(this.ctx, x, y, directionX, directionY, size, `rgba(${this.lineColorRgb}, ${opacity})`, this.canvas, this.mouse);
            p.baseOpacity = opacity;
            this.particles.push(p);
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
            this.particles[i].update(this.isStarMode);
        }
        this.connect();
    }

    connect() {
        let connectionDistance = (this.canvas.width / 7) * (this.canvas.height / 7);
        if (this.isStarMode) connectionDistance *= 1.5;

        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                let dx = this.particles[a].x - this.particles[b].x;
                let dy = this.particles[a].y - this.particles[b].y;
                let distance = dx * dx + dy * dy;
                
                if (distance < connectionDistance) {
                    let opacityValue = 1 - (distance / connectionDistance);
                    this.ctx.strokeStyle = `rgba(${this.lineColorRgb}, ${opacityValue * (this.isStarMode ? 0.7 : 0.4)})`;
                    this.ctx.lineWidth = this.isStarMode ? 1.5 : 1;
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
        this.ctx.arc(this.x, this.y, this.starGlow ? this.size * 1.8 : this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        if (this.starGlow) {
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 10;
        }
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    update(isLocked) {
        if (!isLocked) {
            if (this.x > this.canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > this.canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interaction
            if (this.mouse.x !== null) {
                let dx = this.mouse.x - this.x;
                let dy = this.mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.mouse.radius + this.size) {
                    if (this.mouse.x < this.x && this.x < this.canvas.width - this.size * 10) {
                        this.x += 1.2;
                    }
                    if (this.mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 1.2;
                    }
                    if (this.mouse.y < this.y && this.y < this.canvas.height - this.size * 10) {
                        this.y += 1.2;
                    }
                    if (this.mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 1.2;
                    }
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
        }

        this.draw();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LiveBackground();
});

