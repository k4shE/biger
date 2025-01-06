class Baraa extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.productName = this.getAttribute("name");
        this.price = this.getAttribute("price") || "unegui";
        this.cartid = this.getAttribute("cartid") || "cart";
        this.imgPath = this.getAttribute("img");
        this.alt = this.getAttribute("alt");
        this.class = this.getAttribute("class");
        this.buttonId = this.getAttribute("id");
        this.#render();
        this.querySelector("button").addEventListener("click", this.AddProductToCart.bind(this));
    }

    AddProductToCart(e) {
        const product = {
            productName: this.productName,
            price: this.price,
            cartid: this.cartid,
            imgPath: this.imgPath,
            alt: this.alt,
        };

        // Retrieve existing cart data from localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);

        // Save updated cart data
        localStorage.setItem('cart', JSON.stringify(cart));

        // Redirect to the cart page
        window.location.href = "cart.html";
    }

    #render() {
        let tmpl = `
            <div class="prod-card ${this.class}">
                <img src="${this.imgPath}" alt="${this.alt}">
                <h2>${this.productName}</h2>
                <div class="prod-card-link">
                    <button>
                        <i class="fa-solid fa-bag-shopping" style="color: #000000;"></i> 
                    </button>
                    <a href="./product-info.html">Дэлгэрэнгүй</a>   
                </div>
            </div>`;
        this.innerHTML = tmpl;
    }
}

window.customElements.define('my-product', Baraa);
