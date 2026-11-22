import express from 'express';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'node:url';

const app = express();

const DB_USER = process.env.MONGO_DB_USERNAME;
const DB_PASS = process.env.MONGO_DB_PWD;

const mongoUrl = `mongodb://${DB_USER}:${DB_PASS}@mongodb:27017/?authSource=admin`;

const client = new MongoClient(mongoUrl);

const databaseName = 'my-db';
const collectionName = 'my-collection';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.sendFile(fileURLToPath(new URL('./index.html', import.meta.url)));
});

// Fetch data from MongoDB
app.get('/fetch-data', async (req, res) => {
  try {
    const db = client.db(databaseName);

    const result = await db
      .collection(collectionName)
      .findOne({ myid: 1 });

    res.json(result ?? {});
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Connect to MongoDB and start server
try {
  await client.connect();

  app.listen(3000, '0.0.0.0', () => {
    console.log('App listening on port 3000!');
  });
} catch (error) {
  console.error('MongoDB connection failed:', error);
  process.exit(1);
}