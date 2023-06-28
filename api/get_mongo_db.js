import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"


export default async function handler(request, response) {
    const mongo_client = await connectToDatabase();
    
    try {
      const database = await mongo_client.db("SongLibrary");
      const base_song_library = await database.collection("Base").find().toArray();

      console.log('Database Retrieved');
      return response.status(200).json(base_song_library);

    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }

}