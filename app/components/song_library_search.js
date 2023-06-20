'use client'
import React, {useState} from 'react';
import {SearchBar} from './search'
import {SongContext} from '../song_context.js';
import {useContext} from 'react';

export function SongLibraryTable(props){
    const [search_text, set_search_text] = useState("");

    function handleInput(event) {
      set_search_text(event.target.value);
    }
  
    var database = props.database;
    
    //search function
    let input = search_text.toUpperCase();
    let showList = database.filter(song => song.title.toUpperCase().indexOf(input) == 0);

    return (
      <div className="mb-2 bg-gray-100 mb-1 overflow-auto max-h-[80vh] border border-gray-300 transition-all duration-700 ease-in-out">
          <SearchBar handlename = {handleInput}/>  
          <SearchTable showList = {showList} />
      </div>
    )
  }

  export function SearchTable(props){
    const listItems = props.showList.map((song,index) => {return (<SearchTableRow key = {index} song = {song}/>)});
  
    return (<table>
      <tbody>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Tempo</th>
      </tr>
      {listItems}
      </tbody>
    </table>)
  
  }
  
  export function SearchTableRow(props){
    const {update_current_song, update_edit_or_add} = useContext(SongContext); 

    function selectSongToDisplay() {
        update_current_song(props.song);
        update_edit_or_add("edit")

    }

    return (<tr className="text-sm font-normal hover:bg-gray-200 focus:bg-gray-300" tabIndex={0}
    data-id={props.song.id} onClick={selectSongToDisplay}>
        <td className="p-1">{props.song.title}</td>
        <td className="p-1">{props.song.author}</td>
        <td className="p-1">{props.song.tempo}</td>     
    </tr>)
  }
