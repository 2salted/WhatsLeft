import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';

async function main() {
  const uri = process.env.MONGODB_CONNECTION

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  const app = express()
  const port = 3000
  app.listen(port, async () => {
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
    console.log(`Example app listening on port ${port}`)
  })
  await createUser(client,
    {
      user: "salted",
    }
  );
  async function createUser(client, newUser) {
    const result = await client.db("whatsleft").collection("users").insertOne(newUser);
    console.log(`New user created with the following id: ${result.insertedId}`);
  }
}

main().catch(console.error);

