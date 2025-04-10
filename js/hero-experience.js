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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Three.js para nebulosa
    initHeroCanvas();
    
    // Efeito de scroll para transição
    initScrollTransition();
    
    // Inicializar efeito de magnetismo dos botões
    initButtonMagnetism();
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
    
    // Rotação das nebulosas e estrelas
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
}
