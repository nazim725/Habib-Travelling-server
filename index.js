const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("Habib's-Travelling");

        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");
        const hotelCollection = database.collection("hotels");
        // console.log('database connected')


        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });
        app.post('/hotels', async (req, res) => {
            const hotel = req.body;

            const result = await hotelCollection.insertOne(hotel);
            // console.log(result);
            res.json(result)
        });
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });
        // Post order to the database
        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await orderCollection.insertOne(order);
            // console.log(result);
            res.json(result)
        });
        // get an Order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        });
        // Delete an Order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const status = await orderCollection.findOne(query);
            res.json(status);
        });
        // update data into order collection
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('updating', id)
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status


                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)


        });


    }
    finally {
        // await client.close()
    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Travelling Website Running")
})

app.listen(port, () => {
    console.log('Running Travelling Server:', port)
})