  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  require('dotenv').config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Connect to local MongoDB
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

  // Product schema
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true }
  });
  const Product = mongoose.model('Product', productSchema);

  // Routes
  app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
  });

  app.get('/api/products/low-stock', async (req, res) => {
    const products = await Product.find({ stock: { $lt: 5 } });
    res.json(products);
  });

  app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  });

  app.put('/api/products/:id', async (req, res) => {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { stock }, { new: true });
    res.json(product);
  });

  app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));