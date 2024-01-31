const express = require("express");
const cors = require("cors");
const data = require("./data");

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

// GET Returns all users (grąžina visus vartotojus)
app.get("/users", (req, res) => {
  res.send(data);
});

app.get("/users/brand", (req, res) => {
  const brand = req.query.brand
  const newData = data.filter((user)=>user.car.toLowerCase()===brand.toLowerCase())
  res.send(newData);
});

app.get('/users/emails',(req,res)=>{
  const emails=data.map((user)=>user.email)
  res.send(emails)
})

app.get('/users/females', (req, res) => {
  const filteredFemales = data.filter(user => user.gender === 'Female');
  const fullNames = filteredFemales.map(female => `${female.first_name} ${female.last_name}`);
  res.send(fullNames);
});


app.get('/user', (req,res)=>{
  const id = req.query.id
  const user = data.find((user)=>user.id==id)

  if(user){
    res.json(user)
  }else{
    res.status(404).json({error:"User not found"})
  }
  
})

app.listen(port, ()=>{
  console.log(`Server is running on ${port} port`)
})


