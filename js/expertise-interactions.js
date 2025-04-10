/**
 * Script para interações avançadas na seção de Expertise
 * Implementa efeitos 3D, sistemas de partículas e animações dinâmicas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Efeito de perspectiva nos cards
    initPerspectiveCards();
    
    // Sistemas de partículas para ícones
    initIconParticles();
    
    // Animação da linha do tempo de metodologia
    initMethodologyTimeline();
    
    // Elementos flutuantes decorativos
    initFloatingElements();
    
    // Animações baseadas em scroll
    initScrollAnimations();
});

// Efeito 3D para os cards de expertise
function initPerspectiveCards() {
    const cards = document.querySelectorAll('.perspective-card');
    
    cards.forEach(card => {
        const depth = parseFloat(card.dataset.depth) || 0.2;
        const content = card.querySelector('.expertise-item-content');
        const backdrop = card.querySelector('.card-backdrop');
        
        // Configurar transformações 3D
        gsap.set(card, { transformPerspective: 1000 });
        gsap.set(content, { transformStyle: "preserve-3d" });
        
        // Adicionar interação de movimento do mouse
        card.addEventListener('mousemove', e => {
            // Obter posição relativa do mouse dentro do card
            const rect = card.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 a 0.5
            
            // Aplicar rotação com base na posição do mouse
            const rotateY = mouseX * 15; // -7.5° a 7.5°
            const rotateX = -mouseY * 15; // -7.5° a 7.5°
            
            // Animar o card com GSAP para suavidade
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Mover o conteúdo em direção oposta para aumentar profundidade
            gsap.to(content, {
                z: 20,
                x: rotateY * 0.5,
                y: rotateX * 0.5,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Mover o fundo em direção oposta para efeito parallax
            if (backdrop) {
                gsap.to(backdrop, {
                    x: -rotateY * depth * 2,
                    y: -rotateX * depth * 2,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Adicionar brilho dinâmico
            const glowX = 50 + mouseX * 50;
            const glowY = 50 + mouseY * 50;
            
            gsap.to(card, {
                boxShadow: `0 10px 30px rgba(0,0,0,0.3), 
                           inset 0 0 60px rgba(255,58,58,0.1), 
                           ${rotateY * 0.7}px ${rotateX * 0.7}px 15px rgba(255,58,58,0.25)`,
                background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(30,30,30,0.8) 0%, rgba(18,18,18,0.95) 60%)`,
                duration: 0.3
            });
        });
        
        // Resetar ao sair do card
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                background: "rgba(30,30,30,0.5)",
                duration: 0.5,
                ease: "power1.out"
            });
            
            gsap.to(content, {
                z: 0,
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power1.out"
            });
            
            if (backdrop) {
                gsap.to(backdrop, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
        });
        
        // Revelar o card quando ele entrar na viewport
        ScrollTrigger.create({
            trigger: card,
            start: "top 90%",
            onEnter: () => {
                gsap.fromTo(card, 
                    { y: 50, opacity: 0, rotateX: 10 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        rotateX: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }
                );
            },
            once: true
        });
    });
}

// Sistemas de partículas para ícones
function initIconParticles() {
    const iconWrappers = document.querySelectorAll('.icon-wrapper');
    
    iconWrappers.forEach(wrapper => {
        const particleContainer = wrapper.querySelector('.icon-particle-system');
        if (!particleContainer) return;
        
        // Criar canvas para o sistema de partículas
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        particleContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Configurações do sistema de partículas
        const particles = [];
        const particleCount = 20;
        
        // Criar partículas iniciais
        for (let i = 0; i < particleCount; i++) {
            createParticle(particles);
        }
        
        // Função para criar uma partícula
        function createParticle(particleArray) {
            particleArray.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                color: `rgba(255, ${Math.floor(Math.random() * 50 + 30)}, ${Math.floor(Math.random() * 50 + 30)}, ${Math.random() * 0.5 + 0.3})`,
                life: 0,
                maxLife: Math.random() * 100 + 50
            });
        }
        
        // Renderizar e atualizar o sistema de partículas
        function animate() {
            // Limpar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Atualizar e desenhar partículas
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Aumentar contador de vida
                p.life++;
                
                // Remover partículas mortas
                if (p.life >= p.maxLife) {
                    particles.splice(i, 1);
                    i--;
                    createParticle(particles);
                    continue;
                }
                
                // Calcular opacidade baseada na vida
                const opacity = 1 - (p.life / p.maxLife);
                
                // Atualizar posição
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Desenhar partícula
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(')', `, ${opacity})`).replace('rgba', 'rgba');
                ctx.fill();
                
                // Adicionar um brilho
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(')', `, ${opacity * 0.3})`).replace('rgba', 'rgba');
                ctx.fill();
            }
            
            requestAnimationFrame(animate);
        }
        
        // Iniciar animação
        animate();
        
        // Aumentar número de partículas no hover
        wrapper.addEventListener('mouseenter', () => {
            // Adicionar mais partículas no hover
            for (let i = 0; i < 10; i++) {
                createParticle(particles);
            }
        });
    });
}

// Animar a linha de metodologia
function initMethodologyTimeline() {
    const methodology = document.querySelector('.methodology');
    const flowItems = document.querySelectorAll('.flow-item');
    const flowConnector = document.querySelector('.flow-connector');
    
    if (!methodology || !flowConnector || flowItems.length === 0) return;
    
    // Configurar ScrollTrigger
    ScrollTrigger.create({
        trigger: methodology,
        start: "top 70%",
        onEnter: () => {
            methodology.classList.add('in-view');
        }
    });
}

// Animar elementos flutuantes decorativos
function initFloatingElements() {
    const floatingEls = document.querySelectorAll('.floating-el');
    
    floatingEls.forEach((el, index) => {
        const speed = parseFloat(el.dataset.speed) || 1;
        const delay = index * 0.2;
        
        // Animação de flutuação aleatória
        gsap.to(el, {
            x: "random(-50, 50)",
            y: "random(-50, 50)",
            duration: 10 * speed,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: delay
        });
    });
}

// Animações baseadas em scroll
function initScrollAnimations() {
    // Ativação da linha de metodologia
    const methodologySection = document.querySelector('.methodology');
    if (methodologySection) {
        ScrollTrigger.create({
            trigger: methodologySection,
            start: "top 70%",
            onEnter: () => {
                methodologySection.classList.add('in-view');
            }
        });
    }
    
    // Animação de texto dividido
    const splitText = document.querySelectorAll('.split-text');
    splitText.forEach(text => {
        // Se a biblioteca Splitting estiver disponível
        if (typeof Splitting !== 'undefined') {
            const result = Splitting({ target: text, by: 'chars' });
            const chars = result[0].chars;
            
            gsap.from(chars, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 80%"
                },
                opacity: 0,
                y: 20,
                rotateX: -90,
                stagger: 0.02,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });
    
    // Animação para os subtítulos
    const subtitles = document.querySelectorAll('.section-subtitle:not(.split-text)');
    subtitles.forEach(subtitle => {
        gsap.from(subtitle, {
            scrollTrigger: {
                trigger: subtitle,
                start: "top 85%"
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}

// Exportar funções para uso em outros arquivos
window.ExpertiseInteractions = {
    initPerspectiveCards,
    initIconParticles,
    initMethodologyTimeline,
    initFloatingElements,
    initScrollAnimations
};
