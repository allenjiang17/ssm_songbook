'use client'
import React, {useState} from 'react';
import {Search} from '../components/search.js';
import {DraggableList} from '../components/set_list.js';

export function MediaInterface(props){

    return(
        <div>
            <p id="song_list_label" className = "mb-2 text-base font-semibold text-black">Songs</p>
            <Search database = {props.database} />
            <p id="set_list_label" className = "mb-2 text-base font-semibold text-black">Set List</p>
            <DraggableList database = {props.database} 
            set_list={set_list} />
        </div>
    )

}