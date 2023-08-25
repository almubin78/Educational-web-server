//Educational website server
// almubin78
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


const uri = 'mongodb://localhost:27017';

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
        const directorCollection = client.db('Educational-Website').collection('AdminVai');
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
        app.get('/director',async(req,res)=>{
            const query = {}
            const result = await directorCollection.find(query).toArray();
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

        // this is only test sections not related with this project... 

        // [see in Test.js]
        app.post('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
              $set: {
                role: 'admin'
              },
            };
      
            const result = await studentCollection.updateOne(filter, updateDoc);
            res.send(result);
      
          })

    }
    finally {

    }
}
run().catch(err => err)


app.get('/', (req, res) => {
    res.send('HomePage(compass) of server')
});

app.listen(port, () => {
    console.log('From compass', 'port:', port)
});