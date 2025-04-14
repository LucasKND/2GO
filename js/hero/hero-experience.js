let scene, camera, renderer, clock;
let nebula, stars;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let isIntroAnimationPlaying = true;
let starfieldParticles;
let introAnimationCompleted = false;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const skipLanding = urlParams.get('skipLanding') === 'true';
    
    initHeroCanvas();
    createStarfieldEffect();
    
    skipLanding ? skipIntroAnimation() : startIntroAnimation();
    
    initScrollTransition();
    initButtonMagnetism();
    initMenuToggle();
});

function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    
    clock = new THREE.Clock();
    
    createNebula();
    createStars();
    
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    animate();
}

function createNebula() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 800;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 40 + Math.random() * 40;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.cos(theta);
        
        colors[i * 3] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 1] = Math.random() * 0.2;
        colors[i * 3 + 2] = Math.random() * 0.3 + 0.2;
        
        const distance = Math.sqrt(
            positions[i * 3] * positions[i * 3] + 
            positions[i * 3 + 1] * positions[i * 3 + 1] + 
            positions[i * 3 + 2] * positions[i * 3 + 2]
        );
        
        sizes[i] = Math.min(2.5, (distance / 40) * (Math.random() * 2 + 1));
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
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
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                if (dist > 0.5) discard;
                float smoothedAlpha = smoothstep(0.5, 0.4, dist);
                gl_FragColor = vec4(vColor, smoothedAlpha);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    nebula = new THREE.Points(geometry, material);
    scene.add(nebula);
}

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        const distance = 40 + Math.random() * 70;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        positions[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
        positions[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = distance * Math.cos(theta);
        
        const calculatedDistance = Math.sqrt(
            positions[i * 3] * positions[i * 3] + 
            positions[i * 3 + 1] * positions[i * 3 + 1] + 
            positions[i * 3 + 2] * positions[i * 3 + 2]
        );
        
        sizes[i] = Math.min(1.2, (calculatedDistance / 50) * (Math.random() * 0.8 + 0.5));
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
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
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                if (dist > 0.5) discard;
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

function createStarfieldEffect() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const z = Math.random() * 600 - 300;
        const maxRadius = Math.abs(z) * 0.1 + 10;
        const radius = Math.random() * maxRadius;
        const theta = Math.random() * Math.PI * 2;
        
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = Math.sin(theta) * radius;
        positions[i * 3 + 2] = z;
        
        velocities[i] = radius * 0.02 + 0.5;
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
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
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                if (dist > 0.5) discard;
                float trailFactor = 0.0;
                if (center.y < 0.0) {
                    trailFactor = -center.y * 8.0 * vVelocity;
                }
                float brightness = 1.0 - smoothstep(0.0, 0.5, dist - trailFactor);
                brightness *= vVelocity * 0.8;
                vec3 color = vec3(1.0, 1.0, 1.0) * brightness;
                gl_FragColor = vec4(color, brightness);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    starfieldParticles = new THREE.Points(geometry, material);
    starfieldParticles.visible = false;
    scene.add(starfieldParticles);
}

function startIntroAnimation() {
    if (!scene || !camera || !nebula || !stars || !starfieldParticles) return;
    
    isIntroAnimationPlaying = true;
    nebula.visible = false;
    stars.visible = false;
    starfieldParticles.visible = true;
    camera.position.z = 500;
    document.body.classList.add('hyperspace-blur');
    
    const navElements = document.querySelectorAll('.nav-hidden-on-landing');
    const heroContent = document.querySelector('.hero-content-hidden-on-landing');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator-hidden-on-landing');
    const logoElement = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('nav ul li');
    const socialIcons = document.querySelector('.social-icons');
    const menuToggle = document.querySelector('.menu-toggle');
    const heroTitle = heroContent ? heroContent.querySelector('.hero-title') : null;
    const heroDescription = heroContent ? heroContent.querySelector('.hero-description') : null;
    const buttons = heroContent ? heroContent.querySelectorAll('.cta-button') : [];
    const scrollText = scrollIndicator ? scrollIndicator.querySelector('.scroll-text') : null;
    const scrollArrow = scrollIndicator ? scrollIndicator.querySelector('.scroll-arrow') : null;
    
    [navElements, heroContent, scrollIndicator, socialIcons, menuToggle].forEach(el => {
        if (el && el.style) {
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
        }
    });

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
    ].filter(el => el);
    
    allAnimElements.forEach(el => {
        el.classList.remove(
            'nav-appear', 'title-appear', 'description-appear', 
            'button-appear', 'explore-appear', 'primary-button-appear',
            'delay-50', 'delay-100', 'delay-150', 'delay-200', 'delay-250',
            'delay-300', 'delay-350', 'delay-400', 'delay-450', 'delay-500',
            'delay-600', 'delay-700', 'delay-800'
        );
    });
    
    const tl = gsap.timeline({
        onComplete: () => {
            isIntroAnimationPlaying = false;
            introAnimationCompleted = true;
            nebula.visible = true;
            stars.visible = true;
            starfieldParticles.visible = false;
            
            document.body.classList.add('completed');
            
            gsap.to(camera.position, {
                z: 45,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    if (heroContent) heroContent.style.pointerEvents = 'auto';
                    if (scrollIndicator) scrollIndicator.style.pointerEvents = 'auto';
                    navElements.forEach(el => el.style.pointerEvents = 'auto');
                    if (socialIcons) socialIcons.style.pointerEvents = 'auto';
                    if (menuToggle) menuToggle.style.pointerEvents = 'auto';

                    const elements = [
                        { el: logoElement, delay: 50, class: 'nav-appear' },
                        { el: menuToggle, delay: 100, class: 'nav-appear' },
                        { el: socialIcons, delay: 150, class: 'nav-appear' },
                        { el: heroTitle, delay: 300, class: 'title-appear' },
                        { el: heroDescription, delay: 500, class: 'description-appear' }
                    ];

                    elements.forEach(({el, delay, class: className}) => {
                        if (el) {
                            setTimeout(() => {
                                el.style.visibility = 'visible';
                                el.style.opacity = '1';
                                el.classList.add(className);
                            }, delay);
                        }
                    });

                    navLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.style.visibility = 'visible';
                            link.style.opacity = '1';
                            link.classList.add('nav-appear');
                        }, 200 + (index * 100));
                    });

                    buttons.forEach((button, index) => {
                        setTimeout(() => {
                            button.style.visibility = 'visible';
                            button.style.opacity = '1';
                            button.classList.add(button.classList.contains('primary-button') ? 'primary-button-appear' : 'button-appear');
                        }, 700 + (index * 150));
                    });

                    if (scrollIndicator) {
                        setTimeout(() => {
                            scrollIndicator.style.visibility = 'visible';
                            scrollIndicator.style.opacity = '1';
                            
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
                }
            });
        }
    });
    
    tl.to(camera.position, {
        z: 45,
        duration: 2.5,
        ease: "power3.in"
    });
    
    const shakeDuration = 2.5;
    const startTime = clock.getElapsedTime();
    
    function addCameraShake() {
        if (!isIntroAnimationPlaying) return;
        
        const currentTime = clock.getElapsedTime() - startTime;
        if (currentTime > shakeDuration) return;
        
        const progress = currentTime / shakeDuration;
        const intensity = 0.3 * Math.sin(progress * Math.PI);
        
        camera.position.x += (Math.random() * 2 - 1) * intensity;
        camera.position.y += (Math.random() * 2 - 1) * intensity;
        
        requestAnimationFrame(addCameraShake);
    }
    
    addCameraShake();
}

