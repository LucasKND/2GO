document.addEventListener('DOMContentLoaded', function() {
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;
            
            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                
                if (elapsedTime < duration) {
                    const progress = elapsedTime / duration;
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
                    counter.textContent = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        });
    }
    
    function setupParallax() {
        const section = document.getElementById('metrics');
        const layers = section.querySelectorAll('.parallax-layer');
        const cards = section.querySelectorAll('.metric-card');
        
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
                const scrollPosition = scrollY - sectionTop + window.innerHeight;
                const scrollRatio = scrollPosition / (sectionHeight + window.innerHeight);
                
                layers.forEach((layer, index) => {
                    const speed = index + 1;
                    const yOffset = scrollRatio * speed * 50;
                    layer.style.transform = `translateY(${yOffset}px)`;
                });
                
                cards.forEach(card => {
                    const depth = parseFloat(card.getAttribute('data-depth')) || 0.2;
                    const yOffset = scrollRatio * depth * 30;
                    card.style.transform = `translateY(${-yOffset}px)`;
                });
            }
        });
    }
    
    function createAIDots() {
        const dotsContainer = document.querySelector('.ai-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        const numDots = 30;
        const dots = [];
        
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            dot.style.left = `${x}%`;
            dot.style.top = `${y}%`;
            
            dotsContainer.appendChild(dot);
            dots.push({element: dot, x, y});
        }
        
        const numLines = 15;
        
        for (let i = 0; i < numLines; i++) {
            const dot1 = dots[Math.floor(Math.random() * dots.length)];
            const dot2 = dots[Math.floor(Math.random() * dots.length)];
            
            if (dot1 !== dot2) {
                const line = document.createElement('div');
                line.className = 'line';
                
                const dx = dot2.x - dot1.x;
                const dy = dot2.y - dot1.y;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                line.style.width = `${distance}%`;
                line.style.left = `${dot1.x}%`;
                line.style.top = `${dot1.y}%`;
                line.style.transform = `rotate(${angle}deg)`;
                line.style.transformOrigin = '0 0';
                
                dotsContainer.appendChild(line);
            }
        }
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) {
        observer.observe(metricsSection);
    }
    
    createAIDots();
    setupParallax();
    
    window.addEventListener('resize', createAIDots);
});
