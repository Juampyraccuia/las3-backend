const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// Obtener todos los productos con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getAllProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.pid);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
