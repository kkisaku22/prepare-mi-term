import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Use your own MongoDB URI, stored in .env for production
const uri = "mongodb+srv://garfield:lasagna@cluster0.taug6.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB once at startup
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
connectDB().catch(console.dir);

// Serve static HTML
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'exam.html'));
});


app.post('/api/get-name', async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName) return res.status(400).json({ error: 'missing name' });

    const db = client.db('cis486');
    const collection = db.collection('exam');
    const result = await collection.findOne({ name: userName });

    if (!result) return res.status(404).json({ error: 'Name not found' });

    res.json({ message: 'Name found', name: result.name, emoji: result.emoji });
  } catch (error) {
    console.error('Error retrieving name:', error);
    res.status(500).json({ error: 'Failed to retrieve name' });
  }
});


const yourNameAndEmoji = { name: 'barry', emoji: '🐸' }; // replace with your own
app.get('/api/init-emoji', async (req, res) => {
  try {
    const db = client.db('cis486');
    const collection = db.collection('exam');

    const existingEntry = await collection.findOne({ name: yourNameAndEmoji.name });
    if (existingEntry) return res.json({ message: 'Name already exists', data: existingEntry });

    const result = await collection.insertOne(yourNameAndEmoji);
    res.json({ message: 'name & emoji recorded', id: result.insertedId });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: 'Failed to retrieve emoji' });
  }
});



const itemsCollection = client.db('cis486').collection('items');

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await itemsCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST a new item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = req.body;
    const result = await itemsCollection.insertOne(newItem);
    res.json({ message: 'Item added', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    await itemsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updated });
    res.json({ message: 'Item updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await itemsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});