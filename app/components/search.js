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
    let showList = database.filter(song => song.title.toUpperCase().indexOf(input) == 0);

    return (
      <div className="mb-2">
        <div className="bg-gray-100 mb-1 overflow-auto border border-gray-300 max-h-64 transition-all duration-700 ease-in-out">
          <SearchBar handlename = {handleInput}/>  
          <SearchBarResults showList = {showList} />
        </div>
        <SearchDashboard list_of_tempos = {list_of_tempos} handlename = {handleFilterInput}/>
      </div> 
    )
  }
  
  export function SearchBar(props) {
    return <input type="text" placeholder="Search.."
    className="search_bar box-border w-full text-sm p-2 border-none border-b border-gray-300 focus:outline-gray-300 focus:border-gray-300" onChange={props.handlename}/>
  }
  
  export function SearchBarResults(props){
    const listItems = props.showList.map((song,index) => {return (<SearchBarResultsItem key = {index} song = {song}/>)});
  
    return (<ul>
      {listItems}
    </ul>)
  
  }
  
  export function SearchBarResultsItem(props){
    const {set_list, update_set_list, update_current_song, update_current_set_song} = useContext(SongContext); 

    function addSongToSet() {
      //React state objects should be considered immutable.
      // Mutating the array won't cause the state change to be noticed for re-render
      var new_song = JSON.parse(JSON.stringify(props.song))
      update_set_list([...set_list, new_song]);
    }

    function selectSongToDisplay() {
        update_current_song(props.song);
        update_current_set_song(-1);
    }

    return <li className="w-calc-100-minus-0.8em m-0 p-2 block text-sm font-normal hover:bg-gray-200 focus:bg-gray-300" tabIndex={0}
    data-id={props.song.id} onClick={selectSongToDisplay} onDoubleClick={addSongToSet}>{props.song.title}</li>
  }

  export function SearchDashboard(props) {

    const tempo_options = props.list_of_tempos.map((tempo,index) => {return (<option key={index+1}value={tempo}>{tempo}</option>)})

    return(
        <div className="text-sm">
            <label>Tempo:
                <select className="box-border min-w-fit text-xs p-2 border-b border-gray-300 focus:outline-gray-300 focus:border-gray-300" defaultValue="Any" name="tempo_options" id="tempo_options" 
                    onChange={props.handlename}>
                        <option key={0} value="Any">Any</option>
                        {tempo_options}
                </select>
            </label>

        </div>
    )
  }
  