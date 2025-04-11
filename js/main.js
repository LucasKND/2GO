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
});
