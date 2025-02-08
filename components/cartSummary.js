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
            <button class="checkout-btn cart-btns">Худалдан авах</button>
            <button class="payment-method-btn cart-btns hidden">Төлбөрийн нөхцөл сонгох</button>
            <br>
            <button class="step2-prev-step-btn cart-btns hidden">Өмнөх алхам руу буцах</button>
            <br>

            <button class="end-purchase-btn cart-btns hidden">Захиалга дуусгах</button>
            <br>
            <button class="step3-prev-step-btn cart-btns hidden">Өмнөх алхам руу буцах</button>
            <button class="back-to-cart-btn cart-btns hidden">Буцах</button>    
            `;
    }

    #attachEvent() {
        const checkoutButton = this.querySelector(".checkout-btn");
        const paymentButton = this.querySelector(".payment-method-btn");
        const prevStepButton = this.querySelector(".step2-prev-step-btn");
        const endPurchaseButton = this.querySelector(".end-purchase-btn");
        const prevStepButton2 = this.querySelector(".step3-prev-step-btn");
        const backToCartButton = this.querySelector(".back-to-cart-btn");
        if (checkoutButton) {
            checkoutButton.addEventListener("click", () => {
                const myCartElement = document.getElementById("cart-step-1");
                const cartStep2Element = document.getElementById("cart-step-2");
            
                if (myCartElement && cartStep2Element) {
                    myCartElement.classList.add("hidden");
                    cartStep2Element.classList.remove("hidden");
                }
            
                const step1 = document.getElementById("step-1");
                const step2 = document.getElementById("step-2");
            
                if (step1 && step2) {
                    step1.classList.remove("active");
                    step2.classList.add("active");
                }
            
                checkoutButton.classList.add("hidden");
                if (paymentButton) paymentButton.classList.remove("hidden");
                if (prevStepButton) prevStepButton.classList.remove("hidden");
            });
            
        }
    
        if (paymentButton) {
            paymentButton.addEventListener("click", () => {
                const cartStep2Element = document.getElementById("cart-step-2");
                const paymentMethodElement = document.getElementById("payment-method");

                if (cartStep2Element && paymentMethodElement) {
                    cartStep2Element.classList.add("hidden");
                    paymentMethodElement.classList.remove("hidden");
                }
                const step2 = document.getElementById("step-2");
                const step3 = document.getElementById("step-3");
            
                if (step2 && step3) {
                    step2.classList.remove("active");
                    step3.classList.add("active");
                }
            
                paymentButton.classList.add("hidden");
                if (paymentButton) paymentButton.classList.add("hidden");
                if (prevStepButton) prevStepButton.classList.add("hidden");
                if (endPurchaseButton) endPurchaseButton.classList.remove("hidden");
                if (prevStepButton2) prevStepButton2.classList.remove("hidden");
            });
        }


        if (endPurchaseButton) {
            endPurchaseButton.addEventListener("click", () => {
                const paymentMethodElement = document.getElementById("payment-method");
                const lastStepElement = document.getElementById("last-step");
                if (paymentMethodElement && lastStepElement){
                    paymentMethodElement.classList.add("hidden");
                    lastStepElement.classList.remove("hidden");
                }
                const step3 = document.getElementById("step-3");
                const step4 = document.getElementById("step-4");
                if (step3 && step4) {
                    step3.classList.remove("active");
                    step4.classList.add("active");
                }
                endPurchaseButton.classList.add("hidden");
                if (endPurchaseButton) endPurchaseButton.classList.add("hidden");
                if (prevStepButton2) prevStepButton2.classList.add("hidden");
                if (backToCartButton) backToCartButton.classList.remove("hidden");
            });
        }
        if (backToCartButton) {
            backToCartButton.addEventListener("click", () => {
                const lastStepElement = document.getElementById("last-step");
                const cartStep1Element = document.getElementById("cart-step-1");
                if (lastStepElement && cartStep1Element) {
                    lastStepElement.classList.add("hidden");
                    cartStep1Element.classList.remove("hidden");
                }
                const step4 = document.getElementById("step-4");
                const step1 = document.getElementById("step-1");
                if (step4 && step1) {
                    step4.classList.remove("active");
                    step1.classList.add("active");
                }
                backToCartButton.classList.add("hidden");
                if (backToCartButton) backToCartButton.classList.add("hidden");
                if (paymentButton) checkoutButton.classList.remove("hidden");
            });
        }
        if (prevStepButton) {
            prevStepButton.addEventListener("click", () => {
                const myCartElement = document.getElementById("cart-step-1");  
                const cartStep2Element = document.getElementById("cart-step-2");
    
                if (myCartElement && cartStep2Element) {
                    myCartElement.classList.remove("hidden");
                    cartStep2Element.classList.add("hidden");
                }
    
                const step1 = document.getElementById("step-1");
                const step2 = document.getElementById("step-2");
    
                if (step1 && step2) {
                    step2.classList.remove("active");
                    step1.classList.add("active");
                }
    
                checkoutButton.classList.remove("hidden");
                if (paymentButton) paymentButton.classList.add("hidden");
                if (prevStepButton) prevStepButton.classList.add("hidden");
            });
        }
        if (prevStepButton2) {
            prevStepButton2.addEventListener("click", () => {
                const myCartElement = document.getElementById("cart-step-2");  
                const cartStep2Element = document.getElementById("payment-method");
    
                if (myCartElement && cartStep2Element) {
                    myCartElement.classList.remove("hidden");
                    cartStep2Element.classList.add("hidden");
                }
    
                const step2 = document.getElementById("step-2");
                const step3 = document.getElementById("step-3");
    
                if (step2 && step3) {
                    step3.classList.remove("active");
                    step2.classList.add("active");
                }
    
                paymentButton.classList.remove("hidden");
                prevStepButton.classList.remove("hidden");
                if (endPurchaseButton) endPurchaseButton.classList.add("hidden");
                if (prevStepButton2) prevStepButton2.classList.add("hidden");
            });
        }
        if (endPurchaseButton) {
            endPurchaseButton.addEventListener("click", this.#buyAllProducts.bind(this));
        }
        
    }
    
    
    displayReceipt() {
        const receiptWindow = window.open('', 'Receipt', 'width=600,height=800');
        if (!receiptWindow) return;

        const receiptContent = `
            <html>
            <head>
                <title>Receipt</title>
                <style>
                    body { font-family: 'EB Garamond', serif; padding: 20px; }
                    .receipt-header { font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
                    .receipt-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .receipt-total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
                </style>
            </head>
            <body>
                <div class="receipt-header">Receipt</div>
                ${this.products.map(product => `
                    <div class="receipt-item">
                        <span>${product.name} (x${product.count})</span>
                        <span>${(product.count * product.price).toLocaleString()} ₮</span>
                    </div>
                `).join('')}
                <div class="receipt-total">Total: ${this.totalPrice.toLocaleString()} ₮</div>
            </body>
            </html>
        `;

        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
    }

    async #buyAllProducts() {
        try {
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

            if (cartItems.length === 0) {
                alert("Таны сагс хоосон байна!");
                return;
            }

            const formattedCart = cartItems.map(item => ({
                prodId: item.prodId,
                quantity: item.count
            }));

            const response = await fetch("http://localhost:3000/api/products/decreaseStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cartItems: formattedCart })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Алдаа гарлаа");
            } else {
                alert("Амжилттай захиалга хийлээ!");
                localStorage.removeItem("cart");
                window.location.reload();
            }

        } catch (err) {
            console.error("Error:", err);
            alert("Алдаа гарлаа");
        }
    }

}

window.customElements.define('cart-summary', CartSummary);
