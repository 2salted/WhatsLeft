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
  await createListing(client,
    {
      name: "Lovely Loft",
      summary: "A charming loft in Paris",
      bedrooms: 1,
      bathrooms: 1
    }
  );
  async function createListing(client, newListing) {
    const result = await client.db("whatsleft").collection("users").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
  }
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
}

main().catch(console.error);

