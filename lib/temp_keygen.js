import { MongoClient } from "mongodb";
import {transpose, readKey} from '../app/components/transposer.js';

const mongo_client = await connectToDatabase();
console.log("connected");

const database =  mongo_client.db("SongLibrary");
const base_db = database.collection("Base");
const base_song_library = await base_db.find().toArray();
console.log(base_song_library);

/*Directly manipulate the MongoDB by running this script with Node.js
Manipulations here:*/

for (let i=0; i<base_song_library.length; i++) {

    let new_song = JSON.parse(JSON.stringify(base_song_library[i]));
    var result = await base_db.updateOne(
        {id: new_song.id},
        { $set: {title: new_song.title, author: new_song.author, sheet: new_song.sheet, lyrics: new_song.lyrics, key: readKey(new_song.sheet) } }
      );

    console.log(result);

}
/***** */

async function connectToDatabase() {

const uri = "mongodb+srv://vercel-admin-user:An6qBDzyJ@cluster0.hkfmgmn.mongodb.net/?retryWrites=true&w=majority";
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

//global mongoClient
let mongoClient = null;
    try {
      console.log("creating new MongoClient")
      mongoClient = await (new MongoClient(uri, options)).connect();
        
        return mongoClient
    } catch (e) {
        console.error(e);
    }
}


