import {SongInterface} from './song_interface.js'
import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../lib/mongoclient_connect.js"
import { clerkClient } from '@clerk/nextjs';

const org_id = 'org_2Rad0nVelwDB2AeD5iuK1LKt5cK' //admin organization that can edit the database

export default async function page(){

    //get database
    const mongo_client = await connectToDatabase();
      
    const database = await mongo_client.db("SongLibrary");
    const base_song_library = await database.collection("Base").find().toArray();

    const DATABASE = JSON.parse(JSON.stringify(base_song_library));
    console.log('Database Retrieved');

    //get list of users that can edit
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({organizationId: org_id});
    const member_list = memberships.map(member => member.publicUserData?.userId);
    console.log('Members with edit privileges received');

  return(
      <SongInterface database = {DATABASE} edit_list = {member_list}/>
  )

  
}


