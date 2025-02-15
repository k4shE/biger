class Product {
    constructor() {
        this.apiUrl = "https://api.jsonbin.io/v3/b/67a40594e41b4d34e484d41e";
        this.apiHeaders = {
            "Content-Type": "application/json",
            "X-Master-Key": "$2a$10$aofaeXcsMz232noFjvaNxuBYbPIASxac.xpHhvf6qUHoIJ374QeBi"
        };
        this.container = document.querySelector('.prod-grid');
        this.init();
        this.attachCategoryFilterListeners();
    }

    async init() {
        try {
            this.products = await this.fetchProductData();
            this.applyFiltersFromUrl();
        } catch (error) {
            console.error('Error fetching or rendering products:', error);
        }
    }

    async fetchProductData() {
        const response = await fetch(this.apiUrl, {
            method: "GET",
            headers: this.apiHeaders
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.record;
    }

    applyFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        const filteredProducts = this.filterProducts(category);
        this.renderProducts(filteredProducts);
    }

    filterProducts(category) {
        if (!category || category === "all") {
            return this.products;  
        }

        return this.products.filter(product => product.class.includes(category));
    }

    renderProducts(products) {
        this.container.innerHTML = '';  

        if (products.length === 0) {
            this.container.innerHTML = '<p>No products found.</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'prod-card';
            productElement.innerHTML = `
                <img src="${product.img}" alt="${product.alt}">
                <h2>${product.name}</h2>
                <div class="prod-card-link">
                    <button class="add-to-cart-button" data-product-id="${product.cartid}">
                        <i class="fa-solid fa-bag-shopping" style="color: #000000;"></i>
                    </button>
                    <a href="./product-info.html?product=${product.param}">Дэлгэрэнгүй</a>
                </div>
            `;

            productElement.querySelector('.add-to-cart-button').addEventListener('click', () => {
                this.addProductToCart(product);
            });

            this.container.appendChild(productElement);
        });
    }

    addProductToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} Бүтээгдэхүүн сагсанд амжилттай нэмэгдлээ.`);
    }

    attachCategoryFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const category = button.dataset.category;

                const newUrl = `${window.location.pathname}?category=${category}`;
                window.history.pushState({ path: newUrl }, '', newUrl);

                const filteredProducts = this.filterProducts(category);
                this.renderProducts(filteredProducts);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Product();
});



