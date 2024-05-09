const express = require('express')
const app = express()
const mongoose = require("mongoose");
const cors = require('cors');

const port = process.env.PORT || 5000;
require('dotenv').config()
const userRouter = require("./routes/userRoute");





// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use("/api/users", userRouter);

// Handle OPTIONS requests for the register route
app.options('/api/users/register', cors());

//barhoumiitakwa
//6Ixq1ox1Z7jYT9M5


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { send } = require('emailjs-com');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@internship-portal-demo.sgg5k0r.mongodb.net/
?retryWrites=true&w=majority&appName=internship-portal-demo`;
const PORT = process.env.PORT || 5000;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create db
    const db = client.db("mernInternshipPortal");
    const internshipCollections = db.collection("demoInternships");

    //post an internship

    app.post("/create-internship", async (req,res) => {
        const body =req.body;
        body.createAT =new Date();
        //console.log(body);
        const result = await internshipCollections.insertOne(body);
        if (result.insertedId) {

          return res.status(200).send(result);
        } else {
          return res.status(404).send({
            message: "cannot insert try again",
            status: false
          });
        }
        
    })

    //get all internships
    app.get("/all-internships" , async(req, res) => {
        const internships = await internshipCollections.find({}).toArray()
        res.send(internships); 

    })

    //get single internship using id 
    app.get("/all-internships/:id", async(req, res) => {
      const id = req.params.id; 
      const internship = await internshipCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(internship)
    })

    //get internships by email
    app.get("/my-internships/:email" , async(req, res) => {
      //console.log (req.params.email)
      const internships = await internshipCollections.find({postedBy : req.params.email}).toArray();
      res.send(internships)

    })

    //delete internship
    
    app.delete("/internship/:id" , async(req, res)=> {
      const id = req.params.id;
      const filter= {_id: new ObjectId(id) }
      const result = await internshipCollections.deleteOne(filter);
      res.send(result)

    } )

    //Update internship
    app.patch("/update-internship/:id", async(req, res) => {
      const id = req.params.id; 
      const internshipData = req.body;
      const filter = {_id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...internshipData
        },
      };

      const result = await internshipCollections.updateOne(filter, updateDoc, options);
      res.send(result)


    } )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello taki this is your first server!')
})

