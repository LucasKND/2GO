document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        document.documentElement.style.setProperty('--scrolled', scrolled);
        
        parallaxElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrolled;
            const elementBottom = elementTop + element.offsetHeight;
            
            if (scrolled > elementTop - window.innerHeight && scrolled < elementBottom) {
                const relativePos = (scrolled - (elementTop - window.innerHeight)) / (elementBottom - (elementTop - window.innerHeight));
                
                if (element.classList.contains('parallax-slow')) {
                    element.style.transform = `translateY(${relativePos * 50}px)`;
                } else if (element.classList.contains('parallax-medium')) {
                    element.style.transform = `translateY(${relativePos * 30}px)`;
                } else if (element.classList.contains('parallax-fast')) {
                    element.style.transform = `translateY(${relativePos * 15}px)`;
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateParallax);
    
    updateParallax();
    
    document.getElementById('purpose').classList.add('parallax');
    document.getElementById('expertise').classList.add('parallax');
    document.getElementById('main-cta').classList.add('parallax');
    
    if (!document.querySelector('.overlap-container')) return;
    
    const metricsSection = document.getElementById('metrics');
    const servicesSection = document.getElementById('services');
    
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.to('.metric-card', {
            scrollTrigger: {
                trigger: servicesSection,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true
            },
            scale: 0.9,
            opacity: 0.7,
            stagger: 0.1,
            ease: "power2.out"
        });
        
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: servicesSection,
                start: 'top 70%',
                end: 'top 40%',
                scrub: true
            },
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
    } else {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const servicesOffset = servicesSection.offsetTop;
            const viewportHeight = window.innerHeight;
            
            const scrollProgress = Math.max(0, Math.min(1, 
                (scrollPosition - (servicesOffset - viewportHeight)) / viewportHeight));
            
            document.querySelectorAll('.metric-card').forEach((card, index) => {
                const delay = index * 0.1;
                const effectProgress = Math.max(0, Math.min(1, scrollProgress - delay));
                card.style.transform = `scale(${1 - (effectProgress * 0.1)})`;
                card.style.opacity = 1 - (effectProgress * 0.3);
            });
        });
    }
});
