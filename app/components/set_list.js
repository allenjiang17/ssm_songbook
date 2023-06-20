import React, {useState} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {transpose, readKey} from './transposer.js';


export function DraggableList(props) {
    const {set_list, update_set_list} = useContext(SongContext); 

    function updateSetListState(result) {
        if (!result.destination) return;

        const items = Array.from(set_list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        update_set_list(items);
    }

    const listItems = props.set_list.map(
        (song,index) => 
        {
        return (
        <Draggable key={song.id + index} draggableId={song.id + index} index={index}> 
        {(provided) => (
            <div ref={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps} className="p-1">
                <ListItem 
                id = {index}
                song = {song}/>
            </div>
        )}
        </Draggable>)
        }
        );

    return (<DragDropContext onDragEnd={updateSetListState}>
        <Droppable droppableId="set_list">
            {(provided)=> (
            <ul {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="box-border w-full focus:outline-gray-400 mb-2 list-none">
                {listItems}
                {provided.placeholder}
            </ul>
        )}
        </Droppable>
    </DragDropContext>)
    
}


function ListItem(props) {
    const {update_current_song, current_set_song, update_current_set_song} = useContext(SongContext); 

    var local_song_key = readKey(props.song.sheet);
    var select_style;

    if (current_set_song == props.id) {
        select_style = "box-border flex items-center flex-row justify-between w-full pt-2 pb-2 pr-2 drop-shadow bg-ssmblue400 text-white rounded";
    } else {
        select_style = "box-border flex items-center flex-row justify-between w-full pt-2 pb-2 pr-2 drop-shadow bg-gray-100 hover:bg-gray-200 rounded";
    }

    function selectSongToDisplay() {
        update_current_song(props.song);
        update_current_set_song(props.id);

    }

    return (<li className={select_style}
        data-id={props.song.id}
        onClick = {selectSongToDisplay}>
            <div className = "box-border text-sm font-normal flex items-center flex-row w-full">
                <img className = "h-3" src="./grip-vertical.svg"/>
                {props.song.title + ' (' + local_song_key + ')'}
            </div>
            <ListButton/>
        </li>)
}

function ListButton(props) {

    const {set_list, update_set_list} = useContext(SongContext); 

    function deleteSongFromSet(event) {
        var index = Array.prototype.indexOf.call(event.target.parentNode.parentNode.parentNode.children, event.target.parentNode.parentNode);
        set_list.splice(index, 1);
        const new_set_list = [...set_list];
        update_set_list(new_set_list);
      }

    return <img src= "./x-lg.svg" className="ml-1 hover:bg-gray-300" onClick={deleteSongFromSet}/>
}



/*
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>

*/