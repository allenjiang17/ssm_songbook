'use client'
import React, {useState, useEffect} from 'react';
import {SearchBar} from './search'
import {SongContext} from '../song_context.js';
import {useContext} from 'react';

export function SongLibraryTable(props){
    const [search_text, set_search_text] = useState("");
    const [list_songs, update_list_songs] = useState([]);

    function handleInput(event) {
      set_search_text(event.target.value);
    }
  
    var database = props.database;
    
    //search function
    useEffect(() => {
      let input = search_text.toUpperCase();
      update_list_songs(database.filter(song => song.title.toUpperCase().indexOf(input) == 0));
    },[search_text]);

    return (
      <div className="mb-2 bg-gray-100 mb-1 overflow-auto max-h-[80vh] border border-gray-300 dark:bg-gray-800">
          <SearchBar handlename = {handleInput}/>  
          <SearchTable showList = {list_songs} updateListHandler = {update_list_songs} />
      </div>
    )
  }

  export function SearchTable(props){
    let carot_svg_path = "M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z";

    const [svg_path, update_svg_path] = useState([carot_svg_path, carot_svg_path, carot_svg_path, carot_svg_path]);

    //convert list of song objects to html components
    let listItems = props.showList.map((song,index) => {return (<SearchTableRow key = {index} song = {song}/>)});

    function sortList(event, property){
      //make a copy of the list of songs, react does not re-render if the state object is mutated
      let temp_list = JSON.parse(JSON.stringify(props.showList));
      temp_list.sort((a, b) => a[property].localeCompare(b[property]));
      props.updateListHandler(temp_list);

      //hide sort carot button to indicated sorted
      if (property == "title") {
        update_svg_path(["", carot_svg_path, carot_svg_path, carot_svg_path]);
      } else if (property == "author") {
        update_svg_path([carot_svg_path, "", carot_svg_path, carot_svg_path]);
      } else if (property == "tempo") {
        update_svg_path([carot_svg_path, carot_svg_path, "", carot_svg_path]);        
      } else {
        update_svg_path([carot_svg_path, carot_svg_path, carot_svg_path, ""]);        
      }

    }
    return (<table className="w-full">
      <tbody>
      <tr>
        <th className="text-m font-semibold text-left p-1">Title<svg className="box-border inline-block ml-1 w-4 h-4" onClick={(event)=>sortList(event, "title")}><path d={svg_path[0]}/></svg>
      </th>
        <th className="text-m font-semibold text-left p-1">Author<svg className="box-border inline-block ml-1 w-4 h-4" onClick={(event)=>sortList(event, "author")}><path d={svg_path[1]}/></svg>
        </th>
        <th className="text-m font-semibold text-left p-1">Tempo<svg className="box-border inline-block ml-1 w-4 h-4" onClick={(event)=>sortList(event, "tempo")}><path d={svg_path[2]}/></svg>
        </th>
        <th className="text-m font-semibold text-left p-1">Default Key<svg className="box-border inline-block ml-1 w-4 h-4" onClick={(event)=>sortList(event, "key")}><path d={svg_path[3]}/></svg>
        </th>

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

    return (<tr className="text-sm font-normal hover:bg-gray-200 focus:bg-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600 hover:cursor-pointer" tabIndex={0}
    data-id={props.song.id} onClick={selectSongToDisplay}>
        <td className="p-1">{props.song.title}</td>
        <td className="p-1">{props.song.author}</td>
        <td className="p-1">{props.song.tempo}</td>
        <td className="p-1">{props.song.key}</td>     
     
    </tr>)
  }
