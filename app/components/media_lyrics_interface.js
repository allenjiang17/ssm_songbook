'use client'

import React, {useState, useContext, useEffect, useCallback} from 'react';
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
        //can_edit = props.edit_list.includes(user?.id);
        can_edit = user?.publicMetadata['edit_privileges'];

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

    const handleKeyDown = useCallback((event) => {
        switch (event.key) {
            case 'ArrowUp':
                navigateToPreviousLyric();
                break;
            case 'ArrowDown':
                navigateToNextLyric();
                break;
            case 'ArrowLeft':
                navigateToPreviousLyric();
                break;
            case 'ArrowRight':
                navigateToNextLyric();
                break;
            default:
                break;
        }
    }, [lyrics_list, current_lyric_no]); // Include dependencies to avoid stale closures

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    function navigateToPreviousLyric() {
        updateCurrentLyricByOffset(-1);
    }

    function navigateToNextLyric() {
        updateCurrentLyricByOffset(1);
    }

    function updateCurrentLyricByOffset(offset) {
        const newLyricIndex = (current_lyric_no + offset + lyrics_list.length) % lyrics_list.length;
        update_current_lyric(lyrics_list[newLyricIndex]);
        update_current_lyric_no(newLyricIndex);
    }

    const [isPopupVisible, setPopupVisible] = useState(false);

    const handleIconHover = () => {
        setPopupVisible(true);
    };

    const handleIconLeave = () => {
        setPopupVisible(false);
    };

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
                    <div className="relative group">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <p className="inline-block mb-2 text-lg font-semibold mr-2">Edit Lyrics</p>
                                <div className="inline-block cursor-pointer hover:bg-gray-300 p-1 rounded-full mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 i-icon" viewBox="0 0 20 20" fill="currentColor"
                                    onMouseEnter={handleIconHover}
                                    onMouseLeave={handleIconLeave}>
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM10 9a1 1 0 011 1v4a1 1 0 01-2 0v-4a1 1 0 011-1zm0-4a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <img src="./x-lg.svg" className="mb-2 inline-block h-fit x-button hover:bg-gray-300 hover:cursor-pointer p-1" onClick={closePopup} />
                            </div>
                        </div>
                        <div className={`absolute bg-white border border-gray-200 rounded-lg shadow-md p-4 text-sm -mt-24 w-48 ${isPopupVisible ? 'visible' : 'invisible'}`}>
                            <p>two newlines = new slide</p>
                        </div>
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

    const {current_lyric, current_lyric_no, lyrics_list, update_current_lyric, update_current_lyric_no} = useContext(LyricContext);
    let select_style;
    if (current_lyric_no == props.id) {
        select_style = "box-border w-full p-2 bg-ssmblue400 text-white";
    } else {
        select_style = "box-border w-full p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600";
    }

    function selectLyricToDisplay() {
        update_current_lyric(props.lyric);
        update_current_lyric_no(props.id);
    };

    

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