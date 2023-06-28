import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"

export default async function handler(request, response) {
  
  const mongo_client = await connectToDatabase();

    try {
      const new_set = request.body;

      const database =  mongo_client.db("SongSets");
      const base_song_library = database.collection("Base")

      if (await base_song_library.findOne({set_name: new_set.name}) != null) {
         console.log("Set Name Exists already");
        return response.status(400).json({message: "Set Name Exists already"})
      }

      var result = await base_song_library.insertOne(new_set);
      console.log(result);
      return response.status(200).json({ message: result });

    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }

}