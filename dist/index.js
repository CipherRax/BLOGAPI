import fastify from "fastify";
import { MongoClient } from "mongodb";
const route = fastify();
//mongodb code
try {
    const url = "mongodb+srv://purpleisrednotgreen_db_user:1Pt44m0MbflPHojK@june.f1j3bvk.mongodb.net/?appName=June";
    console.log(`MongoDB connection started at this url: ${url}`);
    const client = await MongoClient.connect(url);
    const database = client.db("Blog");
    console.log(`Connected to database: ${database}`);
}
catch (error) {
    console.log(error);
}
//type interface
// interface Post {
//     id: string;
//     title: string;
//     body: string;
// }
// //Create a post
// route.post("/create-post", async (req, res) => {
//     const { title, body } = req.body;
//     // const post: Post = {}
// })
//
//
// //Get all posts
// route.put("/", async (req, res) => {
//     const mk: string = ''
//     res.send(mk)
// })
//
// //Get a post by id
// route.delete("/:id", async (req, res) => {
//     const { id } = req.params;
//     return id
//
//     // const post: Post = {}
// })
//
//
// //Update a post
// route.put("/:id", async (req, res) => {
//     const { id } = req.params;
//     return id
//     // const post: Post = {}
// })
//
// //delete a post
// route.delete("/:id", async (req, res) => {
//     const { id } = req.params;
//     // const post: Post = {}
// })
route.listen({ port: 3003 }, function (err, address) {
    if (err) {
        route.log.error(err.message);
    }
    console.log(`Listening on ${address}`);
});
