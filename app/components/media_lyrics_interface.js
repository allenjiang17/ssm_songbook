'use client'

import React, {useState, useContext, useEffect} from 'react';
import {LyricContext} from '../media_mode/lyricContext.js';
import {SongContext} from '../song_context.js';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {splitLyrics} from './export.js'
import {MediaDisplay} from './media_display.js'
import Popup from 'reactjs-popup';
import { TextButton } from './text_button.js';
import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';

export function MediaLyricsInterface(props) {

    //user auth
    const {isLoaded, isSignedIn, user} = useUser();
    var can_edit, guest;
    if (isLoaded && isSignedIn) {
        can_edit = props.edit_list.includes(user?.id);
        if (can_edit) {
        console.log("User has edit privileges")
        } else {
        console.log("User has no edit privileges")
        }
    } else {
        guest = true;
        can_edit = false;
    }

    const {current_song} = useContext(SongContext);

    const [lyrics_list, update_lyrics_list] = useState(splitLyrics(current_song.lyrics));
    const [current_lyric, update_current_lyric] = useState("");
    const [current_lyric_no, update_current_lyric_no] = useState();
    const [edit_lyrics_sheet, update_edit_lyrics_sheet] = useState();

    useEffect(() => {
        if (current_song != undefined) {
            update_lyrics_list(splitLyrics(current_song.lyrics));
            update_edit_lyrics_sheet(current_song.lyrics);
        }

      }, [current_song]);

    const [popup_open, set_popup_open] = useState(false);
    const closePopup = () => set_popup_open(false);


    async function editLyricsOpen(){
    if (guest) {window.alert("Please sign-in to edit the lyrics"); return}
    if (!can_edit) {window.alert("User has no permission to edit lyrics. Contact your admin to be authorized to edit lyrics."); return}

        set_popup_open(o=>!o);      
    }

    function updateSheet(event) {
        update_edit_lyrics_sheet(event.target.value)

    }
    
    async function submitEditLyrics() {

        var new_song = JSON.parse(JSON.stringify(current_song));
        new_song.lyrics = edit_lyrics_sheet;

        var response = await fetch('/api/edit_from_mongo_db',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(new_song)});

        console.log(response);
        location.reload();

    }


    return (
        <LyricContext.Provider value={{lyrics_list, current_lyric, current_lyric_no, update_lyrics_list, update_current_lyric, update_current_lyric_no}}>
        <div className="box-border ml-3 w-4/5 block">
            <div className="box-border w-2/5 inline-block">
                <div className="flex justify-between mb-2">
                    <div className="box-border inline-block align-middle text-base font-md font-semibold">Lyrics</div>
                    <TextButton handler={editLyricsOpen} button_text={"Edit Lyrics"}/>
                </div>
                <DraggableList/>
            </div>
            <div className="box-border w-3/5 inline-block align-top pl-3">
                <div className="box-border inline-block align-middle text-base font-md mb-2 font-semibold">Presentation</div>
                <MediaDisplay/>
            </div>
            <Popup open={popup_open} onClose={closePopup}>
                <SignedIn>
                    <div className="box-border bg-gray-100 w-96 rounded-md p-5 w-fit h-fit drop-shadow-lg dark:bg-gray-700">
                    <div className="flex justify-between">
                        <p className = "inline-block mb-2 text-lg font-semibold">Edit Lyrics</p>
                        <img src= "./x-lg.svg" className="inline-block ml-1 h-fit hover:bg-gray-300" onClick={closePopup}/>
                    </div>
                    <textarea className="box-border w-full font-mono text-sm m-0 p-8 rounded-none border-solid border-2 h-[60vh] w-[50vw] dark:bg-gray-900 dark:border-none" value={edit_lyrics_sheet} onChange={updateSheet}></textarea>
                    <TextButton handler={submitEditLyrics} button_text={"Submit"}/>
                    </div>
                </SignedIn>
             </Popup>
        </div>
        </LyricContext.Provider>
        )
    
}


function DraggableList() {

    const {lyrics_list, update_lyrics_list} = useContext(LyricContext);

    function updateLyricListState(result) {
        if (!result.destination) return;

        const items = Array.from(lyrics_list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        update_lyrics_list(items);
    }

    const listItems = lyrics_list.map(
        (lyric,index) => 
        {
        return (
            <Draggable key={"l" + index} draggableId={"l" + index} index={index}> 
            {(provided) => (
                <div ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps} className="">
                    <ListItem 
                    id = {index}
                    lyric = {lyric}/>
                </div>
            )}
            </Draggable>
        )
        }
    );

    return (<DragDropContext onDragEnd={updateLyricListState}>
        <Droppable droppableId="lyrics_list">
            {(provided)=> (
            <ul {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="box-border w-full border border-gray-400 focus-within:border-2 mb-2 list-none">
                {listItems}
                {provided.placeholder}
            </ul>
        )}
        </Droppable>
    </DragDropContext>)

}


function ListItem(props) {

    const {current_lyric, current_lyric_no, update_current_lyric, update_current_lyric_no} = useContext(LyricContext);
    let select_style;
    if (current_lyric_no == props.id) {
        select_style = "box-border w-full p-2 bg-ssmblue400 text-white";
    } else {
        select_style = "box-border w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600";
    }

    function selectLyricToDisplay() {
        update_current_lyric(props.lyric);
        update_current_lyric_no(props.id);

    }

    return (<li className={select_style}
        onClick = {selectLyricToDisplay}>
            <div className = "box-border whitespace-pre-wrap text-sm font-normal">
                {props.lyric}
            </div>
        </li>)
}



/*
        onDragStart={handleDragStart}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>

*/