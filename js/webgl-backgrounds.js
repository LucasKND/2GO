let camera, scene, renderer;
let expertiseBackground;
let particleSystem;
let gradientMaterial;
let time = 0;

document.addEventListener('DOMContentLoaded', () => {
    expertiseBackground = document.getElementById('expertise-background');
    if (expertiseBackground) {
        initExpertiseBackground();
        animateExpertiseBackground();
    }

    initHeroBackground();
});

function initExpertiseBackground() {
    const width = expertiseBackground.clientWidth;
    const height = expertiseBackground.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;
    
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    expertiseBackground.appendChild(renderer.domElement);
    
    window.addEventListener('resize', () => {
        const newWidth = expertiseBackground.clientWidth;
        const newHeight = expertiseBackground.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
    
    createLiquidGradientBackground();
    createParticleSystem();
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xff3a3a, 1);
    spotLight.position.set(15, 40, 35);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function createLiquidGradientBackground() {
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;
        
        // Função de ruído simplex para criar o efeito líquido
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
        
        void main() {
            // Criar efeito de onda líquida
            vec2 uv = vUv;
            float nx = 0.5 + 0.5 * snoise(vec2(uv.x * 3.0, uv.y * 3.0 + time * 0.1));
            float ny = 0.5 + 0.5 * snoise(vec2(uv.x * 3.0 + time * 0.1, uv.y * 3.0));
            
            // Deslocamento baseado no ruído
            uv.x += 0.1 * nx;
            uv.y += 0.1 * ny;
            
            // Cores para o gradiente
            vec3 color1 = vec3(0.05, 0.05, 0.05); // Quase preto
            vec3 color2 = vec3(0.1, 0.1, 0.1);    // Cinza escuro
            vec3 color3 = vec3(0.5, 0.0, 0.0);   // Vermelho escuro
            
            // Criar gradiente com base na posição e ruído
            float mixer1 = smoothstep(0.0, 0.6, uv.y + 0.3 * snoise(vec2(uv.x * 2.0, time * 0.05)));
            float mixer2 = smoothstep(0.4, 1.0, uv.y + 0.3 * snoise(vec2(uv.x * 2.0, time * 0.05)));
            
            // Misturar as cores
            vec3 color = mix(color1, color2, mixer1);
            color = mix(color, color3, mixer2 * 0.3); // Adicionar um pouco de vermelho
            
            // Adicionar um brilho sutil com base no ruído
            float glow = 0.03 * snoise(vec2(uv.x * 10.0, uv.y * 10.0 - time * 0.1));
            color += vec3(0.8, 0.1, 0.1) * glow;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    
    gradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });
    
    const plane = new THREE.PlaneGeometry(100, 100);
    const gradientMesh = new THREE.Mesh(plane, gradientMaterial);
    gradientMesh.position.z = -10;
    scene.add(gradientMesh);
}

function createParticleSystem() {
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        sizes[i] = Math.random() * 0.5 + 0.1;
        colors[i * 3] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 1] = Math.random() * 0.2;    
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleVertexShader = `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
            vColor = color;
            
            // Animar partículas com movimento suave
            vec3 pos = position;
            pos.x += sin(time * 0.2 + position.z * 0.5) * 0.5;
            pos.y += cos(time * 0.1 + position.x * 0.5) * 0.5;
            pos.z += sin(time * 0.3 + position.y * 0.5) * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    
    const particleFragmentShader = `
        varying vec3 vColor;
        
        void main() {
            // Criar partículas circulares com borda suave
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            gl_FragColor = vec4(vColor, strength * 0.5);
        }
    `;
    
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
}

function animateExpertiseBackground() {
    time += 0.01;
    
    if (gradientMaterial) {
        gradientMaterial.uniforms.time.value = time;
    }
    
    if (particleSystem && particleSystem.material.uniforms) {
        particleSystem.material.uniforms.time.value = time;
        
        particleSystem.rotation.y = time * 0.05;
        particleSystem.rotation.z = time * 0.01;
    }
    
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        
        if (camera) {
            camera.position.x = mouseX * 2;
            camera.position.y = -mouseY * 2;
            camera.lookAt(scene.position);
        }
    });
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
    
    requestAnimationFrame(animateExpertiseBackground);
}

function initHeroBackground() {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;
    
    heroSection.classList.add('hero-dynamic-bg');
    const canvas = document.createElement('canvas');
    canvas.classList.add('hero-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 100;
    const maxDistance = 150;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 0.5 - 0.25,
            color: `rgba(255, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.random() * 0.5 + 0.2})`
        });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 150;
    
    heroSection.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY - heroSection.getBoundingClientRect().top;
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
            
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouseRadius - dist) / mouseRadius;
                p.vx += Math.cos(angle) * force * 0.2;
                p.vy += Math.sin(angle) * force * 0.2;
            }
            
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 2) {
                p.vx = (p.vx / speed) * 2;
                p.vy = (p.vy / speed) * 2;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p2.x - p.x;
                const dy = p2.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 58, 58, ${(maxDistance - dist) / maxDistance * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
}

window.WebGLBackgrounds = {
    initExpertiseBackground,
    animateExpertiseBackground,
    initHeroBackground
};
