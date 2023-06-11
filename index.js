const express = require('express');
const cors=require('cors')
 const app =express()
 
 require('dotenv').config()

 
const port = process.env.PORT || 5100;

// middleware
app.use(cors());
app.use(express.json());



// mongoDb integration
 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_MONGODB}:${process.env.USER_PASS}@cluster0.xcj5skh.mongodb.net/?retryWrites=true&w=majority`;
 

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   
    const AllClassCollection = client.db("Mindful_blissdb").collection("classAll");
    const AllPurchaseCollection = client.db("Mindful_blissdb").collection("purchase");

// class purchase collection

app.get('/purchase',async(req,res)=>{
    const email=req.query.email;
    if(!email){
        res.send([]);
    }
    const query ={email:email};
    const result = await AllPurchaseCollection.find(query).toArray();
    res.send(result)
})


app.post('/purchase', async(req,res)=>{
    const newItem = req.body;
    console.log(newItem)
    const result =await AllPurchaseCollection.insertOne(newItem)
    res.send(result)
  })

  
  app.delete("/purchase/:id",async (req,res)=>{
    const id = req.params.id;
    const query ={ _id:new ObjectId(id)};
    const result =await cartCollection.deleteOne(query)
    res.send(result)
  })


//   all classes here
    app.post('/allClasses', async(req,res)=>{
        const newItem = req.body;
        const result =await AllClassCollection.insertOne(newItem)
        res.send(result)
      })

      app.get('/allClasses',async(req,res) =>{
        const result = await AllClassCollection.find().toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

 



app.get('/',(req,res)=>{
    res.send("server is running")
   })
   app.listen(port,()=>{
       console.log(`server is sitting on port ${port}`)
   })