const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application, query } = require('express');
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${ process.env.DB_user}:${ process.env.DB_password}@cluster0.bf6hucd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next){
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization
    // console.log(authHeader);
    if(!authHeader){
        return res.status(401).send('ki bepar lukiye lukiya asa? huh tomake tho eikhane jete dibo na')
    }

    const token = authHeader.split(' ')[1];
    // console.log(token)

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: "forbidden access"})
        }
        req.decoded = decoded
        next()
    })
}

async function run(){
    try{
        const newDB = client.db("insertDB").collection('doc')
        const reviewCollection = client.db('insertDB').collection('reviews');
        const usersCollection = client.db('insertDB').collection('users');



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
    app.get('/reviews', verifyJWT,   async(req, res) => {
        const query = {}
        // const email = req.query.email
        const email = req.query.email;
        const decodedEmail = req.decoded.email
        if(email !== decodedEmail){
            return res.status(403).send({message: 'forbiddennnnn  access'})
        }
        
        const query1 = { email: email}
        const cursor = reviewCollection.find(query1)
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

    // updating review with put method

    app.put('/reviews/:id' , async(req, res) => {
        const id = req.params.id
        const query = { _id: ObjectId(id)}
        const reviewDetails = req.body;
        const option = {upsert: true}
        const updatedReview = {
            $set : {
                details: reviewDetails.details
            }
        }
        const result = await reviewCollection.updateOne(query, updatedReview, option)
        res.send(result)
    })


    app.get('/users', async(req, res) => {
        const query = {}
        const cursor = usersCollection.find(query)
        const user = await cursor.toArray()
        res.send(user)
    })


    app.post('/users', async(req, res) => {
        const addUser = req.body;
        const result = await usersCollection.insertOne(addUser);
        res.send(result);
    });

    app.get('/jwt', async(req, res) => {
        const email = req.query.email;
        const query = {email: email}
        const user = await usersCollection.findOne(query)
        if(user){
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn : '1h'} )
            return res.send({accessToken: token})

        }
        res.status(403).send({accessToken: ''})
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