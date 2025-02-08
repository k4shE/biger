class Cart extends HTMLElement {
    constructor() {
        super();
        this.order = new Map();
        this.summaryElement = document.querySelector("cart-summary");
        this.loadProductsFromJSON();
    }

    async loadProductsFromJSON() {
        try {
            const response = await fetch("./bin.json");
            const products = await response.json();
            localStorage.setItem("products", JSON.stringify(products));

        
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
                count: product.count ?? 1, 
                price: product.price ?? 0, 
                stock: product.stock ?? 0 
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
            product.count = Math.max(1, product.count - 1); 
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



class CartStep2 extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                .delivery-form {
                    font-family: Arial, sans-serif;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    border-radius: 10px;
                    background-color: #fff;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                .form-title {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }

                .form-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .radio-group {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .radio-group.active {
                    background-color: #e0e0e0;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .full-width {
                    grid-column: span 2;
                }

                input, select {
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin-top: 5px;
                }

                .form-note {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #555;
                }
            </style>

            <div class="delivery-form">
                <h2 class="form-title">Хүргэлтийн хаяг</h2>

                <div class="form-row radio-row form-grid">
                    <label class="radio-group active" id="radio-individual">
                        <input type="radio" name="type" value="individual" checked>
                        <span class="radio-label">
                            <i class="icon-user"></i> Хувь хүн
                        </span>
                    </label>
                    <label class="radio-group" id="radio-organization">
                        <input type="radio" name="type" value="organization">
                        <span class="radio-label">
                            <i class="icon-building"></i> Албан байгууллага
                        </span>
                    </label>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Нэр</label>
                        <input type="text" name="first_name" placeholder="Нэр оруулна уу">
                    </div>

                    <div class="form-group">
                        <label>Овог</label>
                        <input type="text" name="last_name" placeholder="Овог оруулна уу">
                    </div>

                    <div class="form-group">
                        <label>Имэйл</label>
                        <input type="email" name="email" placeholder="Имэйл хаягаа оруулна уу">
                    </div>

                    <div class="form-group">
                        <label>Утасны дугаар</label>
                        <input type="text" name="phone" placeholder="Утасны дугаараа оруулна уу">
                    </div>

                    <div class="form-group">
                        <label>Хот/Аймаг</label>
                        <select name="city">
                            <option value="ub">Улаанбаатар хот</option>
                            <option value="arhangai">Архангай аймаг</option>
                            <option value="baynolgii">Баян-Өлгий аймаг</option>
                            <option value="baynhongor">Баянхонгор аймаг</option>
                            <option value="bulgan">Булган аймаг</option>
                            <option value="govialtai">Говь-Алтай аймаг</option>
                            <option value="dornogovi">Дорноговь аймаг</option>
                            <option value="dornod">Дорнод аймаг</option>
                            <option value="dundgovi">Дундговь аймаг</option>
                            <option value="zavhan">Завхан аймаг</option>
                            <option value="ovorhangai">Өвөрхангай аймаг</option>
                            <option value="omnogovi">Өмнөговь аймаг</option>
                            <option value="suhbaatar">Сүхбаатар аймаг</option>
                            <option value="selenge">Сэлэнгэ аймаг</option>
                            <option value="tov">Төв аймаг</option>
                            <option value="uvs">Увс аймаг</option>
                            <option value="hovd">Ховд аймаг</option>
                            <option value="hovsgol">Хөвсгөл аймаг</option>
                            <option value="hentii">Хэнтий аймаг</option>
                            <option value="darhan">Дархан-Уул аймаг</option>
                            <option value="orhon">Орхон аймаг</option>
                            <option value="govisumber">Говьсүмбэр аймаг</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Дүүрэг/Сум</label>
                        <select name="district">
                            <option value="baganuur">Багануур дүүрэг</option>
                            <option value="bagahangai">Багахангай дүүрэг</option>
                            <option value="bayngol">Баянгол дүүрэг</option>
                            <option value="baynzurh">Баянзүрх дүүрэг</option>
                            <option value="nalaih">Налайх дүүрэг</option>
                            <option value="songinohairhan">Сонгинохайрхан дүүрэг</option>
                            <option value="suhbaatar">Сүхбаатар дүүрэг</option>
                            <option value="hanuul">Хан-Уул дүүрэг</option>
                            <option value="chingeltei">Чингэлтэй дүүрэг</option>

                        </select>
                    </div>

                    <div class="form-group">
                        <label>Хороо/Баг</label>
                        <select name="subdistrict">
                            <option value="1">1-р хороо</option>
                            <option value="2">2-р хороо</option>
                            <option value="3">3-р хороо</option>
                            <option value="4">4-р хороо</option>
                            <option value="5">5-р хороо</option>
                            <option value="6">6-р хороо</option>
                            <option value="7">7-р хороо</option>
                            <option value="8">8-р хороо</option>
                            <option value="9">9-р хороо</option>
                            <option value="10">10-р хороо</option>
                            <option value="11">11-р хороо</option>
                            <option value="12">12-р хороо</option>
                            <option value="13">13-р хороо</option>
                            <option value="14">14-р хороо</option>
                            <option value="15">15-р хороо</option>
                            <option value="16">16-р хороо</option>
                            <option value="17">17-р хороо</option>
                            <option value="18">18-р хороо</option>
                            <option value="19">19-р хороо</option>
                            <option value="20">20-р хороо</option>
                            <option value="21">21-р хороо</option>
                            <option value="22">22-р хороо</option>
                            <option value="23">23-р хороо</option>
                            <option value="24">24-р хороо</option>
                            <option value="25">25-р хороо</option>
                            <option value="26">26-р хороо</option>
                            <option value="27">27-р хороо</option>
                            <option value="28">28-р хороо</option>
                            <option value="29">29-р хороо</option>
                            <option value="30">30-р хороо</option>
                            <option value="31">31-р хороо</option>
                            <option value="32">32-р хороо</option>
                            <option value="33">33-р хороо</option>
                            <option value="34">34-р хороо</option>
                            <option value="35">35-р хороо</option>
                            <option value="36">36-р хороо</option>
                            <option value="37">37-р хороо</option>
                            <option value="38">38-р хороо</option>
                            <option value="39">39-р хороо</option>
                            <option value="40">40-р хороо</option>
                            <option value="41">41-р хороо</option>
                            <option value="42">42-р хороо</option>
                            <option value="43">43-р хороо</option>

                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label>Дэлгэрэнгүй хаяг</label>
                        <input type="text" name="address" placeholder="Дэлгэрэнгүй хаяг оруулна уу">
                    </div>
                </div>

                <p class="form-note">Та хаягаа зөв дэлгэрэнгүй, тодорхой оруулснаар хүргэлт удаашрахгүй байх боломжийг хангана уу</p>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.radio-group').forEach(group => {
            group.addEventListener('click', () => {
                this.shadowRoot.querySelectorAll('.radio-group').forEach(g => g.classList.remove('active'));
                group.classList.add('active');
                group.querySelector('input').checked = true;
            });
        });
    }
}

customElements.define('cart-step2', CartStep2);
