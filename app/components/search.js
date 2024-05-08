'use client'
import React, {useState} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';

//Components
export function Search(props){
    const [search_text, set_search_text] = useState("");
    const [search_filter, set_search_filter] = useState("Any");

    function handleInput(event) {
      set_search_text(event.target.value);
    }

    function handleFilterInput(event) {
      set_search_filter(event.target.value);
    }
  
    var database = props.database;

    //get possible tempos
    //const list_of_tempos = [...new Set(database.map(song => song.tempo))];
    const list_of_tempos = ["Fast", "Medium", "Slow"];
    
    //filter tempos
    if (search_filter != "Any") {
      database = database.filter(song => song.tempo.toUpperCase().indexOf(search_filter.toUpperCase()) != -1)
    }

    //search function
    let input = search_text.toUpperCase();
    let showList;
    
    if (search_text.length == 0 && props.hide_with_no_input) {
      showList = [];
    } else {
      showList = database.filter(song => song.title.toUpperCase().indexOf(input) == 0);
    }

    return (
      <div className="mb-2">
        <div className="bg-gray-100 mb-1 overflow-auto border border-gray-300 max-h-64 transition-all duration-700 ease-in-out dark:bg-gray-800">
          <SearchBar handlename = {handleInput}/>  
          <SearchBarResults showList = {showList} />
        </div>
        <SearchDashboard showList = {showList} list_of_tempos = {list_of_tempos} handlename = {handleFilterInput} display = {props.dashboard_display}/>
      </div> 
    )
  }
  
  export function SearchBar(props) {
    return <input type="text" placeholder="Search.."
    className="search_bar box-border w-full text-sm p-2 border-none border-b border-gray-300 focus:outline-gray-300 focus:border-gray-300 dark:bg-gray-700 dark:text-white" onChange={props.handlename}/>
  }
  
  export function SearchBarResults(props){
    const listItems = props.showList.map((song,index) => {return (<SearchBarResultsItem key = {index} song = {song}/>)});
  
    return (<ul>
      {listItems}
    </ul>)
  
  }
  
  export function SearchBarResultsItem(props) {
    const { set_list, update_set_list, update_current_song, update_current_set_song } = useContext(SongContext);
    const [hovered, setHovered] = useState(false);
  
    function addSongToSet() {
      // React state objects should be considered immutable.
      // Mutating the array won't cause the state change to be noticed for re-render
      var new_song = JSON.parse(JSON.stringify(props.song))
      update_set_list([...set_list, new_song]);
    }
  
    function selectSongToDisplay() {
      update_current_song(props.song);
      update_current_set_song(-1);
    }
  
    return (
      <li
        className="w-calc-100-minus-0.8em m-0 p-2 block text-sm font-normal hover:bg-gray-200 focus:bg-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600 hover:cursor-pointer relative"
        tabIndex={0}
        data-id={props.song.id}
        onClick={selectSongToDisplay}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {props.song.title}
        {hovered && (
          <img src= "./plus.svg" className=" hover:bg-gray-300 absolute mx-2 p-1 right-0 top-0 bottom-0 top-1/2 transform -translate-y-1/2" onClick={addSongToSet}/>
        )}
      </li>
    );
  }

  export function SearchDashboard(props) {
    const {update_current_song, update_current_set_song} = useContext(SongContext); 

    const tempo_options = props.list_of_tempos.map((tempo,index) => {return (<option key={index+1}value={tempo}>{tempo}</option>)})

    function shuffle() {

      let select_song = props.showList[Math.floor(Math.random() * props.showList.length)];

      //need to manipulate DOM to find and focus the search element selected
      let select_song_element = document.querySelector(`[data-id=${select_song.id}]`);
      select_song_element.scrollIntoView({block: 'center', behavior: "smooth"});
      select_song_element.focus({preventScroll: true});

      update_current_song(select_song);
      update_current_set_song(-1);

    }
  
    
    return(
        <div className={`${props.display} text-sm flex justify-between mr-1`}>
            <label>Tempo:
                <select className="box-border min-w-fit text-xs p-2 border-b border-gray-300 focus:outline-gray-300 focus:border-gray-300 dark:bg-gray-800" defaultValue="Any" name="tempo_options" id="tempo_options" 
                    onChange={props.handlename}>
                        <option key={0} value="Any">Any</option>
                        {tempo_options}
                </select>
            </label>
            <button onClick={shuffle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shuffle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
                  <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
                </svg>
            </button>
        </div>
    )
  }

