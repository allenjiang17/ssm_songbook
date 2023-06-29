'use client'
import React, {useState} from 'react';
import {Search} from '../components/search.js';
import {DraggableList} from '../components/set_list.js';
import {SongContext} from '../song_context.js';
import {MediaLyricsInterface} from '../components/media_lyrics_interface.js'
import { TextButton } from '../components/text_button.js';
import Popup from 'reactjs-popup';
import {ImportSetTable} from '../components/import_set_table.js'


export function MediaInterface(props){
  let init_song = {id:'', title:'', author:'', sheet:'', lyrics:''}; 

  const [set_list, update_set_list] = useState([]); 
  const [current_set_song, update_current_set_song] = useState();
  const [current_song, update_current_song] = useState(init_song); //eventually move up to top level
  const [popup_open, set_popup_open] = useState(false);
  const closePopup = () => set_popup_open(false);

  async function importSet() {
    set_popup_open(o=>!o);
  }

  return (
  <SongContext.Provider value={{set_list, update_set_list, current_song, update_current_song, current_set_song, update_current_set_song}}>
  <div id="wrapper" className="box-border flex flex-row mx-auto w-11/12 relative">
    <div id="side_bar" className="box-border min-w-max m-0 p-0.6 w-1/5">

        <p id="set_list_label" className = "mb-2 text-base font-semibold">Set List</p>
        <DraggableList database = {props.database} 
          set_list={set_list} />
        
        <div className="mb-2">
          <TextButton handler={importSet} button_text={"Import Set"}/>
        </div>

      <p id="set_list_label" className = "mb-2 text-base font-semibold">Add Songs</p>
        <Search database = {props.database} dashboard_display = {"hidden"} hide_with_no_input = {true} />

    </div>
    <MediaLyricsInterface current_song={current_song} edit_list = {props.edit_list}/>
    <Popup open={popup_open} onClose={closePopup}>
        <div className="box-border bg-gray-100 w-96 rounded-md p-5 drop-shadow-lg dark:bg-gray-700">
              <div className="flex justify-between">
                <p className = "inline-block mb-2 text-lg font-semibold">Import Set</p>
                <img src= "./x-lg.svg" className="inline-block ml-1 h-fit hover:bg-gray-300" onClick={closePopup}/>
              </div>
              <ImportSetTable import_sets={props.set_db}/>
        </div>
    </Popup>
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