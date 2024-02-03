const express = require('express');

const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

const products = require('./data');

app.use(express.json());

app.use(cors());

app.get('/products', (req, res) => {
  res.send(products);
});

app.get('/products/category', (req, res) =>{
  const category = req.query.category

  const newData = products.filter((product) => product.category.toLowerCase() == category.toLowerCase())

  if (newData && newData.length > 0) {
    res.json(newData);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.get('/products/product/:id', (req, res) => {
  const id = req.params.id
  const newData = products.find((product) => product.id == id);
  if (newData) {
    res.send(newData);
  } else {
    res.status(404).json({ error: `Product with id ${id} doesn't exist` });
  }
});

app.get('products/allnames', (req, res) => {
  let allNames = products.map(product => product.name);
  if (allNames && allNames.length > 0) {
    res.json(allNames);
  } else {
    res.status(404).json({ error: 'The store appears to be empty.' });
  }
});

app.get('/products/stockcheck/:number', (req, res) =>{
  const number = req.params.number;
  const lessThan = products.filter((product) => product.stock <= number);
  if (lessThan.length > 0) {
    let result = lessThan.map(product => ({ name: product.name, stock: product.stock }));
    res.json(result);
  } else {
    res.status(404).json({ error: `There are no items with less stock than ${number} units.` });
  }
});

app.get('/products/range', (req, res)=> {
  const minPrice = req.query.min;
  const maxPrice = req.query.max;
  const productsInRange = products.filter((product) => product.price >= minPrice && product.price <= maxPrice);
  res.send(productsInRange);
});

app.post('/product', (req, res) => {
  const ids = products.map(product => product.id);
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  const product = { id: nextId, ...req.body };

  if (product.name && product.category && product.price && product.stock) {
    products.push(product);
    res.status(201).send(product); // returning created user
  } else {
    res.status(400).send({
      message: 'Product data is missing. Required fields: name, category, price, available stock.',
    });
  }
});

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
