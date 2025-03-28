async function addToCart(productId) {
    try {
        // First check if product is still in stock
        const productResponse = await fetch(`/api/products/${productId}`);
        const productData = await productResponse.json();
        
        if (!productData.stock || productData.stock === 0) {
            alert('Lo sentimos, este producto está agotado');
            location.reload(); // Reload to update the UI
            return;
        }

        const quantity = parseInt(document.getElementById('quantity').value);
        if (isNaN(quantity) || quantity < 1) {
            throw new Error('Cantidad inválida');
        }

        if (quantity > productData.stock) {
            alert(`Lo sentimos, solo hay ${productData.stock} unidades disponibles`);
            document.getElementById('quantity').value = productData.stock;
            return;
        }

        let cartId = localStorage.getItem('cartId');
        if (!cartId) {
            const cartResponse = await fetch('/api/carts', {
                method: 'POST'
            });
            const cartData = await cartResponse.json();
            cartId = cartData._id;
            localStorage.setItem('cartId', cartId);
        }

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (response.ok) {
            if (confirm('Producto agregado al carrito. ¿Desea ir al carrito?')) {
                window.location.href = `/cart?cartId=${cartId}`;
            }
        } else {
            throw new Error('Error al agregar al carrito');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}