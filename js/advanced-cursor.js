/**
 * Implementação de cursor personalizado - DESATIVADO
 * Voltando para o cursor padrão do navegador
 */

document.addEventListener('DOMContentLoaded', () => {
    // Restaurar cursor padrão do navegador
    resetToBrowserCursor();
});

function resetToBrowserCursor() {
    // Remover elementos do cursor personalizado
    const cursorElements = document.querySelector('.cursor-container');
    if (cursorElements) {
        cursorElements.style.display = 'none';
    }
    
    // Restaurar o cursor padrão para o body e elementos interativos
    document.body.style.cursor = 'auto';
    
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
        el.style.cursor = 'pointer';
    });
}

// Desabilitar qualquer função que manipule o cursor personalizado
function initAdvancedCursor() {
    // Função desativada
    return;
}

// Adicionar efeito de partículas após clique
function createClickParticles() {
  // Criar um container para as partículas se ainda não existir
  let particleContainer = document.querySelector('.click-particles-container');
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.classList.add('click-particles-container');
    document.body.appendChild(particleContainer);
  }

  // Adicionar evento de clique em todo o documento
  document.addEventListener('mousedown', function(e) {
    // Criar partículas no local do clique
    createParticlesAtPosition(e.clientX, e.clientY);
  });
}

// Função para criar partículas em uma posição específica
function createParticlesAtPosition(x, y) {
  // Número de partículas a serem criadas
  const particleCount = 10;
  const container = document.querySelector('.click-particles-container');
  
  // Criar partículas
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('cursor-particle');
    
    // Posicionar a partícula no ponto de clique
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Configurar as propriedades da partícula (tamanho, cor, etc.)
    const size = Math.random() * 8 + 3; // Tamanho entre 3 e 11px
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Configurar cor aleatória, com preferência para tons vermelhos
    const red = Math.floor(Math.random() * 55) + 200; // 200-255
    const green = Math.floor(Math.random() * 50); // 0-50
    const blue = Math.floor(Math.random() * 50); // 0-50
    const opacity = Math.random() * 0.4 + 0.6; // 0.6-1.0
    particle.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    
    // Adicionar a partícula ao container
    container.appendChild(particle);
    
    // Animar a partícula
    const angle = Math.random() * Math.PI * 2; // Ângulo aleatório
    const speed = Math.random() * 4 + 2; // Velocidade entre 2 e 6
    const deltaX = Math.cos(angle) * speed;
    const deltaY = Math.sin(angle) * speed;
    
    // Usar GSAP para animação
    gsap.to(particle, {
      x: deltaX * 15, // Distância X
      y: deltaY * 15, // Distância Y
      opacity: 0,
      scale: 0,
      duration: Math.random() * 0.8 + 0.6, // Duração entre 0.6 e 1.4 segundos
      ease: "power2.out",
      onComplete: function() {
        // Remover a partícula quando a animação terminar
        particle.remove();
      }
    });
  }
}

// Iniciar o efeito de partículas ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  createClickParticles();
});
