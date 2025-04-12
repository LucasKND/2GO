/**
 * Script simplificado para ícones de redes sociais
 * Versão sem animações
 */

document.addEventListener('DOMContentLoaded', function() {
    // Forçar a visibilidade dos ícones sociais
    const socialContainers = document.querySelectorAll('.social-media-container');
    socialContainers.forEach(container => {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
    });

    const socialItems = document.querySelectorAll('.social-media-item');
    socialItems.forEach(item => {
        item.style.opacity = '1';
    });

    // Seleciona todos os ícones de redes sociais
    const socialLinks = document.querySelectorAll('.social-link');
    
    // Garante visibilidade dos ícones
    socialLinks.forEach(link => {
        // Força visibilidade do ícone
        const icon = link.querySelector('.social-icon i');
        if (icon) {
            icon.style.display = 'inline-block';
            icon.style.visibility = 'visible';
            icon.style.opacity = '1';
        }
    });
    
    // Corrigir problema com nav-hidden-on-landing
    const header = document.querySelector('header');
    if (header) {
        // Adiciona scrolled ao header para garantir visibilidade imediata
        header.classList.add('scrolled');
    }
});

// Adiciona CSS dinâmico para garantir visibilidade
(function addFixStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Correção de visibilidade para ícones */
        .social-icon i {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .social-media-container, .social-media-item {
            opacity: 1 !important;
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);
})();