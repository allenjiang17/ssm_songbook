import React, {useState} from 'react';
import {TransposeButton} from './transpose_button';
import {readKey} from './transposer.js'
import {AddSongButton} from './add_song_button.js';

export function ChordDashboard(props) {

    var display_key = "?"

    if (props.song !== undefined) {
        display_key = readKey(props.song.sheet);
    }

    return (
        <div className="box-border flex p-2 bg-ssmblue w-full justify-between">
            <AddSongButton/>
            <div className="m-0 p-0 inline-block text-right">
                <div id="key_label" className="inline-block align-middle text-base text-white font-light ml-2"> Current Key: </div>
                <div id="key_display" className="inline-block align-middle text-base text-white font-bold w-4 mr-4 py-1 px-2 text-left">{display_key}</div>
                <TransposeButton sign="-"/>
                <TransposeButton sign="+"/>
            </div>

        </div>)

}