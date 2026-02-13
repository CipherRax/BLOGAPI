import { MongoClient, Db } from "mongodb";

let dbInstnance: Db

// @ts-ignore
async function connectDB (): Promise<Db>  {

    //if allready connected return the exixting instance
    if (dbInstnance) {return dbInstnance}

    try {


        const url = "mongodb+srv://purpleisrednotgreen_db_user:1Pt44m0MbflPHojK@june.f1j3bvk.mongodb.net/?appName=June";
        console.log(`MongoDB connection started at this url: ${url}`);
        const client = new MongoClient(url)
        await client.connect();
        dbInstnance = client.db("Blog");

        return dbInstnance;

    } catch (error) {
        console.log(error);
    }

}

export default connectDB;