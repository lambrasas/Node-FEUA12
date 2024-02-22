require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

const client = new MongoClient(mongoUri);

let db ,servicesCollection, usersCollection;

client.connect()
  .then(client => {
    db = client.db('demo1');
    servicesCollection = db.collection('services');
    usersCollection = db.collection('users');
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
})
.catch(console.error);

app.get('/memberships', async (req, res) => {
    try {
      const services = await servicesCollection.find().toArray();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  

app.get('/users/:order', async (req, res) => {
    const { order } = req.params;
    let sortOrder = {};
    if (order === 'desc') {
      sortOrder.name = 1;
    } else if (order === 'asc') {
      sortOrder.name = -1;
    } else {
      return res.status(400).send('Invalid order parameter. Use "asc" for ascending or "desc" for descending.');
    }
  
    try {
      const users = await db.collection('users').find().sort(sortOrder).toArray();
      res.json(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
});

app.post('/memberships', async (req, res) => {
    try {
      const result = await servicesCollection.insertOne(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
});

app.post('/users', async (req, res) => {
  try {
    if (req.body.service_id && ObjectId.isValid(req.body.service_id)) {
      req.body.service_id = new ObjectId(req.body.service_id);
    }
    const result = await usersCollection.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/memberships/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const _id = new ObjectId(id);
        const result = await servicesCollection.deleteOne({ _id });
        if (result.deletedCount === 0) {
            return res.status(404).send("Membership not found.");
        }
        res.json(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/usersMembership/:order', async (req, res) => {
  const { order } = req.params;
    let sortOrder = {};
    if (order === 'desc') {
      sortOrder.name = 1;
    } else if (order === 'asc') {
      sortOrder.name = -1;
    } else {
      return res.status(400).send('Invalid order parameter. Use "asc" for ascending or "desc" for descending.');
    }
  
  try {
    const users = await db.collection('users').find().sort(sortOrder).toArray()
    const services = await servicesCollection.find().toArray();
    let usersMembership = users.map(user => {
      return {...user, membership:getMembershipName(user,services), ip:createIp()} 
    })
    res.json(usersMembership)
  } catch (error) {
    res.status(500).send(error.message);
  }
});

function getMembershipName(user,memberships){
  let membershipName = memberships.find(membership => membership._id.toString() === user.service_id.toString())
  return membershipName ? membershipName: {name:"Removed"}
}

function createIp(){
  let ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  return ip
}




  
  
  
  