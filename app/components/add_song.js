'use client'

import React, {useState} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {remove_chord_lines, readKey} from './transposer'
import { useOrganizationList } from "@clerk/nextjs";
import { TextButton } from './text_button.js';


export function AddSong() {
    const {can_edit} = useContext(SongContext);

    const [s_title, update_title] = useState();
    const [s_author, update_author] = useState();
    const [s_tempo, update_tempo] = useState();
    const [s_sheet, update_sheet] = useState();

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

    async function addSongToDb() {
        if (!can_edit) {window.alert("User has no permission to edit the song library"); return}
        
        var id_time = new Date()
        var response = await fetch('/api/add_to_mongo_db',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: 'd' + id_time.getTime(), title: s_title, author: s_author, tempo: s_tempo, sheet: s_sheet, lyrics: remove_chord_lines(s_sheet), key: readKey(s_sheet)})
            });

        console.log(response);
        //get updated database
        //var response = await fetch('http://localhost:3000/api/get_mongo_db');
        //var db = await response.json();

        //update_database(db);
        location.reload();

    }

    return (
        <div className = "box-border border ml-5 w-1/2 block">
            <div className = "mb-2 pl-3 text-lg font-semibold text-white p-2 bg-ssmblue w-full">New Song</div>
            <div className= "p-3">
                <label for="song_title_input" className="font-sm font-semibold">Title</label>
                    <input type="text" id="song_title_input" name="song_title_input" className="block border border-solid mb-3" onChange={setTitle} required/>
                    <label for="song_author_input" className="font-sm font-semibold">Author</label>
                    <input type="text" id="song_author_input" name="song_author_input"className="block border border-solid mb-3" onChange={setAuthor}required/>
                    <label for="song_tempo_input" className="font-sm font-semibold">Tempo</label>
                    <input type="text" id="song_tempo_input" name="song_tempo_input"className="block border border-solid mb-3" onChange={setTempo} required/>
                    <label className="font-sm font-semibold">Sheet</label>
                <textarea className="box-border w-full font-mono text-sm m-0 p-8 rounded-none border-solid border-2 h-[calc(100vh-450px)]" onChange={setSheet}></textarea>
                <br></br>
                <TextButton handler={addSongToDb} button_text={"Submit"}/>
            </div>
      </div>
    )
}