document.addEventListener('DOMContentLoaded', function() {
    // Ano atual no footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Cursor personalizado
    const cursor = document.querySelector('.cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('grow');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('grow');
    });
    
    // Elementos interativos que mudam o cursor
    const interactiveElements = document.querySelectorAll('a, button, .card, .service-card, .client-logo, .team-member');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('grow');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
        });
    });
    
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Botão voltar ao topo
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    // Ativar menu mobile
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
            
            // Animação das barras para formar um X
            const bars = menuToggle.querySelectorAll('span');
            if (mainMenu.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Fechar menu ao clicar em um link
    const mainMenuLinks = document.querySelectorAll('.main-menu a');
    mainMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainMenu.classList.remove('active');
            
            // Resetar o ícone do hambúrguer
            const bars = menuToggle.querySelectorAll('span');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
    
    // Botão de fechar o menu
    const menuCloseButton = document.querySelector('.menu-close');
    if (menuCloseButton && mainMenu) {
        menuCloseButton.addEventListener('click', () => {
            mainMenu.classList.remove('active');
            
            // Resetar o ícone do hambúrguer
            const bars = menuToggle.querySelectorAll('span');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    }
    
    // Adicionar funcionalidade ao botão "Explore" para rolagem suave
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    const mouseIcon = document.querySelector('.mouse-icon');
    const scrollText = document.querySelector('.scroll-text');
    
    // Função para rolar até a próxima seção
    function scrollToNextSection() {
        // Selecionar a próxima seção (Metrics neste caso)
        const nextSection = document.getElementById('metrics');
        
        if (nextSection) {
            // Implementação alternativa caso o ScrollToPlugin falhe
            try {
                // Tentar usar o GSAP ScrollToPlugin com duração mais curta
                gsap.to(window, {
                    duration: 0.2, // Reduzido de 1.5 para 0.8 segundos
                    scrollTo: {
                        y: nextSection,
                        offsetY: 80
                    },
                    ease: "power2.out" // Mudado para uma curva de aceleração mais direta
                });
            } catch (error) {
                // Fallback para implementação nativa de scroll suave
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Adicionar um efeito visual ao clicar (mais rápido também)
            gsap.to(scrollIndicator, {
                duration: 0.1, // Reduzido de 0.2 para 0.1 segundos
                scale: 0.95,
                yoyo: true,
                repeat: 1
            });
        }
    }
    
    // Adicionar o evento de clique ao indicador completo
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', scrollToNextSection);
    }
    
    // Adicionar eventos de clique específicos para o ícone do mouse e o texto "EXPLORE"
    if (mouseIcon) {
        mouseIcon.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar propagação dupla do evento
            scrollToNextSection();
        });
    }
    
    if (scrollText) {
        scrollText.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar propagação dupla do evento
            scrollToNextSection();
        });
    }
    
    // Adicionar animação ao menu principal quando aberto
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
            }
        });
    }
});
