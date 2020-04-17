//declare middleware
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

//use middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());
//database related information

//const uri = "mongodb+srv://dbUser:password6356@cluster0-gsq7r.mongodb.net/test?retryWrites=true&w=majority";
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

// //get request
 app.get('/products',(req, res)=>{
 client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().limit(10).toArray((err,documents)=>{
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            }
           else{
            res.send(documents); 
           }  
        });
        //client.close();
      });
})
//review items
app.post('/getProductsByKey',(req, res)=>{
    const key = req.params.key;
    const productKeys = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
   
       client.connect(err => {
           const collection = client.db("onlineStore").collection("products");
           collection.find({key:{$in:productKeys}}).toArray((err,documents)=>{
               if (err) {
                   console.log(err);
                   res.status(500).send({message:err});
               }
              else{
               res.send(documents); 
              }  
           });
           //client.close();
         });
   })
//single product details by id
app.get('/product/:key',(req, res)=>{
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
   
       client.connect(err => {
           const collection = client.db("onlineStore").collection("products");
           collection.find({key:key}).toArray((err,documents)=>{
               if (err) {
                   console.log(err);
                   res.status(500).send({message:err});
               }
              else{
               res.send(documents[0]); 
              }  
           });
           //client.close();
         });
   })
   //oder placed
   app.post('/placeOrder',(req,res)=>{
    const orderInfo = req.body;
    console.log(" Before orderInfo",orderInfo);

    orderInfo.orderTime= new Date();
    console.log(" After orderInfo",orderInfo);
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    
    client.connect(error => {
        const collection = client.db("onlineStore").collection("orders");
        collection.insertOne(orderInfo ,(err,result)=>{
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            }
           else{
            res.send(result.ops[0]); 
           }  
        });
        //client.close();
      });
});
// //post request
app.post('/addProduct',(req,res)=>{
    //save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    
    client.connect(error => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product ,(err,result)=>{
            if (err) {
                console.log(err);
                res.status(500).send({message:err});
            }
           else{
          console.log("Database Connected");
          
            res.send(result.ops[0]); 
           }  
        });
        //client.close();
      });
});
const port=process.env.PORT ||5200
app.listen(port, ()=>console.log("Listening at Port 5200"));