const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartManager {
    async createCart() {
        try {
            const cart = new Cart({ products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) throw new Error('Cart not found');
            return cart;
        } catch (error) {
            throw new Error('Error getting cart: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.products = cart.products.filter(
                item => item.product.toString() !== productId
            );
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error removing product from cart: ' + error.message);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error clearing cart: ' + error.message);
        }
    }

    async purchaseCart(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) throw new Error('Cart not found');

            const purchasedProducts = [];
            const failedProducts = [];

            for (const item of cart.products) {
                const product = item.product;
                if (product.stock >= item.quantity) {
                    // Actualizar stock
                    product.stock -= item.quantity;
                    
                    // Si el stock llega a 0, desactivar el producto
                    if (product.stock === 0) {
                        product.status = false;
                    }
                    
                    await product.save();
                    purchasedProducts.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else {
                    failedProducts.push({
                        product: product._id,
                        quantity: item.quantity,
                        reason: 'Insufficient stock'
                    });
                }
            }

            // Limpiar el carrito después de la compra
            if (purchasedProducts.length > 0) {
                cart.products = cart.products.filter(item => 
                    failedProducts.some(fp => fp.product.toString() === item.product._id.toString())
                );
                await cart.save();
            }

            return {
                status: 'success',
                purchasedProducts,
                failedProducts,
                total: purchasedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        } catch (error) {
            throw new Error('Error processing purchase: ' + error.message);
        }
    }
}

module.exports = CartManager;
