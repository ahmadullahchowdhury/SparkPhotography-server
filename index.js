const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application } = require('express');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${ process.env.DB_user}:${ process.env.DB_password}@cluster0.bf6hucd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const newDB = client.db("insertDB").collection('doc')
        const orderCollection = client.db('insertDB').collection('orders');
        const reviewCollection = client.db('insertDB').collection('reviews');
        // const haiku = newDB.collection("haiku");
        // create a document to insert
        // const doc = {
        //   title: "Record tor madfaasdf  of a Shriveled Datum",
        //   content: "No bytes, no problem. Just insert a document, in MongoDB",
        // }
        // const result = await newDB.insertOne(doc);
        // console.log(result)


        //limiting first 3
    app.get('/service', async(req, res) => {
        const query = {}
        const cursor = newDB.find(query).limit(3)
        const services = await cursor.toArray()
        res.send(services)
    })
    //sending all data
    app.get('/services', async(req, res) => {
        const query = {}
        const cursor = newDB.find(query)
        const services = await cursor.toArray()
        res.send(services)
    })

    // sending id specific data
    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        const service = await newDB.findOne(query)
        res.send(service)
    })

//getting all reviews
    app.get('/reviews', async(req, res) => {
        const query = {}
        const cursor = reviewCollection.find(query)
        const reviews = await cursor.toArray()
        res.send(reviews)
    })









    
    app.get('/orders', async(req, res) => {
        const query = {}
        const cursor = orderCollection.find(query)
        const orders = await cursor.toArray()
        res.send(orders)
    })
    

    app.post('/orders', async(req, res) => {
        const order = req.body;
        // console.log(order);
        const result = await orderCollection.insertOne(order);
        res.send(result);
    });

    app.delete('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        const result = await orderCollection.deleteOne(query)
        res.send(result)
        // console.log(id)
    })



    //update email
    app.get('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        // const cursor = orderCollection.findOne(query)
        const order = await orderCollection.findOne(query)
        res.send(order)
    })

    app.put('/orders/:id' , async(req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id)}
        const email = req.body;
        console.log(email)
        const option = {upsert: true}
        const updatedEmail = {
            $set : {
                email: email.email
            }
        }
        const result = await orderCollection.updateOne(query, updatedEmail, option)
        res.send(result)
    })

    

    }
    finally{

    }
}
run().catch( err =>{
    console.log(err);
})


app.get('/', (req, res) =>{
    res.send('hello')
})

app.listen(port, () =>{
    console.log(`Listenting to port, ${port}`)
})