const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const ProductManager = require('./managers/ProductManager');
const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', engine({
  layoutsDir: './src/views/layouts',
  partialsDir: './src/views/partials',
  extname: 'handlebars',
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(express.static('public')); // Para servir archivos estáticos

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista de inicio
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    title: 'Productos en Tiempo Real',
    socket: true
  });
});

// Crear servidor HTTP y Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Crear una instancia de ProductManager
const productManager = new ProductManager();

// Manejo de conexiones de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado con ID:', socket.id);

  // Emitir la lista de productos al cliente cuando se conecta
  socket.emit('updateProducts', productManager.getAllProducts());

  // Escuchar eventos de agregar y eliminar productos
  socket.on('addProduct', (product) => {
    try {
      console.log('Intentando agregar producto:', product);
      const newProduct = productManager.addProduct(product);
      console.log('Producto agregado:', newProduct);
      io.emit('updateProducts', productManager.getAllProducts());
    } catch (error) {
      console.error('Error al agregar producto:', error);
      socket.emit('error', 'Error al agregar el producto');
    }
  });

  socket.on('deleteProduct', (id) => {
    try {
      console.log('Intentando eliminar producto con ID:', id);
      const resultado = productManager.deleteProduct(id);
      console.log('Resultado de la eliminación:', resultado);
      if (resultado) {
        io.emit('updateProducts', productManager.getAllProducts());
      } else {
        socket.emit('error', 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      socket.emit('error', 'Error al eliminar el producto');
    }
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado con ID:', socket.id);
  });
});

// Manejo de errores de Socket.IO
io.on('connection_error', (error) => {
  console.error('Error de conexión:', error.message);
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});