const express = require('express');
const router = express.Router();
const CartManager = require('../managers/cartmanager');

const cartManager = new CartManager();

// Create a new cart
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Add product to cart
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { quantity = 1 } = req.body;
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid, parseInt(quantity));
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Update cart with new products array
router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Update product quantity
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ status: 'error', error: 'Invalid quantity' });
        }
        const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Delete product from cart
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Clear cart
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Purchase cart
router.post('/:cid/purchase', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ status: 'error', error: 'Cart is empty or not found' });
        }

        const purchaseResult = await cartManager.purchaseCart(req.params.cid);
        res.json(purchaseResult);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

module.exports = router;
