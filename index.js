const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

// middleware 
app.use(cors());
app.use(express.json());




// database 
// user : car-user
// password : LFMEDwSBVJn79muE

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.79qqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        // console.log("connected to database");
        const database = client.db("carMechanic");
        const services = database.collection("services");

        // get api 
        app.get("/services", async (req, res) => {
            const cursor = services.find({});
            const data = await cursor.toArray();
            res.send(data);
        })

        // get api single service 
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await services.findOne(query);
            res.send(result);
        })

        // post api 
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await services.insertOne(service);
            console.log(result);
            // res.send("successfully append");
            console.log("database hitted ", service);
            res.json(result);
        })

        // delete api 
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await services.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close(); 
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    console.log("get method");
    res.send("Server is running for genious car")
})

app.listen(port, () => {
    console.log("Server is runngin at ", port);
})