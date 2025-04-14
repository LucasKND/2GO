document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('metrics-background');
    if (!container) return;
    
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    const particles = [];
    const numParticles = 50;
    const colors = ['#ff3a3a', '#cc0000', '#990000'];
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }
    
    function resizeCanvas() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function createParticles() {
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    createParticles();
    animate();
    window.addEventListener('resize', resizeCanvas);
});
