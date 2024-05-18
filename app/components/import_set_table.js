'use client'
import React, {useState, useEffect, useContext} from 'react';
import {SearchBar} from './search'
import {SongContext} from '../song_context'

export function ImportSetTable(props){
    const [search_text, set_search_text] = useState("");

    function handleInput(event) {
      set_search_text(event.target.value);
    }
  
    var list_of_sets = props.import_sets;
    console.log("list of sets" + list_of_sets);
    
    //search function
    let input = search_text.toUpperCase();
    let showList = list_of_sets.filter(set=> set.set_name.toUpperCase().indexOf(input) == 0);

    return (
      <div className="mb-2 bg-gray-100 mb-1 overflow-auto max-h-[80vh] border border-gray-300 dark:bg-gray-800">
          <SearchBar handlename = {handleInput}/>  
          <SearchTable showList = {showList}/>
      </div>
    )
  }

  export function SearchTable(props){


    //convert list of song objects to html components
    let listItems = props.showList.map((set,index) => {return (<SearchTableRow key = {index} set = {set}/>)});

    return (<table className="w-full">
      <tbody>
      <tr>
        <th className="text-m font-semibold text-left p-1">Set Name</th>
        <th className="text-m font-semibold text-left p-1">Author</th>
        <th className="text-m font-semibold text-left p-1">Date Added</th>

      </tr>
      {listItems}
      </tbody>
    </table>)
  
  }
  
  export function SearchTableRow(props){

    const {set_list, update_set_list} = useContext(SongContext);
    function selectSet() {
        update_set_list(props.set.set_list);

    }

    return (<tr className="text-sm font-normal hover:bg-gray-200 active:bg-ssmblue active:text-white dark:hover:bg-gray-600 dark:focus:bg-gray-600 hover:cursor-pointer" tabIndex={0}
    onClick={selectSet}>
        <td className="p-1">{props.set.set_name}</td>
        <td className="p-1">{props.set.set_author}</td>
        <td className="p-1">{props.set.set_date}</td>

    </tr>)
  }
