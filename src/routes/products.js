const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get('/', (req, res) => {
  const products = productManager.getAllProducts();
  res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const product = productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const newProduct = productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', (req, res) => {
  const updatedProduct = productManager.updateProduct(parseInt(req.params.pid), req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
  const deleted = productManager.deleteProduct(parseInt(req.params.pid));
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
