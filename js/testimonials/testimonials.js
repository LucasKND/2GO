/**
 * Carrossel de Depoimentos Aperfeiçoado
 * Implementação com animação suave entre tracks
 */
document.addEventListener('DOMContentLoaded', function() {
    // Definição dos depoimentos (expandido para 6)
    const depoimentos = [
        {
            id: 'rafael',
            texto: '"Costumo dizer que minha vida profissional é uma antes e outra depois do marketing. A equipe da 2GO revolucionou minha presença digital e multiplicou meus atendimentos em apenas 3 meses de trabalho. Hoje tenho agenda completa e lista de espera!"',
            autor: 'Rafael Livramento',
            perfil: '@rafael.livramento.terapias',
            expandivel: false
        },
        {
            id: 'studio-a2',
            texto: '"Começamos nossa parceria em 2013, quando eu (Eduardo) era apenas o personal trainer Dudu Martins. Ao longo dos anos, com o apoio da 2GO Marketing, conseguimos expandir para um estúdio completo com mais de 15 profissionais. A estratégia digital deles transformou nosso negócio completamente!"',
            autor: 'Studio A2',
            perfil: '@studioa2resende',
            expandivel: false
        },
        {
            id: 'bella-foto',
            texto: '"A equipe da 2GO transformou nossa presença digital. Estamos extremamente satisfeitos com os resultados obtidos até agora."',
            autor: 'Bella Foto',
            perfil: '@bellafoto',
            expandivel: false
        },
        {
            id: 'fisio-pilates',
            texto: '"Desde que começamos a trabalhar com a 2GO, nossa agenda de atendimentos está sempre cheia. A estratégia de conteúdo deles conecta muito bem com nosso público-alvo."',
            autor: 'Fisio Pilates',
            perfil: '@fisiopilatesresende',
            expandivel: false
        },
        {
            id: 'tatiani-nutricionista',
            texto: '"Como nutricionista, precisava de uma estratégia específica para meu nicho. A 2GO entendeu perfeitamente meu público e desenvolveu um planejamento que aumentou minha base de pacientes em mais de 60% em apenas seis meses. Recomendo sem hesitar!"',
            autor: 'Tatiani Nutrição',
            perfil: '@tatiani.nutricao',
            expandivel: false
        },
        {
            id: 'gama-odontologia',
            texto: '"A 2GO transformou nossa presença online e ampliou nossa base de pacientes. Suas estratégias de marketing nos ajudaram a manter a agenda sempre cheia."',
            autor: 'Gama Odontologia',
            perfil: '@gamaodontologia',
            expandivel: false
        }
    ];

    // Obter elementos DOM
    const carrosselContainer = document.querySelector('.testimonials-carousel');
    const indicatorsContainer = document.querySelector('.testimonial-indicators');
    const prevButton = document.querySelector('.nav-arrow.prev');
    const nextButton = document.querySelector('.nav-arrow.next');
    const testimonialSection = document.getElementById('testimonials');
    
    // Estado atual
    let indiceAtual = 0;
    let animando = false;
    let autoplayInterval = null;
    
    // Inicializar o carrossel
    function inicializarCarrossel() {
        // Limpar qualquer conteúdo existente
        while (carrosselContainer.firstChild) {
            carrosselContainer.removeChild(carrosselContainer.firstChild);
        }
        
        // Criar o track principal
        const track = document.createElement('div');
        track.className = 'testimonial-track main-track';
        carrosselContainer.appendChild(track);
        
        // Detectar qual depoimento deve ser mostrado inicialmente
        detectarDepoimentoInicial();
        
        // Renderizar os slides iniciais
        renderizarSlides(track, indiceAtual);
        
        // Criar indicadores
        criarIndicadores();
        
        // Configurar event listeners
        configurarEventListeners();
        
        // Iniciar autoplay após um breve delay
        setTimeout(iniciarAutoplay, 500);
        
        // Verificar se é necessário ajustar a altura da seção
        ajustarAlturaSecao();
    }
    
    // Detectar qual depoimento está sendo mostrado no HTML atual (para reconstrução)
    function detectarDepoimentoInicial() {
        // Implementação simples - começamos do primeiro depoimento
        indiceAtual = 0;
        
        // Verificar se há algum depoimento específico marcado na URL
        const urlParams = new URLSearchParams(window.location.search);
        const testimonialId = urlParams.get('testimonial');
        
        if (testimonialId) {
            const index = depoimentos.findIndex(d => d.id === testimonialId);
            if (index !== -1) {
                indiceAtual = index;
            }
        }
    }
    
    // Renderizar os slides em um determinado track
    function renderizarSlides(track, indiceAtivo) {
        // Limpar o track
        track.innerHTML = '';
        
        // Calcular índices dos slides vizinhos
        const prevIndex = (indiceAtivo - 1 + depoimentos.length) % depoimentos.length;
        const nextIndex = (indiceAtivo + 1) % depoimentos.length;
        
        // Criar slide anterior (esquerda)
        const prevSlide = document.createElement('div');
        prevSlide.className = 'testimonial-slide prev-slide';
        prevSlide.innerHTML = criarCardHTML(depoimentos[prevIndex]);
        
        // Criar slide ativo (centro)
        const activeSlide = document.createElement('div');
        activeSlide.className = 'testimonial-slide active-slide';
        activeSlide.innerHTML = criarCardHTML(depoimentos[indiceAtivo]);
        
        // Criar próximo slide (direita)
        const nextSlide = document.createElement('div');
        nextSlide.className = 'testimonial-slide next-slide';
        nextSlide.innerHTML = criarCardHTML(depoimentos[nextIndex]);
        
        // Adicionar slides ao track
        track.appendChild(prevSlide);
        track.appendChild(activeSlide);
        track.appendChild(nextSlide);
    }
    
    // Cria o HTML de um card de depoimento
    function criarCardHTML(depoimento) {
        let cardHTML = `<div class="testimonial-card" data-id="${depoimento.id}" tabindex="0">`;
        
        // Ícone de citação
        cardHTML += `<div class="quote-icon"><i class="fas fa-quote-left"></i></div>`;
        
        // Conteúdo do depoimento
        cardHTML += `<div class="testimonial-content">`;
        cardHTML += `<p>${depoimento.texto}</p>`;
        cardHTML += `</div>`;
        
        // Autor do depoimento
        cardHTML += `
            <div class="testimonial-author">
                <h3>${depoimento.autor}</h3>
                <span>${depoimento.perfil}</span>
            </div>
        `;
        
        cardHTML += `</div>`;
        return cardHTML;
    }
    
    // Criar indicadores
    function criarIndicadores() {
        // Limpar indicadores existentes
        while (indicatorsContainer.firstChild) {
            indicatorsContainer.removeChild(indicatorsContainer.firstChild);
        }
        
        // Criar novos indicadores
        depoimentos.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === indiceAtual) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                if (!animando && index !== indiceAtual) {
                    irParaDepoimento(index);
                }
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Ajustar altura da seção para acomodar o conteúdo
    function ajustarAlturaSecao() {
        // Verificar se a seção está visível antes de ajustar a altura
        if (!estaSecaoVisivel()) return;
        
        // Obter o slide ativo
        const activeSlide = carrosselContainer.querySelector('.active-slide');
        if (!activeSlide) return;
        
        // Calcular altura necessária para o container
        const cardHeight = activeSlide.offsetHeight;
        const navigationHeight = document.querySelector('.testimonial-navigation').offsetHeight;
        const containerHeight = cardHeight + 40; // 40px de espaço adicional
        
        // Definir altura mínima da seção para evitar sobreposição
        carrosselContainer.style.minHeight = `${containerHeight}px`;
        
        // Ajustar a altura da seção de depoimentos
        const paddingTop = parseInt(window.getComputedStyle(testimonialSection).paddingTop, 10);
        const paddingBottom = parseInt(window.getComputedStyle(testimonialSection).paddingBottom, 10);
        const titleHeight = document.querySelector('#testimonials .section-title').offsetHeight;
        
        // Altura total necessária para a seção
        const totalHeight = titleHeight + containerHeight + navigationHeight + paddingTop + paddingBottom + 60; // 60px de espaço adicional
        
        // Aplicar altura mínima à seção
        testimonialSection.style.minHeight = `${totalHeight}px`;
    }
    
    // Verifica se a seção de depoimentos está visível no viewport
    function estaSecaoVisivel() {
        const rect = testimonialSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Considera visível se pelo menos parte da seção estiver no viewport
        return (
            rect.top <= windowHeight &&
            rect.bottom >= 0
        );
    }
    
    // Configurar event listeners
    function configurarEventListeners() {
        // Botões de navegação
        prevButton.addEventListener('click', e => {
            e.preventDefault();
            depoimentoAnterior();
        });
        
        nextButton.addEventListener('click', e => {
            e.preventDefault();
            proximoDepoimento();
        });
        
        // Navegação por teclado para acessibilidade
        carrosselContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                proximoDepoimento();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                depoimentoAnterior();
            }
        });
        
        // Pausar autoplay ao interagir com o carrossel
        carrosselContainer.addEventListener('mouseenter', pararAutoplay);
        carrosselContainer.addEventListener('mouseleave', iniciarAutoplay);
        carrosselContainer.addEventListener('touchstart', pararAutoplay, {passive: true});
        carrosselContainer.addEventListener('focus', pararAutoplay, true);
        carrosselContainer.addEventListener('blur', iniciarAutoplay, true);
        
        // Detectar mudanças de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pararAutoplay();
            } else {
                iniciarAutoplay();
            }
        });
        
        // Adicionar event listener para ajustar alturas em redimensionamento da janela
        window.addEventListener('resize', function() {
            if (estaSecaoVisivel()) {
                ajustarAlturaSecao();
            }
        });
        
        // Configurar Intersection Observer para detectar quando a seção entra no viewport
        configurarIntersectionObserver();
    }
    
    // Configurar Intersection Observer para monitorar a visibilidade da seção
    function configurarIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Se a seção entrou no viewport
                    if (entry.isIntersecting) {
                        ajustarAlturaSecao();
                    }
                });
            }, {
                root: null, // viewport
                threshold: 0.1 // 10% da seção visível
            });
            
            // Observar a seção de depoimentos
            observer.observe(testimonialSection);
        } else {
            // Fallback para navegadores que não suportam IntersectionObserver
            window.addEventListener('scroll', function() {
                if (estaSecaoVisivel()) {
                    ajustarAlturaSecao();
                }
            }, { passive: true });
        }
    }
    
    // Navegar para o próximo depoimento
    function proximoDepoimento() {
        if (animando) return;
        
        const novoIndice = (indiceAtual + 1) % depoimentos.length;
        navegarParaDepoimento(novoIndice);
    }
    
    // Navegar para o depoimento anterior
    function depoimentoAnterior() {
        if (animando) return;
        
        const novoIndice = (indiceAtual - 1 + depoimentos.length) % depoimentos.length;
        navegarParaDepoimento(novoIndice);
    }
    
    // Navegar para um depoimento específico através do indicador
    function irParaDepoimento(indice) {
        if (animando || indice === indiceAtual) return;
        
        navegarParaDepoimento(indice);
    }
    
    // Função unificada para navegação
    function navegarParaDepoimento(novoIndice) {
        animando = true;
        
        // 1. Criar um novo track para o próximo conjunto de slides
        const novoTrack = document.createElement('div');
        novoTrack.className = 'testimonial-track new-track';
        
        // 2. Renderizar o próximo conjunto de slides sem mostrar ainda
        renderizarSlides(novoTrack, novoIndice);
        
        // 3. Posicionar o novo track exatamente sobre o atual
        posicionarTrackParaTransicao(novoTrack);
        
        // 4. Adicionar o novo track ao container (inicialmente invisível)
        carrosselContainer.appendChild(novoTrack);
        
        // 5. Preparar o novo track - dar tempo ao navegador para renderizar corretamente
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // 6. Obter o track atual para referência
                const trackAtual = carrosselContainer.querySelector('.testimonial-track.main-track');
                
                // 7. Iniciar a transição - fade out do track atual
                trackAtual.style.opacity = '0';
                
                // 8. Após o fade out completar, mostrar o novo track
                setTimeout(() => {
                    // 9. Mostrar o novo track com fade in
                    novoTrack.style.opacity = '1';
                    
                    // 10. Atualizar o índice atual e os indicadores
                    indiceAtual = novoIndice;
                    atualizarIndicadores();
                    
                    // 11. Após o fade in completar, limpar e finalizar
                    setTimeout(() => {
                        // 12. Remover o track antigo
                        if (trackAtual && trackAtual.parentNode) {
                            trackAtual.remove();
                        }
                        
                        // 13. Remover a classe temporária e adicionar a classe principal
                        novoTrack.classList.remove('new-track');
                        novoTrack.classList.add('main-track');
                        
                        // 14. Ajustar altura da seção
                        ajustarAlturaSecao();
                        
                        // 15. Finalizar a animação
                        animando = false;
                    }, 400); // Duração do fade in
                }, 400); // Duração do fade out
            });
        });
    }
    
    // Posicionar o novo track para uma transição perfeita
    function posicionarTrackParaTransicao(novoTrack) {
        novoTrack.style.position = 'absolute';
        novoTrack.style.top = '0';
        novoTrack.style.left = '0';
        novoTrack.style.width = '100%';
        novoTrack.style.height = '100%';
        novoTrack.style.opacity = '0';
        novoTrack.style.zIndex = '2'; // Garantir que fique acima do track atual durante a transição
    }
    
    // Atualizar os indicadores
    function atualizarIndicadores() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === indiceAtual);
        });
    }
    
    // Inicia o autoplay
    function iniciarAutoplay() {
        pararAutoplay(); // Parar qualquer autoplay existente
        autoplayInterval = setInterval(proximoDepoimento, 6000);
    }
    
    // Para o autoplay
    function pararAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
    
    // Iniciar o carrossel quando o DOM estiver pronto
    inicializarCarrossel();
});
