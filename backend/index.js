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

app.post('/personalMessages', async (req, res) => {
  try {
    const idToSearch = req.body.userId;
    const searchResult = await client.db("whatsleft").collection("conversations")
      .find({ users: { $in: idToSearch } }).toArray();
    if (searchResult) {
      // const findingUsersConvo = await client.db("whatsleft").collection("users")
      //   .find({ clerkId: { $in: userIdConvo } }).toArray();
      // console.log("finding convosinio", findingUsersConvo)
      res.json(searchResult);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const searchResult = await client.db("whatsleft").collection("users").find().toArray();
    res.json(searchResult);
  } catch (err) {
    console.error("Error searching for users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await client.db("whatsleft").collection("users").findOne({ clerkId });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createConvo', async (req, res) => {
  try {
    const users = req.body.users;
    const id = req.body.id;
    const existingUser = await client.db("whatsleft").collection("conversations").findOne({ users: { $all: users } });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ success: "new convo created" });
      await createConvo(client, { users, id });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function createConvo(client, newConvo) {
  const result = await client.db("whatsleft").collection("conversations").insertOne(newConvo);
  console.log(`New convo created with the following id: ${result.insertedId}`);
}

app.post('/user', async (req, res) => {
  await createUser(client, {
    firstName: req.body.firstName, lastName: req.body.lastName,
    clerkId: req.body.clerkId
  })
  res.send({ success: "new user created" })
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
  } catch (err) {
    console.log("MongoDB Error:", err)
  }
  console.log(`Example app listening on port ${port}`)
})
