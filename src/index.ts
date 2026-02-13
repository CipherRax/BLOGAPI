import fastify from "fastify";
import connectDB from "../src/config/database.js"
import { ObjectId}  from "mongodb";


const route = fastify();
//mongodb code
const db = await connectDB();
const getD = await db.collection("Blog")

//Create a post
route.post("/create-post", async (req, res) => {
    try {
        const {title, body}: any = req.body;
        getD.insertOne({title, body}).then((result) => {
            if (!result) {
                console.log(result);
            } else {
                console.log(result);
            }
        })
    } catch (error) {
        console.log(error)
    }

})


//Get all posts
route.get("/all-post", async (req, res) => {
    try {


        const all = await getD.find({}).toArray()
        res.status(200).send(all)
    } catch (error) {
        res.status(500).send("Server error")
        console.log(error)
    }
})

//Get a post by id
route.get("/find-post/:id", async (req, res) => {
    const { id }: any = req.params;
    try {
        const qr = {_id: new ObjectId(id)}
        const all = await getD.findOne(qr)
        if (!all) {
            return res.status(404).send({
                error: "Document not found"
            })
        }
        res.status(200).send(all)
    } catch (err) {
        console.log(err)
    }

})


//Update a post
route.put("/update-post/:id", async (req, res) => {
    const { id }: any = req.params;
    const { title, body }: any = req.body;
    try {
        const all = await getD.findOneAndUpdate(
        {_id: new ObjectId(id)}, { $set: { title, body } },
        )
        if (!all) {return res.status(404)}
    } catch (err) {
        console.log(err)
    }

})

//delete a post
route.delete("/delete/:id", async (req, res) => {
    const { id }: any = req.params;
    try {
        const qr = {_id: new ObjectId(id)}
      await getD.findOneAndDelete(qr)
      res.status(202).send("One document delted")
    } catch (err) {
        console.log(err)
    }
    // const post: Post = {}
})

route.listen(
    { port: 3003 },
    function (err, address: string) {
        if (err) {
            route.log.error(err.message)
        }
        console.log(`Listening on ${address}`);
    }
    )