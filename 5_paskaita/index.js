require('dotenv').config();

const { MongoClient } = require('mongodb');

const port = process.env.PORT || 8080;

const URI = 'mongodb+srv://admin:admin@cluster0.eifgrzj.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(URI);

app.get('/', async (req, res) => {
  const con = await client.connect();
  const data = await con.db('cluster0').collection('cars').find().toArray();
  await con.close();
  return res.send(data);
});
