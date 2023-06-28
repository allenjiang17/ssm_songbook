import {SongLibraryInterface} from './song_library_interface'
import { MongoClient } from 'mongodb';
import { connectToDatabase } from "../../lib/mongoclient_connect.js"
import { clerkClient } from '@clerk/nextjs';


const org_id = 'org_2Rad0nVelwDB2AeD5iuK1LKt5cK' //admin organization that can edit the database


export default async function page(){

  const mongo_client = await connectToDatabase();
      
    const database = await mongo_client.db("SongLibrary");
    const base_song_library = await database.collection("Base").find().toArray();

    const init_db = JSON.parse(JSON.stringify(base_song_library));
  
    console.log('Database Retrieved');

    //get list of users that can edit
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({organizationId: org_id});
    const member_list = memberships.map(member => member.publicUserData?.userId);
    console.log("Members with edit privileges received");

    return(
      <SongLibraryInterface initialDatabase={init_db} edit_list={member_list}/>
    )

  
}

/*old fetch method
      //can rewrite using getServerSideProps instead
      var response = await fetch('./api/get_mongo_db',{cache: "no-cache"});
      var init_db = await response.json();
*/
