const express = require('express');
const app = express();
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ib8fgeo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


  const profileCollection = client.db("Connectify").collection("Profile");
  const postCollection = client.db("Connectify").collection("post");

  
  app.get('/users',  async (req, res) => {
    const result = await profileCollection.find().toArray();
    res.send(result);
  });

  // profile api
  app.post('/profile', async (req, res) => {
    const NewProfile = req.body;
    const result = await profileCollection.insertOne(NewProfile);
    res.send(result);
  })

  app.get('/profile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email };
        const result = await profileCollection.findOne(query);

        if (!result) {
            throw new Error("User not found");
        }
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


// Ban profile API
app.put('/profile/ban/:id', async (req, res) => {
  try {
    const profileId = req.params.id;

    // Check if the profile exists
    const profileQuery = { _id: new ObjectId(profileId) }; // Create ObjectId instance using new
    const profile = await profileCollection.findOne(profileQuery);
    if (!profile) {
      throw new Error("Profile not found");
    }

    // Update the profile document to set Ban field to true
    const updateResult = await profileCollection.updateOne(
      { _id: new ObjectId(profileId) }, // Create ObjectId instance using new
      { $set: { Ban: true } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to ban profile");
    }

    res.status(200).json({ message: "Profile banned successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


    // post api
    app.get('/post',  async (req, res) => {
      const result = await postCollection.find().toArray();
      res.send(result);
    });

    app.get('/post/:email', async (req, res) => {
      try {
          const email = req.params.email;
          const query = { email: email };
          const result = await postCollection.find(query).toArray();
  
          if (!result) {
              throw new Error("User not found");
          }
          res.json(result);
      } catch (error) {
          res.status(404).json({ error: error.message });
      }
  });

    app.post('/post', async (req, res) => {
      const NewPost = req.body;
      const result = await postCollection.insertOne(NewPost);
      res.send(result);
    })

    app.get('/post/:email', async (req, res) => {
      try {
          const email = req.params.email;
          const query = { email: email };
          const result = await postCollection.findOne(query);
  
          if (!result) {
              throw new Error("User not found");
          }
          res.json(result);
      } catch (error) {
          res.status(404).json({ error: error.message });
      }
  });

  app.delete('/post/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await postCollection.deleteOne(query);
    res.send(result);
  });

  // Like api
app.put('/post/like/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const  newLiker  = req.body.email;

    // Check if the post exists
    const postQuery = { _id: new ObjectId(postId) }; // Create ObjectId instance using new
    const post = await postCollection.findOne(postQuery);
    if (!post) {
      throw new Error("Post not found");
    }

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) }, // Create ObjectId instance using new
      { $push: { Liker: newLiker } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to add like");
    }

    res.status(201).json({ message: "Like added successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


// comment api
app.put('/post/comment/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const  newComment  = req.body;

    // Check if the post exists
    const postQuery = { _id: new ObjectId(postId) }; // Create ObjectId instance using new
    const post = await postCollection.findOne(postQuery);
    if (!post) {
      throw new Error("Post not found");
    }

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) }, // Create ObjectId instance using new
      { $push: { comment: newComment } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to add comment");
    }

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Report api
app.put('/post/report/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const  newReport  = req.body;

    // Check if the post exists
    const postQuery = { _id: new ObjectId(postId) }; // Create ObjectId instance using new
    const post = await postCollection.findOne(postQuery);
    if (!post) {
      throw new Error("Post not found");
    }

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(postId) }, // Create ObjectId instance using new
      { $push: { report: newReport } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to add report");
    }

    res.status(201).json({ message: "report added successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});



 



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Connectify is active')
  })
  
app.listen(port, () => {
    console.log(`Connectify is running on port ${port}`);
  })
  