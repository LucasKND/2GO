/**
 * Hero Experience - Implementação de efeitos visuais 3D minimalistas
 * Versão simplificada apenas com background 3D e indicador de scroll
 */

// Variáveis globais
let scene, camera, renderer, clock;
let nebula, stars;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isIntroAnimationPlaying = true; // Nova variável para controlar a animação de entrada
let starfieldParticles; // Nova variável para o efeito de estrelas em velocidade da luz
let introAnimationCompleted = false; // Para verificar se a animação de entrada já terminou

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Three.js para nebulosa
    initHeroCanvas();
    
    // Criar efeito de velocidade da luz para a animação de entrada
    createStarfieldEffect();
    
    // Iniciar a animação de entrada
    startIntroAnimation();
    
    // Efeito de scroll para transição
    initScrollTransition();
    
    // Inicializar efeito de magnetismo dos botões
    initButtonMagnetism();
    
    // Inicializar o controle do menu toggle
    initMenuToggle();
});

// Inicializar o canvas Three.js
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // Inicializar cena, câmera e renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45; // Ligeiramente afastado para abrir espaço para o texto
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    
    // Inicializar o relógio para animações
    clock = new THREE.Clock();
    
    // Criar elementos 3D
    createNebula();
    createStars();
    
    // Adicionar tratamento para redimensionamento de janela
    window.addEventListener('resize', onWindowResize);
    
    // Adicionar detecção de movimento do mouse
    document.addEventListener('mousemove', onMouseMove);
    
    // Iniciar loop de animação
    animate();
}

// Criar efeito de nebulosa com partículas circulares
function createNebula() {
    // Criar geometria para a nebulosa
    const geometry = new THREE.BufferGeometry();
    const particleCount = 800; // Reduzido ainda mais para melhor performance
    
    // Arrays para posições e cores
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Preencher arrays com valores aleatórios
    for (let i = 0; i < particleCount; i++) {
        // Posicionar em forma de esfera, mas garantindo distância mínima da câmera
        // Aumentar o raio mínimo para manter partículas mais afastadas do centro onde estará o texto
        const radius = 40 + Math.random() * 40; // Ajustado para criar mais espaço para o texto
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        // Calcular posição esférica
        positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.cos(theta);
        
        // Cores - predominantemente vermelho e roxo
        colors[i * 3] = Math.random() * 0.5 + 0.5; // R
        colors[i * 3 + 1] = Math.random() * 0.2; // G
        colors[i * 3 + 2] = Math.random() * 0.3 + 0.2; // B
        
        // Ajuste de tamanho baseado na distância
        // Partículas mais distantes podem ser maiores sem parecer muito grandes na tela
        const distance = Math.sqrt(
            positions[i * 3] * positions[i * 3] + 
            positions[i * 3 + 1] * positions[i * 3 + 1] + 
            positions[i * 3 + 2] * positions[i * 3 + 2]
        );
        
        // Tamanho proporcional à distância - partículas mais distantes podem ser maiores
        sizes[i] = Math.min(2.5, (distance / 40) * (Math.random() * 2 + 1));
    }
    
    // Adicionar atributos à geometria
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Material para partículas com shaders customizados para garantir formato circular
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                // Criar partículas perfeitamente circulares
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Descartar pixels fora do círculo
                if (dist > 0.5) {
                    discard;
                }
                
                // Suavizar as bordas
                float smoothedAlpha = smoothstep(0.5, 0.4, dist);
                
                gl_FragColor = vec4(vColor, smoothedAlpha);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    // Criar o sistema de partículas
    nebula = new THREE.Points(geometry, material);
    scene.add(nebula);
}

