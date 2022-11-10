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



        //limiting last 3
    app.get('/service', async(req, res) => {
        const query = {}
        const cursor = newDB.find(query).limit(3).sort({_id:-1})
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

    // user adding service code 
    app.post('/services', async(req, res) => {
        const addService = req.body;
        const result = await newDB.insertOne(addService);
        res.send(result);
    });



//getting all reviews
    app.get('/reviews', async(req, res) => {
        const query = {}
        const cursor = reviewCollection.find(query).sort({_id:-1})
        const reviews = await cursor.toArray()
        res.send(reviews)
    })


    
    //user posting review code

    app.post('/reviews', async(req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    });

    //user review delete code

    app.delete('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        const result = await reviewCollection.deleteOne(query)
        res.send(result)
 
    })

    //sending single reviews with _id for updating review

    app.get('/reviews/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)}
        // const cursor = orderCollection.findOne(query)
        const review = await reviewCollection.findOne(query)
        res.send(review)
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