require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());

const client = new MongoClient(mongoUri);

let db;

client.connect().then((client) => {
    db = client.db('PeopleContainer');
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(console.error);

app.get('/people', async (req, res) => {
    try {
        const collection = db.collection('people');
        const people = await collection.find({}).toArray();
        res.json(people);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/people', async (req, res) => {
    try {
        const collection = db.collection('people');
        const result = await collection.insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
