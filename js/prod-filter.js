
document.addEventListener("DOMContentLoaded", function() {
    const categoryLinks = document.querySelectorAll('.product-categories a');
    const productCards = document.querySelectorAll('.prod-card');

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const category = link.getAttribute('data-category');
            
            filterProducts(category);

            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
