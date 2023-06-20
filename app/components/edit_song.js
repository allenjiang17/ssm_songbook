'use client'

import React, { useState, useEffect } from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {SongDisplay} from '../components/song_display.js';
import {SheetDashboard} from '../components/sheet_dashboard.js';

export function EditSong() {

    const {current_song, update_current_song} = useContext(SongContext); 

    const [title, update_title] = useState();
    const [author, update_author] = useState();
    const [tempo, update_tempo] = useState();

    useEffect(() => {
        if (current_song != undefined) {
          update_title(current_song.title);
          update_author(current_song.author);
          update_tempo(current_song.tempo);
        }
      }, [current_song]);

    function setTitle(event) {
        update_title(event.target.value)
    }

    function setAuthor(event) {
        update_author(event.target.value)
    }

    function setTempo(event) {
        update_tempo(event.target.value)
    }
    return (
        <div className="box-border border ml-5 w-1/2 block">
            <div className = "mb-2 pl-3 text-lg font-semibold text-white p-2 bg-ssmblue w-full">Edit Song</div>
            <div className= "p-3">
                    <label htmlFor="song_title_input" className="font-sm font-semibold">Title</label>
                    <input type="text" id="song_title_input" name="song_title_input" className="block border border-solid mb-3" value={title} onChange={setTitle} required/>
                    <label htmlFor="song_author_input" className="font-sm font-semibold">Author</label>
                    <input type="text" id="song_author_input" name="song_author_input"className="block border border-solid mb-3" value={author} onChange={setAuthor}  required/>
                    <label htmlFor="song_tempo_input" className="font-sm font-semibold">Tempo</label>
                    <input type="text" id="song_tempo_input" name="song_tempo_input"className="block border border-solid mb-3" value={tempo} onChange={setTempo}  required/>
                    <label className="font-sm font-semibold">Sheet</label>
                <SheetDashboard song = {current_song}/>
                <SongDisplay song = {current_song} window_height={"h-[calc(100vh-450px)]"}/>

                <br></br>
                <button className="box-border inline-block font-semibold text-white text-sm p-2 mr-2 bg-ssmbluenight rounded-md hover:bg-ssmblue400">Save Changes</button>
                <button className="box-border inline-block font-semibold text-white text-sm p-2 mr-2 bg-red-600 rounded-md hover:bg-ssmblue400">Delete Song</button>
            </div>
      </div>
    )
}