function skipIntroAnimation() {
    isIntroAnimationPlaying = false;
    introAnimationCompleted = true;
    
    if (nebula) nebula.visible = true;
    if (stars) stars.visible = true;
    if (starfieldParticles) starfieldParticles.visible = false;
    if (camera) camera.position.z = 45;
    
    document.body.classList.add('completed');
    
    const elements = [
        ...document.querySelectorAll('.nav-hidden-on-landing'),
        document.querySelector('.hero-content-hidden-on-landing'),
        document.querySelector('.hero-scroll-indicator-hidden-on-landing'),
        document.querySelector('.logo'),
        document.querySelector('.social-icons'),
        document.querySelector('.menu-toggle')
    ];

    elements.forEach(el => {
        if (el) {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.pointerEvents = 'auto';
            el.classList.add('show-after-landing');
        }
    });
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
    
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (isIntroAnimationPlaying) {
        if (starfieldParticles) {
            const positions = starfieldParticles.geometry.attributes.position.array;
            const velocities = starfieldParticles.geometry.attributes.velocity.array;
            const speeds = Array.from({ length: positions.length / 3 }, (_, i) => velocities[i]);
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 2] += speeds[i/3] * (25 - camera.position.z/20);
                
                if (positions[i + 2] > camera.position.z) {
                    const theta = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 40 + 10;
                    
                    positions[i] = Math.cos(theta) * radius;
                    positions[i + 1] = Math.sin(theta) * radius;
                    positions[i + 2] = camera.position.z - 500;
                }
            }
            
            starfieldParticles.geometry.attributes.position.needsUpdate = true;
        }
    } else {
        if (nebula) {
            nebula.rotation.x = elapsedTime * 0.05;
            nebula.rotation.y = elapsedTime * 0.03;
            
            nebula.rotation.x += targetMouseY * 0.01;
            nebula.rotation.y += targetMouseX * 0.01;
        }
        
        if (stars) {
            stars.rotation.x = elapsedTime * 0.01;
            stars.rotation.y = elapsedTime * 0.02;
        }
        
        camera.position.x += (targetMouseX - camera.position.x) * 0.05;
        camera.position.y += (-targetMouseY - camera.position.y) * 0.05;
    }
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

