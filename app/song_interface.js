'use client'
import React, {useState, useEffect} from 'react';
import {Search} from './components/search.js';
import {DraggableList} from './components/set_list.js';
import {SongDisplay} from './components/song_display.js';
import {ChordDashboard} from './components/chord_dashboard.js';
import {SongContext} from './song_context.js';
import {ExportInterface} from './components/export.js';

export function SongInterface(props){

  let init_set_list = [];
  if (localStorage.getItem("SetList")) {
    init_set_list = JSON.parse(localStorage.getItem("SetList"));
  }

  const [set_list, update_set_list] = useState(init_set_list); 
  const [current_set_song, update_current_set_song] = useState();
  const [current_song, update_current_song] = useState(); //eventually move up to top level
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [font_size, update_font_size] = useState(6);
  const [line_height, update_line_height] = useState(9);

  const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
  };
  
  useEffect(()=>{
    localStorage.setItem("SetList", JSON.stringify(set_list));
   
  }, [set_list]);

  return (
  <SongContext.Provider value={{set_list, update_set_list, current_song, update_current_song, current_set_song, update_current_set_song, font_size, update_font_size, line_height, update_line_height}}>
  <div id="wrapper" className="box-border flex flex-row mx-auto w-11/12 relative">
    <div id="side_bar" className={`box-border min-w-max m-0 p-0.6  ${sidebarVisible ? 'w-1/5' : 'hidden'}`}>
        <Search database = {props.database} dashboard_display = {"block"} hide_with_no_input = {false} />
        <p id="set_list_label" className = "mb-2 text-base font-semibold">Set List</p>
        <DraggableList database = {props.database} 
          set_list={set_list} />
        <ExportInterface edit_list = {props.edit_list}/>
    </div>
    <div className="relative flex-grow">
      <button onClick={toggleSidebar} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-ssmblue py-2 rounded-md shadow-md z-10">
        {sidebarVisible ? (
            <img src="/side-collapse.svg" alt="Hide Sidebar" className="w-6 h-6" />
        ) : (
            <img src="/side-expand.svg" alt="Show Sidebar" className="w-6 h-6" />
        )}
      </button>
    <div id="chord_display" className={`box-border min-w-max ml-3 ${sidebarVisible ? '' : 'w-full'}`}>
      <ChordDashboard song = {current_song}/>
      <SongDisplay song = {current_song} window_height={"h-[calc(100vh-120px)]"}/>
    </div>
    </div>
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