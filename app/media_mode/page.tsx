import {MediaInterface} from './media_interface'
import { connectToDatabase } from "../../lib/mongoclient_connect.js"


export default async function page(){
  const mongo_client = await connectToDatabase();
      
    const database = await mongo_client.db("SongLibrary");
    const base_song_library = await database.collection("Base").find().toArray();

    const set_db =  mongo_client.db("SongSets");
    const base_sets = await set_db.collection("Base").find().toArray();

    const DATABASE = JSON.parse(JSON.stringify(base_song_library));
    const SET_DB = JSON.parse(JSON.stringify(base_sets));


    console.log('Database Retrieved');
    console.log('Sets Retrieved');


    return(
      <MediaInterface database={DATABASE} set_db={SET_DB}/>
    )
}
