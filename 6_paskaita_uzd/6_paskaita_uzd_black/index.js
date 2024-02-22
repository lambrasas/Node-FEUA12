require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI;
let Users;
app.use(express.json());

const client = new MongoClient(mongoUri);

client.connect().then((client) => {
    db = client.db('PlaceholderPeople');
    console.log('Connected to MongoDB');
    Users = db.collection('people');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(console.error);

app.get('/users', async (req, res) =>{
    try{
        const users = await Users.find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/users/:id', async (req, res) =>{
    try{
        const id = req.params.id
        let databaseId = {userId:parseInt(id)};
        const user = await Users.findOne(databaseId);
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/users/:id', async (req, res) => {
    try{
        const id = req.params.id
        let databaseId = {userId:parseInt(id)};
        const user = await Users.deleteOne(databaseId);
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/users/update/title/:id', async (req, res) =>{
    try{
        const id = req.params.id;
        let databaseId = {userId:parseInt(id)};
        const newTitle = req.body.title;
        const result = await Users.updateOne(databaseId, {$set:{title:newTitle}});
        res.json(result)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/users/update/status/:id', async (req, res) =>{
    try{
        const id = req.params.id;
        let databaseId = {userId:parseInt(id)};
        const newStatus = req.body.completed;
        const result = await Users.updateOne(databaseId, {$set:{completed:newStatus}});
        res.json(result)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const result = await Users.insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// app.post('/product', (req, res) => {
//     const ids = products.map(product => product.id);
//     const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
//     const product = { id: nextId, ...req.body };
  
//     if (product.name && product.category && product.price && product.stock) {
//       products.push(product);
//       res.status(201).send(product); // returning created user
//     } else {
//       res.status(400).send({
//         message: 'Product data is missing. Required fields: name, category, price, available stock.',
//       });
//     }
// });
