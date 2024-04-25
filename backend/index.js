import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";
import * as Minio from "minio";
import bodyParser from "body-parser";

const uri = process.env.MONGODB_CONNECTION;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const app = express();
app.use(express.json());
const port = 3000;

app.post("/personalMessages", async (req, res) => {
  try {
    const idToSearch = req.body.userIdEndPoint;
    const searchResult = await client
      .db("whatsleft")
      .collection("conversations")
      .find({ users: { $in: idToSearch } })
      .toArray();
    if (searchResult && searchResult.length > 0) {
      const userIdConvo = searchResult.map((item) => item.users).flat();
      const findingUsersConvo = await client
        .db("whatsleft")
        .collection("users")
        .find({ clerkId: { $in: userIdConvo } })
        .toArray();
      res.json(findingUsersConvo);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const searchResult = await client
      .db("whatsleft")
      .collection("users")
      .find()
      .toArray();
    res.json(searchResult);
  } catch (err) {
    console.error("Error searching for users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await client
      .db("whatsleft")
      .collection("users")
      .findOne({ clerkId });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/createConvo", async (req, res) => {
  try {
    const users = req.body.users;
    const id = req.body.id;
    const existingUser = await client
      .db("whatsleft")
      .collection("conversations")
      .findOne({ users: { $all: users } });
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ success: "new convo created" });
      await createConvo(client, { users, id });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function createConvo(client, newConvo) {
  const result = await client
    .db("whatsleft")
    .collection("conversations")
    .insertOne(newConvo);
  console.log(`New convo created with the following id: ${result.insertedId}`);
}

app.post("/user", async (req, res) => {
  await createUser(client, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    clerkId: req.body.clerkId,
  });
  res.send({ success: "new user created" });
});

app.post(
  "/upload",
  bodyParser.raw({ type: ["image/jpeg", "image/png"], limit: "5mb" }),
  async (req, res) => {
    console.log(req.body);

    const bucket = "whatsleft";
    const exists = await minioClient.bucketExists(bucket);
    if (exists) {
      console.log("Bucket " + bucket + " exists.");
    } else {
      await minioClient.makeBucket(bucket);
      console.log("Bucket " + bucket + " created.");
    }

    var metaData = {
      "Content-Type": req.get("content-type"),
    };

    const sourceFile = req.body;
    const randomName = Math.random().toString(36).substring(7);
    if (req.get("content-type") === "image/jpeg") {
      var destinationObject = randomName + ".jpg";
    }
    if (req.get("content-type") === "image/png") {
      var destinationObject = randomName + ".png";
    }
    if (req.get("content-type") === "image/jpeg") {
      var destinationObject = randomName + ".jpeg";
    }

    await minioClient.putObject(
      bucket,
      destinationObject,
      sourceFile,
      metaData
    );
    console.log(
      "File " +
      " uploaded as object " +
      destinationObject +
      " in bucket " +
      bucket
    );

    const imageURL = `${process.env.MINIO_ENDPOINT}/${bucket}/${destinationObject}`;
    res.send({ imageURL: imageURL });
  }
);

async function createUser(client, newUser) {
  const result = await client
    .db("whatsleft")
    .collection("users")
    .insertOne(newUser);
  console.log(`New user created with the following id: ${result.insertedId}`);
}

app.listen(port, async () => {
  try {
    await client.connect();
    await client.db("whatsleft").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log("MongoDB Error:", err);
  }
  console.log(`Example app listening on port ${port}`);
});
