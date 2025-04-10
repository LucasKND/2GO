/**
 * Animações de texto avançadas
 * Implementa efeitos de glitch, divisão, onda e reconstrução de texto
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar biblioteca Splitting para dividir textos em caracteres/palavras
    if (typeof Splitting !== 'undefined') {
        const splitResults = Splitting({ target: '.split-text, .split-chars', by: 'chars' });
        
        // Aplicar animações personalizadas para cada resultado
        splitResults.forEach(result => {
            const chars = result.chars;
            const words = result.words;
            const element = result.el;
            
            // Diferentes efeitos baseados na classe do elemento
            if (element.classList.contains('split-text')) {
                // Animação de entrada para texto dividido palavra por palavra
                gsap.fromTo(chars, {
                    opacity: 0,
                    y: 20,
                    rotateX: -90
                }, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    stagger: 0.02,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%"
                    }
                });
            } else if (element.classList.contains('split-chars')) {
                // Animação de onda para caracteres
                chars.forEach((char, index) => {
                    gsap.set(char, { transformOrigin: "center center -30px" });
                });
                
                gsap.fromTo(chars, {
                    opacity: 0,
                    scale: 0,
                    rotationY: -120
                }, {
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 1.2,
                    stagger: 0.03,
                    ease: "elastic.out(1, 0.3)",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%"
                    }
                });
            }
        });
    }
    
    // Efeito de glitch para títulos
    initGlitchEffect();
    
    // Efeito de texto líquido para títulos específicos
    initLiquidTextEffect();
    
    // Efeito de máquina de escrever para textos selecionados
    initTypewriterEffect();
});

// Efeito de glitch para títulos
function initGlitchEffect() {
    const glitchTitles = document.querySelectorAll('.glitch-title');
    
    glitchTitles.forEach(title => {
        // Criar camadas de glitch
        const glitchWrapper = document.createElement('div');
        glitchWrapper.classList.add('glitch-wrapper');
        
        // Obter texto e atributo data-text
        const originalText = title.textContent;
        const glitchText = title.getAttribute('data-text') || originalText;
        
        // Limpar conteúdo original
        title.textContent = '';
        
        // Criar camadas de glitch
        const textElement = document.createElement('div');
        textElement.classList.add('glitch-text', 'original');
        textElement.textContent = glitchText;
        
        const beforeElement = document.createElement('div');
        beforeElement.classList.add('glitch-text', 'before');
        beforeElement.textContent = glitchText;
        
        const afterElement = document.createElement('div');
        afterElement.classList.add('glitch-text', 'after');
        afterElement.textContent = glitchText;
        
        // Montar estrutura
        glitchWrapper.appendChild(beforeElement);
        glitchWrapper.appendChild(textElement);
        glitchWrapper.appendChild(afterElement);
        title.appendChild(glitchWrapper);
        
        // Adicionar evento de movimento do mouse para ampliar efeito
        document.addEventListener('mousemove', e => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
            
            gsap.to(beforeElement, {
                x: moveX * 0.5,
                y: moveY * 0.7,
                duration: 0.5
            });
            
            gsap.to(afterElement, {
                x: -moveX * 0.5,
                y: -moveY * 0.7,
                duration: 0.5
            });
        });
        
        // Ativar efeito de glitch em intervalos aleatórios
        const triggerGlitch = () => {
            title.classList.add('glitching');
            
            setTimeout(() => {
                title.classList.remove('glitching');
            }, 200 + Math.random() * 300);
            
            // Agendar próximo glitch
            const nextGlitchDelay = 3000 + Math.random() * 5000;
            setTimeout(triggerGlitch, nextGlitchDelay);
        };
        
        // Iniciar efeito de glitch
        setTimeout(triggerGlitch, 2000 + Math.random() * 2000);
        
        // Ativar glitch ao entrar na visualização
        ScrollTrigger.create({
            trigger: title,
            start: "top 80%",
            onEnter: () => {
                title.classList.add('glitch-active');
                setTimeout(() => title.classList.add('glitching'), 500);
                setTimeout(() => title.classList.remove('glitching'), 800);
            }
        });
    });
}

// Efeito de texto líquido para subtítulos
function initLiquidTextEffect() {
    const liquidTexts = document.querySelectorAll('.liquid-text');
    
    liquidTexts.forEach(text => {
        // Adicionar ScrollTrigger para efeito de entrada
        ScrollTrigger.create({
            trigger: text,
            start: "top 85%",
            onEnter: () => {
                // Cria uma timeline para a animação de entrada
                const tl = gsap.timeline();
                
                tl.fromTo(text, {
                    opacity: 0,
                    filter: 'blur(10px)',
                    scale: 0.8
                }, {
                    duration: 0.8,
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                    ease: "power3.out"
                });
                
                // Adicionar efeito de "líquido" na linha sob o texto
                if (text.classList.contains('expertise-title')) {
                    const parent = text.closest('.expertise-item-content');
                    
                    tl.fromTo(text.parentElement, {
                        background: 'linear-gradient(90deg, rgba(255,58,58,0) 0%, rgba(255,58,58,0) 100%)',
                        backgroundSize: '200% 3px',
                        backgroundPosition: 'right bottom',
                        backgroundRepeat: 'no-repeat'
                    }, {
                        backgroundImage: 'linear-gradient(90deg, rgba(255,58,58,1) 0%, rgba(255,107,107,1) 50%, rgba(255,58,58,1) 100%)',
                        backgroundPosition: 'left bottom',
                        duration: 1.2,
                        ease: "sine.inOut"
                    }, "-=0.4");
                }
            },
            once: true
        });
    });
}

// Efeito de máquina de escrever para textos selecionados
function initTypewriterEffect() {
    // Aplicar o efeito a elementos com classe específica, como depoimentos
    const typewriterElements = document.querySelectorAll('.testimonial-content p');
    
    typewriterElements.forEach((element, index) => {
        // Obter o texto original
        const originalText = element.textContent;
        
        // Criar wrapper para o cursor
        const wrapper = document.createElement('span');
        wrapper.classList.add('typewriter-wrapper');
        
        const textSpan = document.createElement('span');
        textSpan.classList.add('typewriter-text');
        
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typewriter-cursor');
        cursorSpan.textContent = '|';
        
        // Substituir conteúdo
        element.textContent = '';
        wrapper.appendChild(textSpan);
        wrapper.appendChild(cursorSpan);
        element.appendChild(wrapper);
        
        // Configurar ScrollTrigger para disparar a animação quando o elemento entrar na visualização
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            onEnter: () => {
                // Iniciar efeito somente quando o elemento for visível
                if (index === 0) { // Aplicar apenas ao primeiro depoimento visível
                    typeText(textSpan, originalText, 0, 30);
                }
            },
            once: true
        });
    });
    
    // Função para efeito de digitação
    function typeText(element, text, index, speed) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(() => typeText(element, text, index, speed), speed);
        }
    }
    
    // Adicionar manipulador para os dots dos testimonials
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    
    testimonialDots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
            // Obter todos os depoimentos
            const testimonials = document.querySelectorAll('.testimonial');
            
            // Obter o conteúdo do depoimento selecionado
            const selectedTestimonial = testimonials[dotIndex];
            const textElement = selectedTestimonial.querySelector('.testimonial-content p');
            const originalText = textElement.getAttribute('data-original-text') || textElement.textContent;
            
            // Guardar o texto original como atributo se ainda não existir
            if (!textElement.getAttribute('data-original-text')) {
                textElement.setAttribute('data-original-text', originalText);
            }
            
            // Criar efeito de máquina de escrever para o novo depoimento
            const textSpan = textElement.querySelector('.typewriter-text') || textElement;
            textSpan.textContent = '';
            typeText(textSpan, originalText, 0, 30);
        });
    });
}

// Exportar funções para uso em outros arquivos
window.TextAnimations = {
    initGlitchEffect,
    initLiquidTextEffect,
    initTypewriterEffect
};
