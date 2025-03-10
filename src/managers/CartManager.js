const fs = require('fs');
const path = require('path');

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/carts.json');
    this.carts = this.loadCarts();
  }

  loadCarts() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath);
      return JSON.parse(data);
    }
    return [];
  }

  saveCarts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newId = this.carts.length ? Math.max(this.carts.map(c => c.id)) + 1 : 1;
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const productIndex = cart.products.findIndex(p => p.product === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      this.saveCarts();
      return cart;
    }
    return null;
  }
}

module.exports = CartManager;
