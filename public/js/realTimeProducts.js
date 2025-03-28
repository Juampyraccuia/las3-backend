const socket = io();

function deleteProduct(event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value;
    socket.emit('deleteProduct', id);
    event.target.reset();
}

function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const product = {
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: parseFloat(form.price.value),
        status: form.status.checked,
        stock: parseInt(form.stock.value),
        category: form.category.value,
        thumbnails: form.thumbnails.value.split(',').map(url => url.trim())
    };
    socket.emit('addProduct', product);
    form.reset();
}

function updateProduct(event) {
    event.preventDefault();
    const form = event.target;
    const updatedFields = {
        id: form.id.value.trim(), // Ensure ID is trimmed
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: form.price.value ? parseFloat(form.price.value) : undefined,
        status: form.status.checked,
        stock: form.stock.value ? parseInt(form.stock.value) : undefined,
        category: form.category.value,
        thumbnails: form.thumbnails.value ? form.thumbnails.value.split(',').map(url => url.trim()) : undefined
    };

    // Only include fields that have values
    Object.keys(updatedFields).forEach(key => 
        (updatedFields[key] === undefined || updatedFields[key] === '') && delete updatedFields[key]
    );

    socket.emit('updateProduct', updatedFields);
    form.reset();
}

// Add these event listeners
socket.on('productUpdated', () => {
    location.reload();
});

socket.on('productAdded', () => {
    location.reload();
});

socket.on('productDeleted', () => {
    location.reload();
});

socket.on('error', (error) => {
    alert('Error: ' + error);
});