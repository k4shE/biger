class Cart extends HTMLElement {
    constructor() {
        super();
        this.order = new Map();
        this.summaryElement = document.querySelector("cart-summary");
        this.loadProductsFromJSON(); // Fetch products from bin.json
    }

    async loadProductsFromJSON() {
        try {
            const response = await fetch("./bin.json");
            const products = await response.json();
            localStorage.setItem("products", JSON.stringify(products));

            // Ensure cart updates with the latest product data
            this.loadCartFromLocalStorage();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    connectedCallback() {
        this.loadCartFromLocalStorage();
    }

    loadCartFromLocalStorage() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.order.clear();
        cart.forEach(product => {
            this.order.set(product.prodId, {
                ...product,
                count: product.count ?? 1, // Default to 1 if undefined
                price: product.price ?? 0, // Default to 0 if undefined
                stock: product.stock ?? 0  // Default to 0 if undefined
            });
        });
        this.render();
        this.updateSummary();
    }

    addProduct(productKey, productDetails) {
        let count = 1;
        if (this.order.has(productKey)) {
            count = this.order.get(productKey).count + 1;
        }

        if (count > productDetails.stock) {
            alert(`Нөөц хүрэлцэхгүй байна! (${productDetails.stock} ширхэг үлдсэн)`);
            return;
        }

        this.order.set(productKey, { ...productDetails, count });

        // Save updated cart to localStorage
        this.saveCartToLocalStorage();
        this.render();
        this.updateSummary();
    }

    saveCartToLocalStorage() {
        const cartArray = Array.from(this.order.values());
        localStorage.setItem("cart", JSON.stringify(cartArray));
    }

    render() {
        let htmlContent = `
            <div class="cart-header">
                <h2 class="cart-title">Миний сагс</h2>
                <button class="clear-cart-btn"><i class="fa-solid fa-trash"></i> Сагс хоослох</button>
            </div>
        `;

        this.order.forEach((product, key) => {
            let count = product.count ?? 1; 
            let price = product.price ?? 0;
            let stock = product.stock ?? 0;
            let totalPrice = count * price;

            htmlContent += `
                <div class="cart-item">
                    <div class="cart-item-left">
                        <img class="cart-item-image" src="${product.img}" alt="${product.alt}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${product.name}</div>
                            <div class="cart-item-stock">Боломжит үлдэгдэл: ${stock - count}</div>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <div class="cart-item-price">${price.toLocaleString()} ₮</div>
                        <div class="quantity-control">
                            <button class="decrease" data-key="${key}">-</button>
                            <input type="text" class="quantity-input" value="${count}" readonly>
                            <button class="increase" data-key="${key}">+</button>
                        </div>
                        <div class="cart-item-total-price">${totalPrice.toLocaleString()} ₮</div>
                        <div class="cart-item-actions">
                            <button class="delete-btn" data-key="${key}">Устгах</button>
                        </div>
                    </div>
                </div>
            `;
        });

        this.innerHTML = htmlContent || `<p class="empty-cart-message">Таны сагс хоосон байна.</p>`;

        this.querySelector(".clear-cart-btn")?.addEventListener("click", this.clearCart.bind(this));
        this.querySelectorAll(".decrease").forEach(button => button.addEventListener("click", this.decreaseQuantity.bind(this)));
        this.querySelectorAll(".increase").forEach(button => button.addEventListener("click", this.increaseQuantity.bind(this)));
        this.querySelectorAll(".delete-btn").forEach(button => button.addEventListener("click", this.deleteProduct.bind(this)));
    }

    clearCart() {
        this.order.clear();
        this.saveCartToLocalStorage();
        this.render();
        this.updateSummary();
    }

    decreaseQuantity(event) {
        const key = event.target.dataset.key;
        const product = this.order.get(key);
        if (product) {
            product.count = Math.max(1, product.count - 1); // Prevent negative values
            this.order.set(key, product);
        }
        this.saveCartToLocalStorage();
        this.render();
        this.updateSummary();
    }

    increaseQuantity(event) {
        const key = event.target.dataset.key;
        const product = this.order.get(key);

        if (product) {
            if (product.count + 1 > product.stock) {
                alert(`Нөөц хүрэлцэхгүй байна! (${product.stock} ширхэг үлдсэн)`);
                return;
            }
            product.count += 1;
            this.order.set(key, product);
        }

        this.saveCartToLocalStorage();
        this.render();
        this.updateSummary();
    }

    deleteProduct(event) {
        const key = event.target.dataset.key;
        this.order.delete(key);
        this.saveCartToLocalStorage();
        this.render();
        this.updateSummary();
    }

    updateSummary() {
        let totalPrice = 0;

        this.order.forEach(product => {
            let price = product.price ?? 0;
            let count = product.count ?? 1;
            totalPrice += price * count;
        });

        if (this.summaryElement) {
            this.summaryElement.updateSummary(Array.from(this.order.values()), totalPrice);
        }
    }
}

window.customElements.define("my-cart", Cart);
