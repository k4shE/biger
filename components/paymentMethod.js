class PaymentSection extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        
        const style = document.createElement('style');
        style.textContent = `
            .payment-methods {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 0 auto;
                max-width: 1200px;
            }

            .payment-method {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                border: 2px solid #ddd;
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s ease;
            }

            .payment-method.active {
                border-color: #007bff;
                background-color: #e6f0ff;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .payment-method h3 {
                margin: 10px 0;
                font-size: 18px;
                color: #333;
            }

            .payment-method img {
                width: 50px;
                height: 50px;
                margin-bottom: 10px;
            }
        `;

        const container = document.createElement('div');
        container.classList.add('payment-methods');

        container.innerHTML = `
            <button class="payment-method active" data-method="bank-transfer">
                <img src="images/qpay.jpg" alt="Bank Transfer">
                <h3>Дансаар эсвэл QR кодоор шилжүүлэх</h3>
            </button>
            <button class="payment-method" data-method="khaan-bank">
                <img src="images/khanbank.png" alt="Khaan Bank">
                <h3>Карт (Хаан Банк)</h3>
            </button>
            <button class="payment-method" data-method="xhb-card">
                <img src="images/hudaldaa-hogjliin-bank.png" alt="XHB Card">
                <h3>Карт (XHB)</h3>
            </button>
            <button class="payment-method" data-method="golomt-bank">
                <img src="images/golomt-bank.png" alt="Golomt Bank">
                <h3>Голомт (Карт)</h3>
            </button>
            <button class="payment-method" data-method="social-pay">
                <img src="images/social-pay.png" alt="Social Pay">
                <h3>Social Pay</h3>
            </button>
        `;

        shadow.appendChild(style);
        shadow.appendChild(container);

        const paymentMethods = container.querySelectorAll('.payment-method');

        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                console.log('Selected payment method:', method.dataset.method);
            });
        });
    }
}

customElements.define('payment-section', PaymentSection);
