require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());

const client = new MongoClient(mongoUri);

let db;

client.connect().then((client) => {
  db = client.db('demo1');
  console.log('Connected to MongoDB');
  Teams = db.collection('teams');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(console.error);

app.get('/teams', async (req, res) =>{
  try {
    const teams = await Teams.find().toArray();
    res.json(teams);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/teams/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Finding team with ID: ${id}`);
    let databaseId = { _id: new ObjectId(id) };
    const team = await Teams.findOne(databaseId);
    console.log(`Query result:`, team);
    if (team) {
      res.json(team);
    } else {
      res.status(404).send('Team not found');
    }
  } catch (err) {
    console.error("Error fetching team: ", err);
    res.status(500).send(err.message);
  }
});

app.post('/teams', async (req, res) => {
  try {
    const result = await Teams.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/teams/update/name/:id', async (req, res) =>{
  try{
    const id = req.params.id;
    let databaseId = { _id: new ObjectId(id) };
    const newName = req.body.name;
    const result = await Teams.updateOne(databaseId, { $set: { name: newName } });
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/teams/update/status/:id', async (req, res) =>{
  try{
    const id = req.params.id;
    let databaseId = { _id: new ObjectId(id) };
    const newDescription = req.body.description;
    const result = await Teams.updateOne(databaseId, {$set:{description:newDescription}});
    res.json(result)
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/teams', async (req, res) => {
  try {
    const result = await Teams.deleteOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
