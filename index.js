const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afytx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
    res.send('Working successfully')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const tasksCollection = client.db("volunteerNetwork").collection("tasks");

    console.log("database connected")
    app.post('/addTask', (req, res) => {
        const tasks = req.body;
        tasksCollection.insertOne(tasks)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/viewTask', (req, res) => {
        console.log(req.query.email)
        tasksCollection.find({ email: req.query.email })
            .toArray((err, documents) => {

                res.send(documents);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        tasksCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    })


});

app.listen(process.env, PORT || port)