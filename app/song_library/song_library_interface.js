'use client'
import React, {useState, useEffect} from 'react';
import {SongLibraryTable} from '../components/song_library_search.js';
import {EditSong} from '../components/edit_song.js';
import {AddSong} from '../components/add_song.js';
import {SongDisplay} from '../components/song_display.js';
import {SheetDashboard} from '../components/sheet_dashboard.js';
import {SongContext} from '../song_context.js';
import { TextButton } from '../components/text_button.js';
import { useUser } from "@clerk/nextjs";

export function SongLibraryInterface(props){

  const [database, update_database] = useState(props.initialDatabase);
  const [current_song, update_current_song] = useState(); //eventually move up to top level
  const [edit_or_add, update_edit_or_add] = useState();

  const {user} = useUser();
  const can_edit = props.edit_list.includes(user?.id);
  if (can_edit) {
    console.log("User has edit privileges")
  }

  function switchAddSong() {
      update_edit_or_add("add");
  }

  var edit_song_interface, sidebar_width;

  if (edit_or_add == "edit") {
    edit_song_interface = <EditSong/>
    sidebar_width = "w-1/2";

  } else if (edit_or_add== "add") {
    edit_song_interface = <AddSong/>
    sidebar_width = "w-1/2";


  } else {
    edit_song_interface = <div className="w-0"></div>
    sidebar_width = "w-full";
  }

  return (
  <SongContext.Provider value={{database, update_database, current_song, update_current_song, edit_or_add, update_edit_or_add, can_edit}}>
  <div id="wrapper" className="box-border flex flex-row mx-auto w-11/12 relative">
    <div id="side_bar" className={`box-border mr-0 p-0.6 ${sidebar_width} transition-all`}>
        <SongLibraryTable database = {database} />
        <TextButton handler={switchAddSong} button_text={"Add Song"} add_classes={"py-2"}/>
    </div>
    {edit_song_interface}
  </div>
  </SongContext.Provider>
  )
} 





  /*
  function addSongToSet(event) {
    //React state objects should be considered immutable.
    // Mutating the array won't cause the state change to be noticed for re-render
    let song_id = event.target.getAttribute("data-id");
    update_set_list([...set_list, song_id]);
  }

  function deleteSongFromSet(event) {
    var index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.children, event.target.parentNode);
    set_list.splice(index, 1);
    const new_set_list = [...set_list];
    update_set_list(new_set_list);
  }
  */


  /*
  function selectSongToDisplay(event) {
    var local_song = props.database.find(song => song.id == event.target.getAttribute("data-id"));

    if (local_song !== undefined) {
      update_current_song(local_song);
      update_current_key(readKey(local_song.sheet));
    }
  }
  */