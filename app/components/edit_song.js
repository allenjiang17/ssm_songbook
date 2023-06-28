'use client'

import React, { useState, useEffect } from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {SongDisplay} from '../components/song_display.js';
import {SheetDashboard} from '../components/sheet_dashboard.js';
import {remove_chord_lines} from './transposer'
import Popup from 'reactjs-popup';
import { useOrganizationList } from "@clerk/nextjs";
import { TextButton } from './text_button.js';


export function EditSong() {

    const [popup_open, set_popup_open] = useState(false);
    const [popup_dialog, set_popup_dialog] = useState();
    const closePopup = () => set_popup_open(false);

    const {current_song, update_current_song, database, update_database} = useContext(SongContext); 

    const [s_title, update_title] = useState("");
    const [s_author, update_author] = useState("");
    const [s_tempo, update_tempo] = useState("");
    const [s_sheet, update_sheet] = useState("");

    const {can_edit} = useContext(SongContext);

    function setTitle(event) {
        update_title(event.target.value)
    }

    function setAuthor(event) {
        update_author(event.target.value)
    }

    function setTempo(event) {
        update_tempo(event.target.value)
    }

    function setSheet(event) {
        update_sheet(event.target.value)
    }

    useEffect(() => {
        if (current_song != undefined) {
          update_title(current_song.title);
          update_author(current_song.author);
          update_tempo(current_song.tempo);
          update_sheet(current_song.sheet);

        }
      }, [current_song]);

    async function deleteSong() {
        if (!can_edit) {window.alert("user has no permission to edit"); return}

        //open popup dialog
        set_popup_dialog("Deleting Song");
        set_popup_open(o=>!o);

        var response = await fetch('/api/delete_from_mongo_db',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(current_song)});

        console.log(response);
        location.reload();
    }

    async function editSong(event) {
        if (!can_edit) {window.alert("user has no permission to edit"); return}

        //open popup dialog
        set_popup_dialog("Updating Song in Database");
        set_popup_open(o=>!o);

        var response = await fetch('/api/edit_from_mongo_db',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: current_song.id, title: s_title, author: s_author, tempo: s_tempo, sheet: s_sheet, lyrics: remove_chord_lines(s_sheet)})
        });

        console.log(response);
        location.reload();

    }
    return (
        <div className="box-border border ml-5 w-1/2 block">
            <div className = "mb-2 pl-3 text-lg font-semibold text-white p-2 bg-ssmblue w-full">Edit Song</div>
            <div className= "p-3">
                    <label htmlFor="song_title_input" className="font-sm font-semibold">Title</label>
                    <input type="text" id="song_title_input" name="song_title_input" className="block border border-solid mb-3 w-fit dark:bg-gray-700 dark:border-none" value={s_title} onChange={setTitle} required/>
                    <label htmlFor="song_author_input" className="font-sm font-semibold">Author</label>
                    <input type="text" id="song_author_input" name="song_author_input"className="block border border-solid mb-3 w-fit dark:bg-gray-700 dark:border-none" value={s_author} onChange={setAuthor}  required/>
                    <label htmlFor="song_tempo_input" className="font-sm font-semibold">Tempo</label>
                    <input type="text" id="song_tempo_input" name="song_tempo_input"className="block border border-solid mb-3 w-fit dark:bg-gray-700 dark:border-none" value={s_tempo} onChange={setTempo}  required/>
                    <label className="font-sm font-semibold">Sheet</label>
                <SheetDashboard song = {current_song}/>
                <textarea className="box-border w-full font-mono text-sm m-0 p-8 rounded-none border-solid border-2 h-[calc(100vh-450px)] dark:bg-gray-900 dark:border-none" value={s_sheet} onChange={setSheet}></textarea>
                <br></br>
                <TextButton handler={editSong} button_text={"Save Changes"} add_classes={"py-2"}/>
                <button className="box-border inline-block font-semibold text-white text-sm p-2 ml-3 bg-red-600 rounded-md hover:bg-red-700 active:bg-red-800" onClick={deleteSong}>Delete Song</button>
            </div>
            <Popup open={popup_open} closeOnDocumentClick onClose={closePopup}>
                <div className="box-border bg-gray-500 rounded-md p-5">
                    <div className="box-border text-white font-semibold m-3">
                        {popup_dialog}
                    </div>
                    <div className="mx-auto w-10">
                        <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                    </div>
                </div>
            </Popup>
      </div>
      
    )
}

    /* EXTRA CODE / NOT USED
    const {organizationList} = useOrganizationList();
    let org_list = [];
    if (organizationList) {
        org_list = organizationList.map(({organization}) => (
                organization.name))
    }
    const [can_edit, set_can_edit] = useState(org_list.includes("adminers"));

            //get updated database
        //var response = await fetch('/api/get_mongo_db');
        //var db = await response.json();
        //update_database(db);
        //closePopup();
    */