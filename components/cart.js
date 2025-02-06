class Cart extends HTMLElement {
    constructor() {
        super();
        this.order = new Map();
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
    }

    #render() {
        let htmlContent = "";
        this.order.forEach((product, key) => {
            htmlContent += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${product.imgPath}" alt="${product.alt}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${product.productName}</h3>
                        <div class="cart-item-price">${product.price} ₮</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="decrease" data-key="${key}">-</button>
                            <input type="text" class="quantity-input" value="${product.count}" readonly>
                            <button class="increase" data-key="${key}">+</button>
                        </div>
                         <div class="total">
                            <h4 class="total-price">${(product.count * product.price).toLocaleString()} ₮</h4>
                        </div>
                    </div>
                </div>`;
        });

        this.innerHTML = htmlContent || `<p class="empty-cart-message">Your cart is empty.</p>`;

        this.querySelectorAll('.decrease').forEach(button =>
            button.addEventListener('click', this.decreaseQuantity.bind(this))
        );

        this.querySelectorAll('.increase').forEach(button =>
            button.addEventListener('click', this.increaseQuantity.bind(this))
        );
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
    }

    increaseQuantity(event) {
        const key = event.target.dataset.key;
        const product = this.order.get(key);
        if (product) {
            product.count += 1;
            this.order.set(key, product);
        }
        this.#render();
    }
}

window.customElements.define('my-cart', Cart);