// Criar estrelas circulares
function createStars() {
    const geometry = new THREE.BufferGeometry();
    const starCount = 500; // Reduzido para menos densidade
    
    // Arrays para posições
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    // Preencher com posições aleatórias
    for (let i = 0; i < starCount; i++) {
        // Distribuição mais uniforme, evitando aglomeração próxima à câmera
        const distance = 40 + Math.random() * 70; // Distância mínima aumentada
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = distance * Math.cos(theta);
        
        // Tamanhos variados para as estrelas, proporcional à distância
        const calculatedDistance = Math.sqrt(
            positions[i * 3] * positions[i * 3] + 
            positions[i * 3 + 1] * positions[i * 3 + 1] + 
            positions[i * 3 + 2] * positions[i * 3 + 2]
        );
        
        sizes[i] = Math.min(1.2, (calculatedDistance / 50) * (Math.random() * 0.8 + 0.5));
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Material para as estrelas com shader para garantir formato circular
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            varying float vSize;
            
            void main() {
                vSize = size;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vSize;
            
            void main() {
                // Criar estrelas perfeitamente circulares
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                // Descartar pixels fora do círculo
                if (dist > 0.5) {
                    discard;
                }
                
                // Criar um brilho no centro
                float brightness = 1.0 - smoothstep(0.0, 0.5, dist);
                vec3 color = vec3(1.0, 1.0, 1.0) * brightness;
                
                gl_FragColor = vec4(color, brightness);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// Criar o efeito de estrelas em velocidade da luz
function createStarfieldEffect() {
    // Geometria para as partículas do efeito de velocidade da luz
    const geometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    // Posicionar as partículas em um tubo à frente da câmera
    for (let i = 0; i < particleCount; i++) {
        // Distância da câmera (mais longe = à frente da câmera)
        const z = Math.random() * 600 - 300; // Entre -300 e 300
        
        // As estrelas mais distantes terão um raio máximo maior (efeito de perspectiva)
        const maxRadius = Math.abs(z) * 0.1 + 10;
        const radius = Math.random() * maxRadius;
        const theta = Math.random() * Math.PI * 2;
        
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = Math.sin(theta) * radius;
        positions[i * 3 + 2] = z;
        
        // Velocidade maior para estrelas mais longe do centro
        velocities[i] = radius * 0.02 + 0.5;
        
        // Tamanho - menor para simular distância
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Material para o efeito de velocidade da luz
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute float velocity;
            varying float vSize;
            varying float vVelocity;
            
            void main() {
                vSize = size;
                vVelocity = velocity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vSize;
            varying float vVelocity;
            
            void main() {
                // Criar estrelas alongadas para simular movimento
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                if (dist > 0.5) {
                    discard;
                }
                
                // Criar efeito de rastro na direção Z
                float trailFactor = 0.0;
                if (center.y < 0.0) {
                    // Aplicar o rastro apenas na metade de trás da partícula
                    trailFactor = -center.y * 8.0 * vVelocity;
                }
                
                // Maior velocidade = estrela mais alongada e brilhante
                float brightness = 1.0 - smoothstep(0.0, 0.5, dist - trailFactor);
                brightness *= vVelocity * 0.8; // Aumentado para mais brilho
                vec3 color = vec3(1.0, 1.0, 1.0) * brightness;
                
                gl_FragColor = vec4(color, brightness);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    starfieldParticles = new THREE.Points(geometry, material);
    starfieldParticles.visible = false; // Inicialmente invisível
    scene.add(starfieldParticles);
}

// Função para iniciar a animação de entrada
function startIntroAnimation() {
    if (!scene || !camera || !nebula || !stars || !starfieldParticles) return;
    
    isIntroAnimationPlaying = true;
    
    // Esconder elementos inicialmente
    nebula.visible = false;
    stars.visible = false;
    starfieldParticles.visible = true;
    
    // Posicionar a câmera longe (z = 500) para criar efeito de chegada
    camera.position.z = 500;
    
    // Adicionar classe de borramento inicial no body
    document.body.classList.add('hyperspace-blur');
    
    // Selecionar todos os elementos que devem ficar escondidos
    const navElements = document.querySelectorAll('.nav-hidden-on-landing');
    const heroContent = document.querySelector('.hero-content-hidden-on-landing');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator-hidden-on-landing');
    
    // Selecionar elementos específicos para animações coordenadas
    const logoElement = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('nav ul li');
    const socialIcons = document.querySelector('.social-icons');
    const menuToggle = document.querySelector('.menu-toggle');
    const heroTitle = heroContent ? heroContent.querySelector('.hero-title') : null;
    const heroDescription = heroContent ? heroContent.querySelector('.hero-description') : null;
    const buttons = heroContent ? heroContent.querySelectorAll('.cta-button') : [];
    const scrollText = scrollIndicator ? scrollIndicator.querySelector('.scroll-text') : null;
    const scrollArrow = scrollIndicator ? scrollIndicator.querySelector('.scroll-arrow') : null;
    
    // Esconder TODOS os elementos com estilo inline definitivo
    navElements.forEach(el => {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
    });
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.visibility = 'hidden';
        heroContent.style.pointerEvents = 'none';
    }
    
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.visibility = 'hidden';
        scrollIndicator.style.pointerEvents = 'none';
    }
    
    // Garantir que os ícones sociais e o botão toggle estejam inicialmente escondidos
    // Este passo é crucial, pois esses elementos podem não ser capturados pelo seletor inicial
    if (socialIcons) {
        socialIcons.style.opacity = '0';
        socialIcons.style.visibility = 'hidden';
        socialIcons.style.pointerEvents = 'none';
    }
    
    if (menuToggle) {
        menuToggle.style.opacity = '0';
        menuToggle.style.visibility = 'hidden';
        menuToggle.style.pointerEvents = 'none';
    }
    
    // Remover qualquer classe de animação existente
    const allAnimElements = [
        logoElement, 
        ...navLinks,
        socialIcons,
        menuToggle, 
        heroTitle, 
        heroDescription, 
        ...buttons, 
        scrollText, 
        scrollArrow
    ].filter(el => el); // Filtrar elementos nulos
    
    allAnimElements.forEach(el => {
        el.classList.remove(
            'nav-appear', 'title-appear', 'description-appear', 
            'button-appear', 'explore-appear', 'primary-button-appear',
            'delay-50', 'delay-100', 'delay-150', 'delay-200', 'delay-250',
            'delay-300', 'delay-350', 'delay-400', 'delay-450', 'delay-500',
            'delay-600', 'delay-700', 'delay-800'
        );
    });
    
    // Animação usando GSAP
    const tl = gsap.timeline({
        onComplete: () => {
            // Quando a animação terminar, mostrar o fundo normal e esconder efeito de velocidade
            isIntroAnimationPlaying = false;
            introAnimationCompleted = true;
            nebula.visible = true;
            stars.visible = true;
            starfieldParticles.visible = false;
            
            // Adicionar classe para indicar que a animação foi concluída
            document.body.classList.add('completed');
            
            // Resetar a câmera para a posição normal
            gsap.to(camera.position, {
                z: 45,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    // Só iniciar a sequência de animações quando a câmera estiver em posição
                    console.log("Câmera posicionada, iniciando sequência de animações");
                    
                    // Habilitar pointer-events para todos os containers
                    if (heroContent) heroContent.style.pointerEvents = 'auto';
                    if (scrollIndicator) scrollIndicator.style.pointerEvents = 'auto';
                    navElements.forEach(el => el.style.pointerEvents = 'auto');
                    
                    // Garantir que todos os elementos necessários possam receber eventos
                    if (socialIcons) socialIcons.style.pointerEvents = 'auto';
                    if (menuToggle) menuToggle.style.pointerEvents = 'auto';
                    
                    // Aplicar animações logo - com atraso menor para sincronizar
                    if (logoElement) {
                        setTimeout(() => {
                            logoElement.style.visibility = 'visible';
                            logoElement.style.opacity = '1';
                            logoElement.classList.add('nav-appear');
                        }, 50);
                    }
                    
                    // Animação para o botão de menu toggle - aparecendo logo no início
                    if (menuToggle) {
                        setTimeout(() => {
                            menuToggle.style.visibility = 'visible';
                            menuToggle.style.opacity = '1';
                            menuToggle.classList.add('nav-appear');
                        }, 100);
                    }
                    
                    // Animação para os ícones sociais - logo após o botão de menu
                    if (socialIcons) {
                        setTimeout(() => {
                            socialIcons.style.visibility = 'visible';
                            socialIcons.style.opacity = '1';
                            socialIcons.classList.add('nav-appear');
                        }, 150);
                    }
                    
                    // Aplicar animações para os links de navegação com atraso sequencial
                    navLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.style.visibility = 'visible';
                            link.style.opacity = '1';
                            link.classList.add('nav-appear');
                        }, 200 + (index * 100));
                    });
                    
                    // Animação para o título
                    if (heroTitle) {
                        setTimeout(() => {
                            heroTitle.style.visibility = 'visible';
                            heroTitle.style.opacity = '1';
                            heroTitle.classList.add('title-appear');
                        }, 300);
                    }
                    
                    // Animação para a descrição
                    if (heroDescription) {
                        setTimeout(() => {
                            heroDescription.style.visibility = 'visible';
                            heroDescription.style.opacity = '1';
                            heroDescription.classList.add('description-appear');
                        }, 500);
                    }
                    
                    // Animar botões com um efeito mais destacado
                    buttons.forEach((button, index) => {
                        const delay = 700 + (index * 150);
                        setTimeout(() => {
                            button.style.visibility = 'visible';
                            button.style.opacity = '1';
                            
                            // Aplicar animação diferente para o botão primário
                            if (button.classList.contains('primary-button')) {
                                button.classList.add('primary-button-appear');
                            } else {
                                button.classList.add('button-appear');
                            }
                        }, delay);
                    });
                    
                    // Animar o indicador "Explore" com um efeito de pulo
                    setTimeout(() => {
                        // Garantir que o container do indicador fique visível
                        if (scrollIndicator) {
                            scrollIndicator.style.visibility = 'visible';
                            scrollIndicator.style.opacity = '1';
                        }
                        
                        // Animar os elementos internos
                        if (scrollArrow) {
                            scrollArrow.style.visibility = 'visible';
                            scrollArrow.style.opacity = '1';
                            scrollArrow.classList.add('explore-appear');
                        }
                        
                        if (scrollText) {
                            scrollText.style.visibility = 'visible';
                            scrollText.style.opacity = '1';
                            scrollText.classList.add('explore-appear', 'delay-100');
                        }
                    }, 1000);
                }
            });
        }
    });
    
    // Animação de "viagem na velocidade da luz"
    tl.to(camera.position, {
        z: 45, // Posição final da câmera
        duration: 2.5,
        ease: "power3.in"
    });
    
    // Adicionar um efeito de tremor leve à câmera durante a viagem
    const shakeDuration = 2.5; // Mesma duração da animação principal
    const startTime = clock.getElapsedTime();
    
    // Função para adicionar tremor à câmera
    function addCameraShake() {
        if (!isIntroAnimationPlaying) return;
        
        const currentTime = clock.getElapsedTime() - startTime;
        if (currentTime > shakeDuration) return;
        
        // Calcular intensidade do tremor - mais forte no meio da animação
        const progress = currentTime / shakeDuration;
        const intensity = 0.3 * Math.sin(progress * Math.PI);
        
        // Aplicar tremor
        camera.position.x += (Math.random() * 2 - 1) * intensity;
        camera.position.y += (Math.random() * 2 - 1) * intensity;
        
        // Continuar a animação de tremor
        requestAnimationFrame(addCameraShake);
    }
    
    // Iniciar o efeito de tremor
    addCameraShake();
}

