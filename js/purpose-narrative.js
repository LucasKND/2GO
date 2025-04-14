document.addEventListener('DOMContentLoaded', () => {
    // Verificar se a seção existe
    const purposeSection = document.querySelector('#purpose');
    if (!purposeSection) return;

    initBackgroundLayers();
    initCodeToTitle();
    initProgressiveText();
    initCentralSymbol();
    initValueCards();
    initConnectionLines();
    
    // Configurar ScrollTrigger para a seção
    setupScrollTriggers();
});

// Iniciar camadas de fundo animadas
function initBackgroundLayers() {
    const shapesLayer = document.querySelector('.layer-shapes');
    const particlesLayer = document.querySelector('.layer-particles');
    const connectionsLayer = document.querySelector('.layer-connections');
    
    if (!shapesLayer || !particlesLayer || !connectionsLayer) return;
    
    // Criar formas abstratas aleatórias no fundo
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.classList.add('abstract-shape');
        
        // Estilo da forma
        shape.style.width = `${Math.random() * 100 + 50}px`;
        shape.style.height = `${Math.random() * 100 + 50}px`;
        shape.style.borderRadius = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;
        shape.style.background = `radial-gradient(circle at center, rgba(255,58,58,${Math.random() * 0.4 + 0.1}) 0%, rgba(255,58,58,0) 70%)`;
        shape.style.position = 'absolute';
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Animação
        shape.style.animation = `floatShape ${Math.random() * 20 + 10}s infinite ease-in-out`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        
        shapesLayer.appendChild(shape);
    }
    
    // Criar partículas de dados
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('data-particle');
        
        // Estilo da partícula
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = `${Math.random() * 4 + 2}px`;
        particle.style.borderRadius = '50%';
        particle.style.background = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
        particle.style.position = 'absolute';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        // Animação
        particle.style.animation = `floatParticle ${Math.random() * 15 + 5}s infinite linear`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesLayer.appendChild(particle);
    }
    
    // Criar linhas de conexão
    for (let i = 0; i < 10; i++) {
        const connection = document.createElement('div');
        connection.classList.add('data-connection');
        
        // Estilo da linha
        connection.style.width = `${Math.random() * 100 + 50}px`;
        connection.style.height = '1px';
        connection.style.background = `linear-gradient(to right, rgba(255,58,58,0) 0%, rgba(255,58,58,${Math.random() * 0.3 + 0.1}) 50%, rgba(255,58,58,0) 100%)`;
        connection.style.position = 'absolute';
        connection.style.top = `${Math.random() * 100}%`;
        connection.style.left = `${Math.random() * 100}%`;
        connection.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Animação
        connection.style.animation = `pulseConnection ${Math.random() * 4 + 2}s infinite ease-in-out`;
        connection.style.animationDelay = `${Math.random() * 2}s`;
        
        connectionsLayer.appendChild(connection);
    }
    
    // Adicionar efeito de parallax ao scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const purposeRect = document.querySelector('#purpose').getBoundingClientRect();
        
        // Só aplicar efeito quando a seção estiver visível
        if (purposeRect.top < window.innerHeight && purposeRect.bottom > 0) {
            const scrollFactor = (scrollY - purposeRect.top) / purposeRect.height;
            
            shapesLayer.style.transform = `translateY(${scrollFactor * -50}px)`;
            particlesLayer.style.transform = `translateY(${scrollFactor * -30}px)`;
            connectionsLayer.style.transform = `translateY(${scrollFactor * -20}px)`;
        }
    });
}

// Animação de código para título
function initCodeToTitle() {
    const titleWords = document.querySelectorAll('.word-reveal');
    
    if (!titleWords.length) return;
    
    // Animar imediatamente as palavras do título
    gsap.to(titleWords, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.2
    });
}

