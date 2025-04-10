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
});
