//Educational website server
// almubin78
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@educational-website.odbyuo9.mongodb.net/?retryWrites=true&w=majority`;
/* Try to use Mongo Compass */
const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
async function run() {
    try {
        const studentCollection = client.db('Educational-Website').collection('studentCollection');
        const sscPhysicsMcqCollection= client.db('Educational-Website').collection('MCQforSSCphysics');
        
        app.get('/jwt',async(req,res)=>{
            const email = req.query.email;
            if(email){
                const token = jwt.sign({email},process.env.ACCESS_TOKEN_SECRET);
                return res.send({getFromServer:token});
            }
            res.send(email);
        })
        app.post('/student', async (req,res)=>{
            const user = req.body;
            console.log('user from POST(by axios) by req.body',user);
            const result = await studentCollection.insertOne(user);
            res.send(result);
        });

        app.get('/students',async(req,res)=>{
            const query = {}
            const result = await studentCollection.find(query).toArray();
            res.send(result);
        })
        //mcq sections
        app.post('/sscMcq', async (req,res)=>{
            const newMcq = req.body;
            console.log('newMcq from POST(by axios) by req.body',newMcq);
            const result = await sscPhysicsMcqCollection.insertOne(newMcq);
            res.send(result);
        });
        app.get('/sscMcq', async (req,res)=>{
            const newMcqQuery = {};
            const result = await sscPhysicsMcqCollection.find(newMcqQuery).toArray();
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(err => err)


app.get('/', (req, res) => {
    res.send('HomePage of server')
});

app.listen(port, () => {
    console.log('Educational Website ', 'port:', port)
});