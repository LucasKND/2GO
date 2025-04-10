document.addEventListener('DOMContentLoaded', function() {
    // Elementos com efeito parallax
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    // Aplicar efeito parallax durante o scroll
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Atualizar a variável CSS personalizada --scrolled com a posição atual do scroll
        document.documentElement.style.setProperty('--scrolled', scrolled);
        
        // Para cada elemento com classe parallax-element
        parallaxElements.forEach(element => {
            // Verificar se o elemento está visível na viewport
            const elementTop = element.getBoundingClientRect().top + scrolled;
            const elementBottom = elementTop + element.offsetHeight;
            
            if (scrolled > elementTop - window.innerHeight && scrolled < elementBottom) {
                // Calcular a posição relativa do elemento na viewport
                const relativePos = (scrolled - (elementTop - window.innerHeight)) / (elementBottom - (elementTop - window.innerHeight));
                
                // Aplicar transformação baseada na posição relativa
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
    
    // Atualizar o efeito parallax durante o scroll
    window.addEventListener('scroll', updateParallax);
    
    // Inicializar o efeito parallax
    updateParallax();
    
    // Adicionar a classe parallax às seções que devem ter fundo com efeito parallax
    document.getElementById('purpose').classList.add('parallax');
    document.getElementById('expertise').classList.add('parallax');
    document.getElementById('main-cta').classList.add('parallax');
    
    // Scroll overlap effect handler
    if (!document.querySelector('.overlap-container')) return;
    
    const metricsSection = document.getElementById('metrics');
    const servicesSection = document.getElementById('services');
    
    // Initialize GSAP ScrollTrigger if available
    if (window.ScrollTrigger) {
        // Create scroll trigger for services section entrance
        gsap.registerPlugin(ScrollTrigger);
        
        // Trigger for scaling/fading metrics as services section overlaps
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
        
        // Enhance entrance of services section
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
        // Fallback for non-GSAP environments
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const servicesOffset = servicesSection.offsetTop;
            const viewportHeight = window.innerHeight;
            
            // Calculate scroll progress for the overlap
            const scrollProgress = Math.max(0, Math.min(1, 
                (scrollPosition - (servicesOffset - viewportHeight)) / viewportHeight));
            
            // Apply scale and opacity changes to metrics cards
            document.querySelectorAll('.metric-card').forEach((card, index) => {
                const delay = index * 0.1;
                const effectProgress = Math.max(0, Math.min(1, scrollProgress - delay));
                card.style.transform = `scale(${1 - (effectProgress * 0.1)})`;
                card.style.opacity = 1 - (effectProgress * 0.3);
            });
        });
    }
});
