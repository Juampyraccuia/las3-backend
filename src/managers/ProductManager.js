const fs = require('fs');
const path = require('path');
const Product = require('../models/product.model');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        try {
          return JSON.parse(data);
        } catch (parseError) {
          fs.writeFileSync(this.filePath, '[]');
          return [];
        }
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      throw new Error('Error saving products: ' + error.message);
    }
  }

  async getAllProducts(options = {}) {
    const { 
      limit = 10, 
      page = 1, 
      sort, 
      query = {} 
    } = options;

    const paginateOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
    };

    try {
      const result = await Product.paginate(query, paginateOptions);
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
      };
    } catch (error) {
      throw new Error('Error getting products: ' + error.message);
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Error getting product: ' + error.message);
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error('Error adding product: ' + error.message);
    }
  }

  async updateProduct(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = ProductManager;