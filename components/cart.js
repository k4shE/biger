class Cart extends HTMLElement {
    constructor() {
        super();
        this.order = new Map();
    }

    connectedCallback() {
        this.loadCartFromQueryParams();
    }

    loadCartFromQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const products = urlParams.getAll('product');
        products.forEach(product => {
            this.addProduct(product);
        });
    }

    addProduct(product) {
        let count = 1;
        if (this.order.has(product)) {
            count = this.order.get(product) + 1;
        }
        this.order.set(product, count);
        this.#render();
    }

    #render() {
        let htmlContent = "";
        this.order.forEach((value, key) => {
            htmlContent += `
                <article class="cart-item">
                    <h3>${key}</h3>
                    <p>: ${value}</p>
                </article>`;
        });
        this.innerHTML = htmlContent || `<p>Your cart is empty.</p>`;
    }
}

window.customElements.define('my-cart', Cart);
