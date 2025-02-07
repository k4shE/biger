class CartSummary extends HTMLElement {
    constructor() {
        super();
        this.products = [];
        this.totalPrice = 0;
    }

    connectedCallback() {
        this.#render();
        this.#attachEvent();
    }

    updateSummary(products, totalPrice) {
        this.products = products;
        this.totalPrice = totalPrice;
        this.#render();
        this.#attachEvent();
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
            <div class="summary-products">${productsHtml || `<p class="empty-cart-message">Таны сагс хоосон байна.</p>`}</div>
            ${this.products.length ? totalHtml : ""}
            <div class="coupon-section">
                <button class="coupon-btn">
                    <span class="coupon-label">Купон хөнгөлөлт ашиглах</span>
                </button>
            </div>
            <button class="checkout-btn">Худалдан авах</button>
        `;
    }

    #attachEvent() {
        const checkoutButton = this.querySelector(".checkout-btn");
        if (checkoutButton) {
            checkoutButton.addEventListener("click", this.#buyAllProducts.bind(this));
        }
    }

    async #buyAllProducts() {
        try {
            // Retrieve cart items from localStorage or database
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

            if (cartItems.length === 0) {
                alert("Таны сагс хоосон байна!");
                return;
            }

            // ✅ Convert cartItems into the correct format
            const formattedCart = cartItems.map(item => ({
                prodId: item.prodId,
                quantity: item.count
            }));

            // ✅ Send batch update request
            const response = await fetch("http://localhost:3000/api/products/decreaseStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cartItems: formattedCart }) // Send entire cart
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Алдаа гарлаа");
            } else {
                alert("Амжилттай захиалга хийлээ!");

                // ✅ Clear cart after successful purchase
                localStorage.removeItem("cart");
                window.location.reload(); // Refresh the page to reflect changes
            }

        } catch (err) {
            console.error("Error:", err);
            alert("Алдаа гарлаа");
        }
    }
}

window.customElements.define('cart-summary', CartSummary);
