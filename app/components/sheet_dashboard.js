import React, {useState} from 'react';
import {TransposeButton} from './transpose_button';
import {readKey} from './transposer.js'

export function SheetDashboard(props) {

    var display_key = "?"

    if (props.song !== undefined) {
        display_key = readKey(props.song.sheet);
    }

    return (
        <div className="box-border p-1 bg-gray-600 w-full">
            <div className= "box-border text-right">
                <div id="key_label" className="inline-block text-base text-white font-light ml-2"> Current Key: </div>
                <div id="key_display" className="inline-block text-base text-white font-bold w-4 mr-4 py-1 px-2 text-left">{display_key}</div>
                <TransposeButton sign="-"/>
                <TransposeButton sign="+"/>
            </div>

        </div>)

}