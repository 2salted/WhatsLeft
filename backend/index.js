import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_CONNECTION

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const app = express()
app.use(express.json())
const port = 3000
app.post('/user', async (req, res) => {
  await createUser(client, { name: req.body.name, clerkId: req.body.clerkId })
  res.send({ success: true })
})
async function createUser(client, newUser) {
  const result = await client.db("whatsleft").collection("users").insertOne(newUser);
  console.log(`New user created with the following id: ${result.insertedId}`);
}
app.listen(port, async () => {
  try {
    await client.connect();
    await client.db("whatsleft").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
  console.log(`Example app listening on port ${port}`)
})

