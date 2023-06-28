import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"

export default async function handler(request, response) {
  
  const mongo_client = await connectToDatabase();

    try {
      const new_song = request.body;

      const database =  mongo_client.db("SongLibrary");
      const base_song_library = database.collection("Base")

      var result = await base_song_library.updateOne(
        {id: new_song.id },
        { $set: {title: new_song.title, author: new_song.author, sheet: new_song.sheet, lyrics: new_song.lyrics} }
      );

      console.log(result);
      return response.status(200).json({ message: result });
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }

}