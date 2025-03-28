require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const products = require('../data/products.json');

async function migrateProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        await Product.deleteMany({});
        const productsToMigrate = products.map(({ id, ...rest }) => rest);
        const result = await Product.insertMany(productsToMigrate);
        console.log(`${result.length} products migrated successfully`);

        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

migrateProducts();