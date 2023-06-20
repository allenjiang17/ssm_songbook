'use client'

import React, {useState} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {SongDisplay} from './song_display.js';
import {SheetDashboard} from './sheet_dashboard.js';

export function AddSong() {

    return (
        <div className = "box-border border ml-5 w-1/2 block">
            <div className = "mb-2 pl-3 text-lg font-semibold text-white p-2 bg-ssmblue w-full">New Song</div>
            <div className= "p-3">
                <label for="song_title_input" className="font-sm font-semibold">Title</label>
                    <input type="text" id="song_title_input" name="song_title_input" className="block border border-solid mb-3" required/>
                    <label for="song_author_input" className="font-sm font-semibold">Author</label>
                    <input type="text" id="song_author_input" name="song_author_input"className="block border border-solid mb-3" required/>
                    <label for="song_tempo_input" className="font-sm font-semibold">Tempo</label>
                    <input type="text" id="song_tempo_input" name="song_tempo_input"className="block border border-solid mb-3" required/>
                    <label className="font-sm font-semibold">Sheet</label>
                <SheetDashboard/>
                <SongDisplay window_height={"h-[calc(100vh-450px)]"}/>

                <br></br>
                <button className="box-border inline-block font-semibold text-white text-sm p-2 mr-2 bg-ssmbluenight rounded-md hover:bg-ssmblue400">Submit</button>
            </div>
      </div>
    )
}