const express = require('express');
const cors = require('cors');
const client = require('./db');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// ✅ GET All Products
app.get('/api/products', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM public.products');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send('Database error');
    }
});

// ✅ Reduce Stock by Purchased Quantity (Handles Multiple Products Correctly)
app.post('/api/products/decreaseStock', async (req, res) => {
    const { cartItems } = req.body; // Expecting an array of products [{ prodId, quantity }]

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: 'Invalid cart data' });
    }

    try {
        // ✅ Start a database transaction to ensure all updates happen together
        await client.query('BEGIN');

        for (const item of cartItems) {
            const { prodId, quantity } = item;

            // 1️⃣ Check if the product exists and get current stock (WITH LOCK)
            const checkStock = await client.query(
                'SELECT stock FROM public.products WHERE prodId = $1 FOR UPDATE', 
                [prodId]
            );

            if (checkStock.rowCount === 0) {
                await client.query('ROLLBACK'); // Undo changes if a product is not found
                return res.status(404).json({ message: `Product ${prodId} not found` });
            }

            const currentStock = checkStock.rows[0].stock;

            // 2️⃣ Ensure enough stock is available before updating
            if (currentStock < quantity) {
                await client.query('ROLLBACK'); // Undo changes if stock is too low
                return res.status(400).json({ message: `Not enough stock for product ${prodId}. Only ${currentStock} left.` });
            }

            // 3️⃣ Update stock correctly
            await client.query(
                'UPDATE public.products SET stock = stock - $2 WHERE prodId = $1',
                [prodId, quantity]
            );
        }

        // ✅ Commit transaction after all updates are successful
        await client.query('COMMIT');

        res.status(200).json({ message: 'Stock updated successfully' });

    } catch (err) {
        await client.query('ROLLBACK'); // Undo changes if an error occurs
        console.error("Error updating stock:", err);
        res.status(500).send('Database error');
    }
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