// Responder ao movimento do mouse
function onMouseMove(event) {
    // Normalizar coordenadas do mouse
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
    
    // Atualizar posição alvo com suavização
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;
}

// Redimensionar a janela
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (isIntroAnimationPlaying) {
        // Animar efeito de velocidade da luz
        if (starfieldParticles) {
            const positions = starfieldParticles.geometry.attributes.position.array;
            const velocities = starfieldParticles.geometry.attributes.velocity.array;
            const speeds = Array.from({ length: positions.length / 3 }, (_, i) => velocities[i]);
            
            // Mover as partículas para criar efeito de movimento
            for (let i = 0; i < positions.length; i += 3) {
                // Mover as partículas para frente (em direção à câmera)
                positions[i + 2] += speeds[i/3] * (25 - camera.position.z/20);
                
                // Se a partícula passar pela câmera, reposicioná-la longe
                if (positions[i + 2] > camera.position.z) {
                    const theta = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 40 + 10;
                    
                    positions[i] = Math.cos(theta) * radius;
                    positions[i + 1] = Math.sin(theta) * radius;
                    positions[i + 2] = camera.position.z - 500; // Reposicionar longe
                }
            }
            
            starfieldParticles.geometry.attributes.position.needsUpdate = true;
        }
    } else {
        // Rotação das nebulosas e estrelas no modo normal
        if (nebula) {
            nebula.rotation.x = elapsedTime * 0.05;
            nebula.rotation.y = elapsedTime * 0.03;
            
            // Responder ao movimento do mouse
            nebula.rotation.x += targetMouseY * 0.01;
            nebula.rotation.y += targetMouseX * 0.01;
        }
        
        if (stars) {
            stars.rotation.x = elapsedTime * 0.01;
            stars.rotation.y = elapsedTime * 0.02;
        }
        
        // Movimento suave da câmera com o mouse
        camera.position.x += (targetMouseX - camera.position.x) * 0.05;
        camera.position.y += (-targetMouseY - camera.position.y) * 0.05;
    }
    
    camera.lookAt(scene.position);
    
    // Renderizar a cena
    renderer.render(scene, camera);
}

