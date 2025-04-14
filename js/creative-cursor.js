document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    const cursorText = document.createElement('div');
    cursorText.classList.add('cursor-text');
    document.body.appendChild(cursorText);
    
    let mouseX = 0;
    let mouseY = 0;
    
    let cursorX = 0;
    let cursorY = 0;
   
    const cursorTrail = [];
    const trailLength = 20;
    const trailElements = [];

    for (let i = 0; i < trailLength; i++) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.width = `${8 - (i / trailLength) * 6}px`;
        trail.style.height = `${8 - (i / trailLength) * 6}px`;
        trail.style.opacity = 1 - (i / trailLength);
        trail.style.backgroundColor = '#ff3a3a';
        trail.style.position = 'fixed';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9998';
        trail.style.transform = 'translate(-50%, -50%)';
        trail.style.mixBlendMode = 'difference';
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorTrail.push({ x: mouseX, y: mouseY });
        
        if (cursorTrail.length > trailLength) {
            cursorTrail.shift();
        }
        
        updateCursorText(e.target);
    });
    
    function updateCursorText(element) {
        if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.classList.contains('expertise-item')) {
            cursorText.textContent = 'Ver';
            cursorText.classList.add('active');
            
            if (element.classList.contains('cta-button')) {
                cursorText.textContent = 'Iniciar';
            }
        } else {
            cursorText.classList.remove('active');
        }
    }
    
    const interactiveElements = document.querySelectorAll('a, button, .expertise-item, .service-card, .team-member');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('grow');
            document.body.style.cursor = 'none';
            
            element.classList.add('cursor-focus');
            
            if (element.classList.contains('cta-button') || element.classList.contains('expertise-item')) {
                element.dataset.magnetism = 'true';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
            document.body.style.cursor = 'auto';
            
            element.classList.remove('cursor-focus');
            
            if (element.dataset.magnetism === 'true') {
                gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power3.out' });
            }
        });
        
        element.addEventListener('mousemove', (e) => {
            if (element.dataset.magnetism === 'true') {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                
                const strength = 0.2;
                gsap.to(element, {
                    x: distanceX * strength,
                    y: distanceY * strength,
                    duration: 0.3,
                    ease: 'power3.out'
                });
            }
        });
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        gsap.to(cursor, {
            scale: 0.7,
            duration: 0.1,
            ease: 'power2.out'
        });
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
        gsap.to(cursor, {
            scale: 1,
            duration: 0.2,
            ease: 'elastic.out(1, 0.3)'
        });
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
        
        if (cursorText) {
            cursorText.style.left = `${mouseX}px`;
            cursorText.style.top = `${mouseY - 30}px`;
        }
        
        for (let i = 0; i < trailElements.length; i++) {
            if (cursorTrail[i]) {
                gsap.to(trailElements[i], {
                    left: cursorTrail[i].x,
                    top: cursorTrail[i].y,
                    duration: 0.1,
                    ease: 'none'
                });
            }
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    const style = document.createElement('style');
    style.innerHTML = `
        .cursor {
            mix-blend-mode: difference;
            z-index: 9999;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .cursor.grow {
            transform: translate(-50%, -50%) scale(1.5);
            mix-blend-mode: difference;
        }
        
        .cursor.click {
            transform: translate(-50%, -50%) scale(0.8);
        }
        
        .cursor-dot {
            position: fixed;
            width: 4px;
            height: 4px;
            background-color: #fff;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 10000;
            mix-blend-mode: difference;
        }
        
        .cursor-text {
            position: fixed;
            pointer-events: none;
            color: white;
            font-size: 12px;
            font-weight: bold;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10001;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .cursor-text.active {
            opacity: 1;
        }
        
        .cursor-focus {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        @media (max-width: 768px) {
            .cursor, .cursor-dot, .cursor-text, .cursor-trail {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});