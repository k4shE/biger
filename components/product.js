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
        this.querySelector("button").addEventListener("click", this.AddProductToCart.bind(this))
    }

    AddProductToCart(e) {
        const productName = this.productName;
        const currentUrl = new URL(window.location.href);
        const cartUrl = new URL("cart.html", currentUrl);
        const urlParams = new URLSearchParams(cartUrl.search);
        urlParams.append('product', productName); 
        cartUrl.search = urlParams.toString();
        window.location.href = cartUrl; 
    }
    

    

    #render() {
        let tmpl = "";
            tmpl =
                `<div class="prod-card ${this.class}">
                    <img src="${this.imgPath}" alt="${this.alt}">
                    <h2>${this.productName}</h2>
                    <div class="prod-card-link">
                        <button>
                            <i class="fa-solid fa-bag-shopping" style="color: #000000;"></i> 
                        </button id="${this.id}">
                        <a href="./product-info.html">Дэлгэрэнгүй</a>   
                    </div>
                </div>`;

        this.innerHTML = tmpl;
    }

    full() {
        return `<p>${this.price}</p>`;
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {

    }

    adoptedCallback() {

    }
}

window.customElements.define('my-product', Baraa);   