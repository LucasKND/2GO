document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    function reveal() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    
    // Para garantir que elementos visíveis na carga da página sejam revelados
    reveal();
});
