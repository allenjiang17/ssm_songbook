import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}

//global mongoClient
let mongoClient = null;

export async function connectToDatabase() {
    try {
        if (mongoClient) {
            console.log("mongoClient already exists, using existing connection")
            return mongoClient;
        }
        if (process.env.NODE_ENV === "development") {
            if (!global._mongoClient) {
                console.log("creating new MongoClient")

                mongoClient = await (new MongoClient(uri, options)).connect();
                global._mongoClient = mongoClient;
            } else {
                mongoClient = global._mongoClient;
            }
        } else {
            console.log("creating new MongoClient")

            mongoClient = await (new MongoClient(uri, options)).connect();
        }
        return mongoClient
    } catch (e) {
        console.error(e);
    }
}
