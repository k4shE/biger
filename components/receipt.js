class ReceiptSection extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            .receipt-container {
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border: 2px solid #ddd;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .receipt-header {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #333;
            }

            .product-list {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
            }

            .product-item {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }

            .product-item h4 {
                margin: 5px 0;
                font-size: 16px;
                color: #555;
            }

            .product-item p {
                margin: 0;
                font-size: 14px;
                color: #666;
            }

            .total-price {
                text-align: right;
                font-size: 18px;
                font-weight: bold;
                margin-top: 20px;
                color: #C50E12; 

            }
            .date
                margin-top: 10px;
                text-align: right;
                font-size: 14px;
                color: #888;
            }
        `;

        const container = document.createElement('div');
        container.classList.add('receipt-container');

        container.innerHTML = `
            <div class="receipt-header">Төлбөрийн Баримт</div>
            <div class="product-list"></div>
            <div class="total-price">Нийт: </div>
            <div class="date"></div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.container = container;
        this.productList = container.querySelector('.product-list');
        this.totalPriceElement = container.querySelector('.total-price');
        this.dateTimeElement = container.querySelector('.date-time');
    }

    connectedCallback() {
        const cartElement = document.querySelector('my-cart');

        if (cartElement) {
            const products = Array.from(cartElement.order.values());
            this.renderProducts(products);
            this.displayCurrentDateTime();
        } else {
            console.error('Cart element not found.');
        }
    }

    renderProducts(products) {
        let totalPrice = 0;

        this.productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.innerHTML = `
                <h4>${product.name}</h4>
                <p>Үнэ: ${product.price.toLocaleString()} ₮</p>
                <p>Тоо хэмжээ: ${product.count}</p>
                <p>Нийт дүн: ${(product.price * product.count).toLocaleString()} ₮</p>
            `;

            this.productList.appendChild(productItem);

            totalPrice += product.price * product.count;
        });

        this.totalPriceElement.textContent = `Нийт: ${totalPrice.toLocaleString()} ₮`;
    }

    displayCurrentDateTime() {
        const now = new Date();
        const formattedDateTime = now.toLocaleString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        this.dateTimeElement.textContent = `Баримт үүсгэсэн огноо: ${formattedDateTime}`;
    }
}

customElements.define('receipt-section', ReceiptSection);
