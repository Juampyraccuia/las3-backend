const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(parseInt(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updatedCart = cartManager.addProductToCart(cartId, productId);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

module.exports = router;
