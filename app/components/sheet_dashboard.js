'use client'
import React, {useState} from 'react';
import {TransposeButton} from './transpose_button';
import {useContext} from 'react';
import {SongContext} from '../song_context.js';
import {transpose, readKey} from './transposer.js';

export function SheetDashboard(props) {

    const {current_song, update_current_song} = useContext(SongContext);

    var display_key = "?"

    if (props.song !== undefined) {
        display_key = readKey(props.song.sheet);
    }

    function transpose_key_down() {
        //perform copy of current_song object
        if (current_song !== undefined) {
            var new_song = JSON.parse(JSON.stringify(current_song));

            new_song.sheet = transpose(current_song.sheet, -1);
            update_current_song(new_song);
        }
    }

    function transpose_key_up() {
        //perform copy of current_song object
        if (current_song !== undefined) {
            var new_song = JSON.parse(JSON.stringify(current_song));

            new_song.sheet = transpose(current_song.sheet, 1);
            update_current_song(new_song);

        }
    }

    return (
        <div className="box-border p-1 bg-gray-600 w-full">
            <div className= "box-border text-right">
                <div id="key_label" className="inline-block text-base text-white font-light ml-2"> Current Key: </div>
                <div id="key_display" className="inline-block text-base text-white font-bold w-4 mr-4 py-1 px-2 text-left">{display_key}</div>
                <TransposeButton sign="-" handler={transpose_key_down}/>
                <TransposeButton sign="+" handler={transpose_key_up}/>
            </div>

        </div>)

}