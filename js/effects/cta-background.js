// Script para criar efeitos de fundo da seção CTA
document.addEventListener('DOMContentLoaded', function() {
    // Criar estrelas aleatórias no fundo
    createStarDots();

    // Função para criar pontos de estrelas no fundo
    function createStarDots() {
        const starDotsContainer = document.querySelector('#main-cta .star-dots');
        if (!starDotsContainer) return;

        // Limpar qualquer conteúdo existente
        starDotsContainer.innerHTML = '';

        // Criar 80 estrelas aleatórias com piscar sutil
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.className = 'star-dot';

            // Posicionamento aleatório
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            
            // Tamanho variável, mas menor para efeito mais sutil
            const size = 0.8 + Math.random() * 1.2;
            
            // Atraso de animação aleatório para que não pisquem todas juntas
            const delay = Math.random() * 8;
            const duration = 4 + Math.random() * 4; // Duração variável da animação
            
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            // Opacidade inicial aleatória para mais naturalidade
            star.style.opacity = 0.2 + Math.random() * 0.4;

            starDotsContainer.appendChild(star);
        }
    }
});