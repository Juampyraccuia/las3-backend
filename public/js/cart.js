async function removeFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            location.reload();
        } else {
            throw new Error('Error al eliminar el producto del carrito');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function clearCart(cartId) {
    try {
        if (confirm('¿Está seguro que desea vaciar el carrito?')) {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                location.reload();
            } else {
                throw new Error('Error al vaciar el carrito');
            }
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function checkout() {
    try {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
            throw new Error('No se encontró el carrito');
        }

        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
            let message = '¡Compra realizada con éxito!';
            
            if (result.failedProducts && result.failedProducts.length > 0) {
                message += '\nAlgunos productos no pudieron ser comprados por falta de stock.';
            }

            alert(message);
            localStorage.removeItem('cartId');
            window.location.href = '/products';
        } else {
            throw new Error(result.error || 'Error al procesar la compra');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}