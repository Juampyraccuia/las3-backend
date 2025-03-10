const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '../data/products.json');
    console.log('Ruta del archivo:', this.filePath);
    this.products = this.loadProducts();
    console.log('Productos cargados:', this.products);
  }

  loadProducts() {
    try {
      if (fs.existsSync(this.filePath)) {
        console.log('Archivo existe en:', this.filePath);
        const data = fs.readFileSync(this.filePath, 'utf8');
        console.log('Contenido completo del archivo:');
        console.log('-----------------------------');
        console.log(data);
        console.log('-----------------------------');

        // Verificar si hay problemas con el formato JSON
        try {
          const products = JSON.parse(data);
          console.log('Productos parseados:', products);
          return products;
        } catch (parseError) {
          console.error('Error al parsear JSON:', parseError);
          console.log('Intentando reparar el JSON...');
          // Limpiar el archivo y crear uno nuevo
          fs.writeFileSync(this.filePath, '[]');
          return [];
        }
      }
      console.log('Archivo no existe, creando array vacío');
      return [];
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  }

  saveProducts() {
    try {
      console.log('Guardando productos:', this.products);
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
      console.log('Productos guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar productos:', error);
    }
  }

  getAllProducts() {
    console.log('Obteniendo todos los productos:', this.products);
    return this.products;
  }

  getProductById(id) {
    console.log('Buscando producto con ID:', id);
    return this.products.find(product => product.id === id);
  }

  addProduct(product) {
    console.log('Agregando nuevo producto:', product);
    const newId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...product };
    this.products.push(newProduct);
    this.saveProducts();
    console.log('Producto agregado exitosamente:', newProduct);
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    console.log('Actualizando producto con ID:', id);
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      console.log('Producto encontrado:', this.products[productIndex]);
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.saveProducts();
      console.log('Producto actualizado:', this.products[productIndex]);
      return this.products[productIndex];
    }
    console.log('Producto no encontrado');
    return null;
  }

  deleteProduct(id) {
    console.log('Intentando eliminar producto con ID:', id);
    console.log('Tipo de ID:', typeof id);
    console.log('Productos antes de eliminar:', this.products);

    // Convertir el ID a número si es string
    const numericId = Number(id);
    console.log('ID numérico:', numericId);

    const productIndex = this.products.findIndex(product => product.id === numericId);
    console.log('Índice encontrado:', productIndex);

    if (productIndex !== -1) {
      console.log('Producto encontrado:', this.products[productIndex]);
      this.products.splice(productIndex, 1);
      this.saveProducts();
      console.log('Productos después de eliminar:', this.products);
      return true;
    }
    console.log('Producto no encontrado con ID:', id);
    return false;
  }
}

module.exports = ProductManager;