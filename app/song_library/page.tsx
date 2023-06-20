import {SongLibraryInterface} from './song_library_interface'

export default async function page(){
  
    var response = await fetch('http://localhost:3000/api/get_database');
    var DATABASE = await response.json();
    console.log(DATABASE);

    return(
      <SongLibraryInterface database = {DATABASE}/>
    )

  
}
