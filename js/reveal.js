document.addEventListener('DOMContentLoaded', function() {
    // Select all reveal elements
    const revealElements = document.querySelectorAll('.reveal-element');
    
    // Create observer options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Callback for intersection observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create observer
    const observer = new IntersectionObserver(revealCallback, options);
    
    // Observe each reveal element
    revealElements.forEach(el => {
        observer.observe(el);
    });
});
