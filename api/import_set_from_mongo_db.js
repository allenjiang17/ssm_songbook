import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"

export default async function handler(request, response) {
  
  const mongo_client = await connectToDatabase();

    try {
      const database =  mongo_client.db("SongSets");
      const base_sets = await database.collection("Base").find().toArray();

      console.log('Import Sets Retrieved');
      return response.status(200).json(base_sets);

    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }

}