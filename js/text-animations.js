document.addEventListener('DOMContentLoaded', () => {
    if (typeof Splitting !== 'undefined') {
        const splitResults = Splitting({ target: '.split-text, .split-chars', by: 'chars' });
        
        splitResults.forEach(result => {
            const chars = result.chars;
            const words = result.words;
            const element = result.el;
            
            if (element.classList.contains('split-text')) {
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
    
    initGlitchEffect();
    initLiquidTextEffect();
    initTypewriterEffect();
    initLetterRepulsionEffect();
});

function initGlitchEffect() {
    const glitchTitles = document.querySelectorAll('.glitch-title');
    
    glitchTitles.forEach(title => {
        const glitchWrapper = document.createElement('div');
        glitchWrapper.classList.add('glitch-wrapper');
        
        const originalText = title.textContent;
        const glitchText = title.getAttribute('data-text') || originalText;
        
        title.textContent = '';
        
        const textElement = document.createElement('div');
        textElement.classList.add('glitch-text', 'original');
        textElement.textContent = glitchText;
        
        const beforeElement = document.createElement('div');
        beforeElement.classList.add('glitch-text', 'before');
        beforeElement.textContent = glitchText;
        
        const afterElement = document.createElement('div');
        afterElement.classList.add('glitch-text', 'after');
        afterElement.textContent = glitchText;
        
        glitchWrapper.appendChild(beforeElement);
        glitchWrapper.appendChild(textElement);
        glitchWrapper.appendChild(afterElement);
        title.appendChild(glitchWrapper);
        
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
        
        const triggerGlitch = () => {
            title.classList.add('glitching');
            
            setTimeout(() => {
                title.classList.remove('glitching');
            }, 200 + Math.random() * 300);
            
            const nextGlitchDelay = 3000 + Math.random() * 5000;
            setTimeout(triggerGlitch, nextGlitchDelay);
        };
        
        setTimeout(triggerGlitch, 2000 + Math.random() * 2000);
        
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

function initLiquidTextEffect() {
    const liquidTexts = document.querySelectorAll('.liquid-text');
    
    liquidTexts.forEach(text => {
        ScrollTrigger.create({
            trigger: text,
            start: "top 85%",
            onEnter: () => {
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

function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.testimonial-content p');
    
    typewriterElements.forEach((element, index) => {
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

// Novo efeito de repulsão de letras com suporte a gradiente
function initLetterRepulsionEffect() {
    console.log("Inicializando o efeito de repulsão de texto");
    
    const repulsionElements = document.querySelectorAll('.repulsion-text');
    console.log("Elementos encontrados:", repulsionElements.length);
    
    repulsionElements.forEach(element => {
        // Verificar se o elemento já foi processado para evitar duplicação
        if (element.classList.contains('repulsion-processed')) {
            return;
        }
        
        // Obter o texto original
        const originalText = element.innerText || element.textContent;
        console.log("Texto para repulsão:", originalText);
        
        // Guardar o estilo de background original para aplicar a cada letra
        const computedStyle = window.getComputedStyle(element);
        const originalBackground = computedStyle.background;
        
        // Limpar o conteúdo original
        element.innerHTML = '';
        
        // Dividir o texto em letras e envolver cada uma em um span
        Array.from(originalText).forEach(char => {
            const charSpan = document.createElement('span');
            
            // Preservar espaços e quebras de linha
            if (char === ' ') {
                charSpan.innerHTML = '&nbsp;';
            } else if (char === '\n') {
                charSpan.innerHTML = '<br>';
            } else {
                charSpan.textContent = char;
            }
            
            charSpan.classList.add('repulsion-char');
            
            // Aplicar estilos essenciais
            charSpan.style.display = 'inline-block';
            charSpan.style.position = 'relative';
            charSpan.style.transition = 'transform 0.2s ease-out';
            charSpan.style.color = 'transparent';
            charSpan.style.background = originalBackground;
            charSpan.style.webkitBackgroundClip = 'text';
            charSpan.style.backgroundClip = 'text';
            
            element.appendChild(charSpan);
        });
        
        // Marcar como processado para evitar processamento duplo
        element.classList.add('repulsion-processed');
        
        // Adicionar eventos de mouse para o elemento
        element.addEventListener('mousemove', e => {
            const chars = element.querySelectorAll('.repulsion-char');
            const rect = element.getBoundingClientRect();
            
            // Posição relativa do mouse dentro do elemento
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            chars.forEach(char => {
                const charRect = char.getBoundingClientRect();
                
                // Centro do caractere relativo ao elemento pai
                const charX = charRect.left - rect.left + charRect.width / 2;
                const charY = charRect.top - rect.top + charRect.height / 2;
                
                // Calcular a distância entre o cursor e o caractere
                const distX = mouseX - charX;
                const distY = mouseY - charY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                // Raio de influência do cursor (em pixels)
                const radius = 60;
                
                if (distance < radius) {
                    // Calcular força de repulsão (mais forte quanto mais perto)
                    const force = (1 - distance / radius) * 10;
                    
                    // Normalizar o vetor de direção
                    const dirX = -distX / distance;
                    const dirY = -distY / distance;
                    
                    // Aplicar a transformação
                    char.style.transform = `translate(${dirX * force}px, ${dirY * force}px)`;
                } else {
                    // Se estiver fora do raio de ação, retornar à posição original
                    char.style.transform = 'translate(0, 0)';
                }
            });
        });
        
        // Retornar todas as letras à posição original quando o mouse sai
        element.addEventListener('mouseleave', () => {
            const chars = element.querySelectorAll('.repulsion-char');
            chars.forEach(char => {
                char.style.transform = 'translate(0, 0)';
            });
        });
    });
}

// Exportar funções para uso em outros arquivos
window.TextAnimations = {
    initGlitchEffect,
    initLiquidTextEffect,
    initTypewriterEffect,
    initLetterRepulsionEffect
};
