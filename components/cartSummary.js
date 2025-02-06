class CartSummary extends HTMLElement {
    constructor() {
        super();
        this.products = [];
        this.totalPrice = 0;
    }

    connectedCallback() {
        this.#render();
    }

    updateSummary(products, totalPrice) {
        this.products = products;
        this.totalPrice = totalPrice;
        this.#render();
    }

    #render() {
        let productsHtml = this.products
            .map(product => `
                <div class="summary-row">
                    <div class="summary-product-info">
                        <div class="summary-product-name">${product.name}</div>
                        <span class="summary-product-quantity">x${product.count}</span>
                    </div>
                    <div class="summary-product-price">${(product.count * product.price).toLocaleString()} ₮</div>
                </div>
            `).join("");

        let totalHtml = `
            <div class="summary-total-row">
                <span class="summary-total-label">Нийт</span>
                <span class="summary-total-value">${this.totalPrice.toLocaleString()} ₮</span>
            </div>
        `;

        this.innerHTML = `
            <h2 class="summary-title">Захиалгын мэдээлэл</h2>
            <div class="summary-products">${productsHtml || `<p class="empty-cart-message">Your cart is empty.</p>`}</div>
            ${this.products.length ? totalHtml : ""}
            <div class="coupon-section">
                <button class="coupon-btn">
                    <span class="coupon-label">Купон хөнгөлөлт ашиглах</span>
                </button>
            </div>
            <button class="checkout-btn">Худалдан авах</button>
        `;
    }
}

window.customElements.define('cart-summary', CartSummary);
