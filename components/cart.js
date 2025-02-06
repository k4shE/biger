class Cart extends HTMLElement {
    constructor() {
        super();
        this.order = new Map();
        this.summaryElement = document.querySelector('cart-summary');
    }

    connectedCallback() {
        this.loadCartFromLocalStorage();
    }

    loadCartFromLocalStorage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(product => {
            const productKey = product.productName;
            this.addProduct(productKey, product);
        });
    }

    addProduct(productKey, productDetails) {
        let count = 1;
        if (this.order.has(productKey)) {
            count = this.order.get(productKey).count + 1;
        }
        this.order.set(productKey, { ...productDetails, count });
        this.#render();
        this.#updateSummary();
    }

    #render() {
        let htmlContent = `
            <div class="cart-header">
                <h2 class="cart-title">Миний сагс</h2>
                <button class="clear-cart-btn"><i class="fa-solid fa-trash"></i>Сагс хоослох</button>
            </div>
        `;

        this.order.forEach((product, key) => {
            htmlContent += `
                <div class="cart-item">
                    <div class="cart-item-left">
                        <img class="cart-item-image" src="${product.imgPath}" alt="${product.alt}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${product.productName}</div>
                            <div class="cart-item-stock">Боломжит үлдэгдэл: ${product.stock}</div>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <div class="cart-item-price">${product.price.toLocaleString()} ₮</div>
                        <div class="quantity-control">
                            <button class="decrease" data-key="${key}">-</button>
                            <input type="text" class="quantity-input" value="${product.count}" readonly>
                            <button class="increase" data-key="${key}">+</button>
                        </div>
                        <div class="cart-item-total-price">${(product.count * product.price).toLocaleString()} ₮</div>
                        <div class="cart-item-actions">
                            <button class="delete-btn" data-key="${key}">Устгах</button>
                            <button class="save-btn">Хадгалах</button>
                        </div>
                    </div>
                </div>
            `;
        });

        this.innerHTML = htmlContent || `<p class="empty-cart-message">Your cart is empty.</p>`;

        this.querySelector('.clear-cart-btn')?.addEventListener('click', this.clearCart.bind(this));
        this.querySelectorAll('.decrease').forEach(button => button.addEventListener('click', this.decreaseQuantity.bind(this)));
        this.querySelectorAll('.increase').forEach(button => button.addEventListener('click', this.increaseQuantity.bind(this)));
        this.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', this.deleteProduct.bind(this)));
    }

    clearCart() {
        this.order.clear();
        this.#render();
        this.#updateSummary();
    }

    decreaseQuantity(event) {
        const key = event.target.dataset.key;
        const product = this.order.get(key);
        if (product) {
            product.count -= 1;
            if (product.count <= 0) {
                this.order.delete(key);
            } else {
                this.order.set(key, product);
            }
        }
        this.#render();
        this.#updateSummary();
    }

    increaseQuantity(event) {
        const key = event.target.dataset.key;
        const product = this.order.get(key);
        if (product) {
            product.count += 1;
            this.order.set(key, product);
        }
        this.#render();
        this.#updateSummary();
    }

    deleteProduct(event) {
        const key = event.target.dataset.key;
        this.order.delete(key);
        this.#render();
        this.#updateSummary();
    }

    #updateSummary() {
        const products = Array.from(this.order.values()).map(product => ({
            name: product.productName,
            count: product.count,
            price: product.price
        }));
        const totalPrice = products.reduce((sum, product) => sum + (product.count * product.price), 0);

        if (this.summaryElement) {
            this.summaryElement.updateSummary(products, totalPrice);
        }
    }
}

window.customElements.define('my-cart', Cart);