// Efeito de transição com scroll
function initScrollTransition() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll suave para a próxima seção
            const nextSection = document.querySelector('#purpose');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Efeito de distorção com base no scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('header').offsetHeight;
        
        // Calcular progresso do scroll na hero section
        const progress = Math.min(scrollY / heroHeight, 1);
        
        // Aplicar efeito de distorção
        if (nebula && progress > 0) {
            // Distorcer a nebulosa conforme o scroll
            nebula.scale.set(1 + progress * 0.2, 1 + progress * 0.2, 1 + progress * 0.2);
            nebula.material.opacity = 1 - progress * 0.5;
        }
    });
}

// Efeito de magnetismo para os botões seguirem o cursor
function initButtonMagnetism() {
    const buttons = document.querySelectorAll('.hero-buttons .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            // Obter as dimensões e posição do botão
            const rect = button.getBoundingClientRect();
            
            // Calcular a posição do mouse em relação ao centro do botão
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calcular o deslocamento em relação ao centro
            const offsetX = (x / rect.width - 0.5) * 2;
            const offsetY = (y / rect.height - 0.5) * 2;
            
            // Aplicar o deslocamento (mais forte para o botão primário)
            const strength = button.classList.contains('primary-button') ? 15 : 10;
            const moveX = offsetX * strength;
            const moveY = offsetY * strength;
            
            // Animar o deslocamento suavemente com GSAP
            gsap.to(button, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Resetar a posição quando o mouse sai
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        // Adicionar um efeito sutil quando o botão é clicado
        button.addEventListener('mousedown', () => {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseup', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
    
    // Add support for space animations when not hovering
    buttons.forEach(button => {
        // Preserve the original buttonTremor animation when not hovering
        button.addEventListener('mouseenter', () => {
            // Store the current animation
            button.setAttribute('data-original-animation', button.style.animation);
            // Keep only the glow animation
            gsap.to(button, {
                animation: 'buttonGlow 6s ease-in-out infinite',
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseleave', () => {
            // After magnetism reset, restore the original animation
            setTimeout(() => {
                const originalAnimation = button.getAttribute('data-original-animation');
                if (originalAnimation) {
                    button.style.animation = originalAnimation;
                } else {
                    button.style.animation = 'buttonTremor 8s ease-in-out infinite 5s, buttonGlow 6s ease-in-out infinite';
                }
            }, 500);
        });
    });
}

// Função para controlar o menu toggle
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
            
            // Animar as linhas do botão toggle para formar um X quando o menu está ativo
            if (mainMenu.classList.contains('active')) {
                gsap.to(menuToggle.querySelectorAll('span')[0], {
                    rotate: 45,
                    y: 8,
                    duration: 0.3
                });
                
                gsap.to(menuToggle.querySelectorAll('span')[1], {
                    opacity: 0,
                    duration: 0.3
                });
                
                gsap.to(menuToggle.querySelectorAll('span')[2], {
                    rotate: -45,
                    y: -8,
                    duration: 0.3
                });
            } else {
                // Restaurar o estado original quando o menu é fechado
                gsap.to(menuToggle.querySelectorAll('span'), {
                    rotate: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
        
        // Fechar o menu quando clicar em um link
        const mainMenuLinks = mainMenu.querySelectorAll('a');
        mainMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainMenu.classList.remove('active');
                
                // Restaurar o estado original do botão toggle
                gsap.to(menuToggle.querySelectorAll('span'), {
                    rotate: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3
                });
            });
        });
    }
}

// Adicionar funcionalidade ao botão "Explore" para rolagem suave
document.addEventListener('DOMContentLoaded', function() {
    // Selecionar o indicador de rolagem
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Selecionar a próxima seção (Metrics neste caso)
            const nextSection = document.getElementById('metrics');
            
            if (nextSection) {
                // Animar a rolagem com GSAP para uma transição elegante
                gsap.to(window, {
                    duration: 1.5, 
                    scrollTo: {
                        y: nextSection,
                        offsetY: 80
                    },
                    ease: "power3.inOut"
                });
                
                // Adicionar um efeito visual ao clicar
                gsap.to(scrollIndicator, {
                    duration: 0.2,
                    scale: 0.9,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    }
    
    // Adicionar animação ao menu principal quando aberto
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            // Alternar a classe active no menu
            mainMenu.classList.toggle('active');
            
            // Se o menu estiver ativo
            if (mainMenu.classList.contains('active')) {
                // Animar a entrada dos itens do menu com GSAP
                gsap.fromTo(
                    mainMenu.querySelectorAll('li'),
                    { x: 50, opacity: 0 },
                    { 
                        x: 0, 
                        opacity: 1, 
                        stagger: 0.1,
                        duration: 0.5,
                        ease: "power2.out"
                    }
                );
                
                // Animar o ícone do menu
                gsap.to(menuToggle.querySelectorAll('span'), {
                    duration: 0.3,
                    backgroundColor: '#ffffff'
                });
            } else {
                // Animar a saída dos itens do menu
                gsap.to(
                    mainMenu.querySelectorAll('li'),
                    { 
                        x: 50, 
                        opacity: 0, 
                        stagger: 0.05,
                        duration: 0.3,
                        ease: "power2.in"
                    }
                );
                
                // Restaurar o ícone do menu
                gsap.to(menuToggle.querySelectorAll('span'), {
                    duration: 0.3,
                    backgroundColor: '#ffffff'
                });
            }
        });
    }
});
