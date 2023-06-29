import {MediaInterface} from './media_interface'
import { connectToDatabase } from "../../lib/mongoclient_connect.js"
import { clerkClient } from '@clerk/nextjs';

const org_id = 'org_2Rad0nVelwDB2AeD5iuK1LKt5cK' //admin organization that can edit the database

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

    //get list of users that can edit
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({organizationId: org_id});
    const member_list = memberships.map(member => member.publicUserData?.userId);
    console.log("Members with edit privileges received");


    return(
      <MediaInterface database={DATABASE} set_db={SET_DB} edit_list = {member_list}/>
    )
}
