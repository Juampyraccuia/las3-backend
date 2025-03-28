const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');
const ProductManager = require('./managers/ProductManager');
const productManager = new ProductManager();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('views', './src/views');
app.set('view engine', 'handlebars');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
io.on('connection', (socket) => {
  // Remove console.log for client connection
  
  socket.on('addProduct', async (product) => {
    try {
      const newProduct = await productManager.addProduct(product);
      io.emit('productAdded', newProduct);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('deleteProduct', async (id) => {
    try {
      await productManager.deleteProduct(id);
      io.emit('productDeleted');
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('updateProduct', async (productData) => {
    try {
      const { id, ...updateData } = productData;
      const updatedProduct = await productManager.updateProduct(id, updateData);
      if (updatedProduct) {
          io.emit('productUpdated', updatedProduct);
          io.emit('productAdded'); // This will refresh the page
      } else {
          socket.emit('error', 'Product not found');
      }
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});