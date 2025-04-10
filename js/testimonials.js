document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    
    // Função para mudar o depoimento
    function changeTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Adicionar eventos de clique aos pontos de navegação
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeTestimonial(index);
        });
    });
    
    // Alternar automaticamente os depoimentos a cada 5 segundos
    setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= testimonials.length) {
            nextIndex = 0;
        }
        changeTestimonial(nextIndex);
    }, 5000);
});
