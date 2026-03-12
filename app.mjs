import express from 'express'
import { MongoClient , ServerApiVersion} from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const uri ="mongodb+srv://garfield:lasagna@cluster0.taug6.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
serverApi: {
version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
}
});

async function run() {
try {
// Connect the client to the server	(optional starting in v4.7)
await client.connect();
// Send a ping to confirm a successful connection
await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
// Ensures that the client will close when you finish/error
await client.close();
}
}
//app instantiations
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'exam.html'));
})

app.post('/api/get-name', async (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ error: 'missing name' });
    }

    const db = client.db('cis486');
    const collection = db.collection('exam');

    const result = await collection.findOne({ name: userName });

    if (!result) {
      return res.status(404).json({ error: 'Name not found' });
    }

    res.json({ 
      message: 'Name found', 
      name: result.name,
      emoji: result.emoji 
    });
  }
  catch (error) {
    console.error('Error retrieving name:', error);
    res.status(500).json({ error: 'Failed to retrieve name' });
  }

})
 

/* 
👇🏻no modifications needed for this endpoint, but you do have to figure out where, when, & how to call it at least once!
*/
app.get('/api/init-emoji', async (req, res) => {
  try {
    
    const db = client.db('cis486');
    const collection = db.collection('exam');
    
    // Check if name already exists
    const existingEntry = await collection.findOne({ name: yourNameAndEmoji.name });
    
    if (existingEntry) {
      return res.json({ 
        message: 'Name already exists', 
        data: existingEntry 
      });
    }
    
    // Only insert if name doesn't exist
    const result = await collection.insertOne(yourNameAndEmoji);
    res.json({ message: 'name & emoji recorded', id: result.insertedId });
  }
  catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: 'Failed to retrieve emoji' });
  }
})


const yourNameAndEmoji = { name: 'barry', emoji: '🐸' }; //don't use my frog. 
run().catch(console.dir);



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})