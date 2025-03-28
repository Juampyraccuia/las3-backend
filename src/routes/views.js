const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/cartmanager');

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    try {
        const result = await productManager.getAllProducts({ limit, page, sort, query });
        res.render('products', {
            products: result.payload,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            }
        });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (product) {
            res.render('productDetail', { product });
        } else {
            res.status(404).render('error', { message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await productManager.getAllProducts();
        res.render('realTimeProducts', { 
            products: result.payload 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/cart', async (req, res) => {
    try {
        const cartId = req.query.cartId;
        if (!cartId) {
            return res.render('cart', { cart: { products: [] }, total: 0 });
        }

        const cart = await cartManager.getCartById(cartId);
        const total = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.render('cart', { cart, total });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

// Agregar esta nueva ruta para ver un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        const total = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);
        res.render('cart', { cart, total });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

// Unificar las rutas del carrito
router.get('/cart/:cid?', async (req, res) => {
    try {
        const cartId = req.params.cid || req.query.cartId;
        if (!cartId) {
            return res.render('cart', { cart: { products: [] }, total: 0 });
        }

        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        const total = cart.products.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.render('cart', { cart, total });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

module.exports = router;