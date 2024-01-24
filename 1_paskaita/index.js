console.log("Hello, my name is Linas")
const express =require("express") //importuojam express
const app=express();//SUkuriam express aplikacija
const port = 3000;

//sukuriam route/kelia "/" kuriuo uzejus grazinsim (GET metodas) teksta "Hello World"
app.get("/",(req,res)=>{
    res.send("Hello world")
})

const cars=["Audi","BWM","VW"]
app.get("/cars",(req,res)=>{
    res.send(cars)
})

const students= [{id:1,name:"Linas",age:25}]

app.get("/students",(req,res)=>{
    res.send(students)
})

app.listen(port,()=>{
    console.log(`App is listening on the port ${port}`)
})