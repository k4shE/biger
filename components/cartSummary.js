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
            .map(
                (product) => `
                <div class="summary-row">
                    <span>${product.name}</span>
                    <span>${product.count} x ${product.price} ₮</span>
                </div>
            `
            )
            .join("");

        let totalHtml = `
            <div class="summary-row">
                <span>Total</span>
                <span>${this.totalPrice.toLocaleString()} ₮</span>
            </div>
        `;

        this.innerHTML = `
            <h2>Сагсны Нийтлэл</h2>
            ${productsHtml || `<p>Your cart is empty.</p>`}
            ${this.products.length ? totalHtml : ""}
            <button class="checkout-btn">Checkout</button>
            <div class="coupon-section">
                <span>Use coupon discount</span>
            </div>
        `;
    }
}

window.customElements.define('cart-summary', CartSummary);
