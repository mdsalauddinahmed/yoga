const express = require('express');
const cors=require('cors')
 const app =express()
 const jwt = require('jsonwebtoken');
 require('dotenv').config()

 const  stripe =require("stripe")('process.env.PAYMENT_KEY')
const port = process.env.PORT || 5100;

// middleware
app.use(cors());
app.use(express.json());

// verify token

const verifyJwt =(req,res,next)=>{
  const authorization = req.headers.authorization;
  if(!authorization){
    return res.status(401).send({error:true,message :'unauthorized'});
  }

  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.PAYMENT_KEY,(err,decoded)=>{
    if(err){
      return res.status(401).send({error:true,message:'unauthorized access'})
    }
    req.decoded =decoded;
    next()
  })



}

  // 

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
    const AllUserCollection = client.db("Mindful_blissdb").collection("users");
    const AllInstructorCollection = client.db("Mindful_blissdb").collection("instructor");

// 
app.post('/jwt',(req,res)=>{
  const user= req.body;
  const token =jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:'1h'
  })
  res.send({token})
})



// instructors
app.get('/allInstructors',async(req,res) =>{
    const result = await AllInstructorCollection.find().toArray();
    res.send(result);
     
})



//  users

app.get('/users', async (req, res) => {
    const result = await AllUserCollection.find().toArray();
    res.send(result);
    
  });

app.post("/users",async(req,res)=>{
    const user = req.body;
   
    const query = {email:user.email}
    const existingUser = await AllUserCollection.findOne(query);
      console.log('exit',existingUser)
    if(existingUser){
      return res.send({message:"user already exists"})
    }
    const result = await AllUserCollection.insertOne(user)
    res.send(result)
  })

// 
app.patch('/users/admin/:id',async(req,res)=>{
    const id = req.params.id;
    const filter ={_id:new ObjectId(id)};
    const updateDoc = {
      $set:{
        role: 'admin'
      }
    };
    const result = await AllUserCollection.updateOne(filter,updateDoc)
    res.send(result)
  })
app.patch('/users/instructor/:id',async(req,res)=>{
    const id = req.params.id;
    const filter ={_id:new ObjectId(id)};
    const updateDoc = {
      $set:{
        role: 'instructor'
      }
    };
    const result = await AllUserCollection.updateOne(filter,updateDoc)
    res.send(result)
  })



// class purchase collection

app.get('/purchase',verifyJwt,async(req,res)=>{
    const email=req.query.email;
    if(!email){
        res.send([]);
    }
    const decodedEmail = req.decoded.email;
    if(email !== decodedEmail){
      return res.status(403).send({error:true,message:' forbidden  access'})
    }

    const query ={email:email};
    const result = await AllPurchaseCollection.find(query).toArray();
    res.send(result)
})


app.post('/purchase', async(req,res)=>{
    const newItem = req.body;
    
    const result =await AllPurchaseCollection.insertOne(newItem)
    res.send(result)
  })

  
  app.delete("/purchase/:id",async (req,res)=>{
    const id = req.params.id;
    const query ={ _id:new ObjectId(id)};
    const result =await AllPurchaseCollection.deleteOne(query)
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
    app.delete("/allClasses/:id",async (req,res)=>{
        const id = req.params.id;
        const query ={ _id:new ObjectId(id)};
        const result =await AllClassCollection.deleteOne(query)
        res.send(result)
      })


      // create payment intent
      app.post('/create-payment-intent',async(req,res)=>{
        const {Price}=req.body;
        const amount =Price*100;
        const paymentIntent = await stripe.paymentIntent.create({
          amount :amount,
          currency:'usd',
          payment_method_types:['card']
        });
        res.send({
          clientSecret: paymentIntent.client_secret
        })
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