function initScrollTransition() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#purpose');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('header').offsetHeight;
        const progress = Math.min(scrollY / heroHeight, 1);
        
        if (nebula && progress > 0) {
            nebula.scale.set(1 + progress * 0.2, 1 + progress * 0.2, 1 + progress * 0.2);
            nebula.material.opacity = 1 - progress * 0.5;
        }
    });
}

function initButtonMagnetism() {
    const buttons = document.querySelectorAll('.hero-buttons .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const offsetX = (x / rect.width - 0.5) * 2;
            const offsetY = (y / rect.height - 0.5) * 2;
            const strength = button.classList.contains('primary-button') ? 15 : 10;
            const moveX = offsetX * strength;
            const moveY = offsetY * strength;
            
            gsap.to(button, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        button.addEventListener('mousedown', () => {
            gsap.to(button, { scale: 0.95, duration: 0.1 });
        });
        
        button.addEventListener('mouseup', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        });
        
        button.addEventListener('mouseenter', () => {
            button.setAttribute('data-original-animation', button.style.animation);
            gsap.to(button, {
                animation: 'buttonGlow 6s ease-in-out infinite',
                duration: 0.1
            });
        });
        
        button.addEventListener('mouseleave', () => {
            setTimeout(() => {
                const originalAnimation = button.getAttribute('data-original-animation');
                button.style.animation = originalAnimation || 'buttonTremor 8s ease-in-out infinite 5s, buttonGlow 6s ease-in-out infinite';
            }, 500);
        });
    });
}

function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
            
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
                gsap.to(menuToggle.querySelectorAll('span'), {
                    rotate: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
        
        mainMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainMenu.classList.remove('active');
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

document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.getElementById('metrics');
            
            if (nextSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: nextSection,
                        offsetY: 80,
                        autoKill: false
                    },
                    ease: "power2.inOut"
                });
                
                gsap.to(scrollIndicator, {
                    duration: 0.3,
                    scale: 0.95,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        });
    }
    
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            
            if (mainMenu.classList.contains('active')) {
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
                
                gsap.to(menuToggle.querySelectorAll('span'), {
                    duration: 0.3,
                    backgroundColor: '#ffffff'
                });
            } else {
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
                
                gsap.to(menuToggle.querySelectorAll('span'), {
                    duration: 0.3,
                    backgroundColor: '#ffffff'
                });
            }
        });
    }
});