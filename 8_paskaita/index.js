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
    db = client.db('demo1');
    console.log('Connected to MongoDB');
    Users = db.collection('users');
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

app.post('/users', async (req, res) => {
    try {
        const result = await Users.insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/usersCount', async (req, res) => {
    try {
        const usersCount = await Users.countDocuments();
        res.json({ count: usersCount });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/usersCount/:name', async (req, res) => {
    try {
        const nameToCount = req.params.name;
        const regex = new RegExp(nameToCount.split('').join('\\s*'), "i");
        const usersCount = await Users.countDocuments({ name: regex });
        res.json({ count: usersCount });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/cities', async (req, res) => {
    try {
        const uniqueCities = await Users.distinct("city");
        const count = uniqueCities.length;
        res.json({ uniqueCitiesCount: count });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/lowestIncome', async (req, res) => {
    try {
        const sortedUsers = await Users.aggregate([
            { $sort: { income: -1 } }
        ]).toArray();

        res.json(sortedUsers);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/highestIncome', async (req, res) => {
    try {
        const sortedUsers = await Users.aggregate([
            { $sort: { income: 1 } }
        ]).toArray();

        res.json(sortedUsers);
    } catch (err) {
        res.status(500).send(err.message);
    }
});





