'use client'
import React, {useState} from 'react';
import {TransposeButton} from './transpose_button';
import {useContext} from 'react';
import {SongContext} from '../song_context.js';
import {transpose, readKey} from './transposer.js';
import {AddSongButton} from './add_song_button.js';

export function ChordDashboard(props) {

    const {current_song, update_current_song, current_set_song, set_list, update_set_list} = useContext(SongContext);

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
    
            var new_set_list = JSON.parse(JSON.stringify(set_list));
            new_set_list[current_set_song] = new_song;
            update_set_list(new_set_list);
        }
    }

    function transpose_key_up() {
        //perform copy of current_song object
        if (current_song !== undefined) {
            var new_song = JSON.parse(JSON.stringify(current_song));

            new_song.sheet = transpose(current_song.sheet, 1);
            update_current_song(new_song);
    
            var new_set_list = JSON.parse(JSON.stringify(set_list));
            new_set_list[current_set_song] = new_song;
            update_set_list(new_set_list);
        }
    }


    return (
        <div className="box-border flex p-2 bg-ssmblue w-full justify-between">
            <AddSongButton/>
            <div className="m-0 p-0 inline-block text-right">
                <div id="key_label" className="inline-block align-middle text-base text-white font-light ml-2"> Current Key: </div>
                <div id="key_display" className="inline-block align-middle text-base text-white font-bold w-4 mr-4 py-1 px-2 text-left">{display_key}</div>
                <TransposeButton sign="-" handler={transpose_key_down}/>
                <TransposeButton sign="+" handler={transpose_key_up}/>
            </div>

        </div>)

}