// Texto com revelação progressiva
function initProgressiveText() {
    const textSegments = document.querySelectorAll('.text-segment');
    
    if (!textSegments.length) return;
    
    // Timeline para a animação
    const textTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.progressive-text',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Animar cada segmento de texto
    textSegments.forEach((segment, index) => {
        textTL.to(segment, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: index * 0.2
        }, index === 0 ? '+=0.5' : '-=0.4');
    });
    
    // Destacar palavras importantes
    const highlights = document.querySelectorAll('.highlight-word');
    
    highlights.forEach((highlight, index) => {
        textTL.fromTo(highlight, 
            { backgroundSize: '0% 100%' },
            { 
                backgroundSize: '100% 100%',
                duration: 0.8,
                ease: 'power2.out'
            },
        '+=0.1');
    });
}

// Símbolo 3D central
function initCentralSymbol() {
    const symbolContainer = document.getElementById('purpose-symbol');
    const resonance = document.querySelector('.symbol-resonance');
    const description = document.querySelector('.symbol-description');
    
    if (!symbolContainer || !resonance || !description) return;
    
    // Verificar se Three.js está disponível
    if (typeof THREE === 'undefined') {
        console.warn('Three.js não está disponível. O símbolo 3D não será renderizado.');
        return;
    }
    
    // Criar cena Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer com fundo transparente
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(200, 200);
    symbolContainer.appendChild(renderer.domElement);
    
    // Criar geometria icosaedro (símbolo de transformação)
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    
    // Material com wireframe e glow
    const material = new THREE.MeshBasicMaterial({
        color: 0xff3a3a,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const symbol = new THREE.Mesh(geometry, material);
    scene.add(symbol);
    
    // Adicionar pontos nos vértices
    const vertices = geometry.attributes.position;
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', vertices);
    
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xff5555,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
    
    // Timeline para a animação
    const symbolTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.central-symbol',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });
    
    // Inicialmente invisível
    gsap.set(symbolContainer, { opacity: 0, scale: 0.5 });
    
    // Animar aparecimento
    symbolTL.to(symbolContainer, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
    });
    
    // Animar círculos de ressonância
    symbolTL.to(resonance, {
        opacity: 0.6,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.8');
    
    // Animar descrição
    symbolTL.to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5');
    
    // Animar o símbolo continuamente
    function animate() {
        requestAnimationFrame(animate);
        
        symbol.rotation.x += 0.01;
        symbol.rotation.y += 0.01;
        
        // Seguir o mouse sutilmente
        if (window.mouseX && window.mouseY) {
            symbol.rotation.x += (window.mouseY * 0.0005);
            symbol.rotation.y += (window.mouseX * 0.0005);
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Pulsar círculos de ressonância
    gsap.to(resonance, {
        scale: 1.1,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Cards de valores interativos
function initValueCards() {
    const cards = document.querySelectorAll('.value-card');
    
    if (!cards.length) return;
    
    // Timeline para a animação
    const cardsTL = gsap.timeline({
        scrollTrigger: {
            trigger: '.values-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Animar cada card aparecendo
    cards.forEach((card, index) => {
        cardsTL.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: index * 0.15
        }, index === 0 ? '+=0.2' : '-=0.6');
    });
    
    // Adicionar partículas aos ícones
    cards.forEach(card => {
        const iconParticles = card.querySelector('.icon-particles');
        if (!iconParticles) return;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('span');
            particle.classList.add('icon-particle');
            
            // Estilo da partícula
            particle.style.width = `${Math.random() * 3 + 2}px`;
            particle.style.height = `${Math.random() * 3 + 2}px`;
            particle.style.borderRadius = '50%';
            particle.style.background = `rgba(255,58,58,${Math.random() * 0.5 + 0.5})`;
            particle.style.position = 'absolute';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            // Animação
            particle.style.animation = `floatIconParticle ${Math.random() * 2 + 1}s infinite alternate ease-in-out`;
            particle.style.animationDelay = `${Math.random()}s`;
            
            iconParticles.appendChild(particle);
        }
    });
    
    // Animar os passos da história visual ao virar o card
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const steps = card.querySelectorAll('.story-step');
            
            steps.forEach((step, index) => {
                gsap.to(step, {
                    scale: 1.2,
                    background: 'rgba(255, 58, 58, 0.2)',
                    delay: index * 0.2,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });
        });
    });
}

// Linhas de conexão entre elementos
function initConnectionLines() {
    // Precisamos esperar que todos os elementos estejam renderizados
    // para calcular corretamente suas posições
    setTimeout(() => {
        const centralSymbol = document.querySelector('.central-symbol');
        const innovationCard = document.querySelector('[data-value="innovation"]');
        const resultsCard = document.querySelector('[data-value="results"]');
        const teamCard = document.querySelector('[data-value="team"]');
        
        const paths = {
            centralToInnovation: document.getElementById('central-to-innovation'),
            centralToResults: document.getElementById('central-to-results'),
            centralToTeam: document.getElementById('central-to-team')
        };
        
        if (!centralSymbol || !innovationCard || !resultsCard || !teamCard || 
            !paths.centralToInnovation || !paths.centralToResults || !paths.centralToTeam) return;
        
        // Obter posições dos elementos
        const centralRect = centralSymbol.getBoundingClientRect();
        const innovationRect = innovationCard.getBoundingClientRect();
        const resultsRect = resultsCard.getBoundingClientRect();
        const teamRect = teamCard.getBoundingClientRect();
        
        // Calcular pontos relativos ao SVG
        const purposeRect = document.querySelector('#purpose').getBoundingClientRect();
        
        const getRelativePoint = (rect) => {
            return {
                x: rect.left + rect.width / 2 - purposeRect.left,
                y: rect.top + rect.height / 2 - purposeRect.top
            };
        };
        
        const central = getRelativePoint(centralRect);
        const innovation = getRelativePoint(innovationRect);
        const results = getRelativePoint(resultsRect);
        const team = getRelativePoint(teamRect);
        
        // Definir os paths SVG
        paths.centralToInnovation.setAttribute('d', `M${central.x},${central.y} C${central.x},${innovation.y - 50} ${innovation.x},${central.y + 50} ${innovation.x},${innovation.y}`);
        
        paths.centralToResults.setAttribute('d', `M${central.x},${central.y} C${central.x + 50},${results.y - 50} ${results.x - 50},${central.y + 50} ${results.x},${results.y}`);
        
        paths.centralToTeam.setAttribute('d', `M${central.x},${central.y} C${central.x + 100},${team.y - 50} ${team.x - 100},${central.y + 50} ${team.x},${team.y}`);
        
        // Animar as linhas
        const connectionTL = gsap.timeline({
            scrollTrigger: {
                trigger: '.connection-lines',
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Animar o desenho das linhas
        Object.values(paths).forEach(path => {
            connectionTL.to(path, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: 'power2.inOut'
            }, '-=1.3');
        });
    }, 1000);
}

// Configurar ScrollTriggers para toda a seção
function setupScrollTriggers() {
    if (typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollTrigger não está disponível.');
        return;
    }
    
    // Animar a linha de origem quando a seção entra na tela
    gsap.from('.origin-line', {
        height: 0,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#purpose',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    // Animar o ponto de origem
    gsap.from('.origin-dot', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '#purpose',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        delay: 0.8
    });
    
    // Capturar movimento do mouse para efeitos parallax
    document.addEventListener('mousemove', (e) => {
        // Normalizar coordenadas do mouse (-1 a 1)
        window.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        window.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Aplicar movimento sutil ao fundo
        const shapesLayer = document.querySelector('.layer-shapes');
        const particlesLayer = document.querySelector('.layer-particles');
        
        if (shapesLayer && particlesLayer) {
            shapesLayer.style.transform = `translate(${window.mouseX * -15}px, ${window.mouseY * -15}px)`;
            particlesLayer.style.transform = `translate(${window.mouseX * -10}px, ${window.mouseY * -10}px)`;
        }
    });
}

// CSS para animações
const style = document.createElement('style');
style.textContent = `
@keyframes floatShape {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(20px, 10px) rotate(10deg); }
}

@keyframes floatParticle {
    0% { transform: translate(0, 0); }
    25% { transform: translate(20px, 20px); }
    50% { transform: translate(0, 40px); }
    75% { transform: translate(-20px, 20px); }
    100% { transform: translate(0, 0); }
}

@keyframes pulseConnection {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.4; }
}

@keyframes floatIconParticle {
    0% { transform: translate(0, 0); }
    100% { transform: translate(5px, 5px); }
}
`;
document.head.appendChild(style);
