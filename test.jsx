  const AllClassCollection = client.db("Mindful_blissdb").collection("classAll");
    const AllPurchaseCollection = client.db("Mindful_blissdb").collection("purchase");
    const AllUserCollection = client.db("Mindful_blissdb").collection("users");
    const AllInstructorCollection = client.db("Mindful_blissdb").collection("instructor");

    // const usersCollection = client.db('summerCampSchool').collection('users')

    // instructors
    app.get('/allInstructors', async (req, res) => {
      const result = await AllInstructorCollection.find().toArray();
      res.send(result);

    })

    //  users

    app.get('/users', async (req, res) => {
      const result = await AllUserCollection.find().toArray()
      res.send(result)
    });

    app.post("/users", async (req, res) => {
      const user = req.body;

      const query = { email: user.email }
      const existingUser = await AllUserCollection.findOne(query);
      console.log('exit', existingUser)
      if (existingUser) {
        return res.send({ message: "user already exists" })
      }
      const result = await AllUserCollection.insertOne(user)
      res.send(result)
    })

    //
    app.get('/users/admin/:email', async (req, res) => {

      const email = req.params.email;

      const query = { email: email }
      const user = await AllUserCollection.findOne(query)
      const result = { admin: user?.role === "admin" }
      console.log(result)
      res.send(result)
    })
    app.get('/users/instructor/:email', async (req, res) => {

      const email = req.params.email;

      const query = { email: email }
      const user = await AllUserCollection.findOne(query)
      const result = { instructor: user?.role === "instructor" }
      console.log(result)
      res.send(result)
    })


    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      };
      const result = await AllUserCollection.updateOne(filter, updateDoc)
      res.send(result)
    })



    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        }
      };
      const result = await AllUserCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // class purchase collection

    app.get('/purchase', async (req, res) => {
      const email = req.query.email;
      console.log(email)
      if (!email) {
        res.send([]);
      }


      const query = { email: email };
      const result = await AllPurchaseCollection.find(query).toArray();
      res.send(result)
    })



    app.post('/purchase', async (req, res) => {
      const newItem = req.body;

      const result = await AllPurchaseCollection.insertOne(newItem)
      res.send(result)
    })


    app.delete("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AllPurchaseCollection.deleteOne(query)
      res.send(result)
    })


    //   all classes here
    app.post('/allClasses', async (req, res) => {
      const newItem = req.body;
      const result = await AllClassCollection.insertOne(newItem)
      res.send(result)
    })

    app.get('/allClasses', async (req, res) => {
      const result = await AllClassCollection.find().toArray();
      res.send(result)
    })
    app.delete("/allClasses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AllClassCollection.deleteOne(query)
      res.send(result)
    })