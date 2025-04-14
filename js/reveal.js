document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, options);

    revealElements.forEach(el => {
        observer.observe(el);
    });
});
