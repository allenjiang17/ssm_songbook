import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"

export default async function handler(request, response) {
  
  const mongo_client = await connectToDatabase();

    try {
      const new_song = request.body;
      console.log(new_song);

      const database = mongo_client.db("SongLibrary");
      const base_song_library = database.collection("Base")

      var result = await base_song_library.deleteOne({id: new_song.id});
      console.log(result);

      return response.status(200).json({ message: result });

    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }

}