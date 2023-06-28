'use client'

import React, {useState} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import {TextButton} from './text_button.js'

export function AddSongButton() {
    const {current_song, update_set_list, set_list} = useContext(SongContext); 

    function addSongToSet() {
        //React state objects should be considered immutable.
        // Mutating the array won't cause the state change to be noticed for re-render

        if (current_song !== undefined) {
            var new_song = JSON.parse(JSON.stringify(current_song))
            update_set_list([...set_list, new_song]);
        }
    }

      return(
        <TextButton handler={addSongToSet} button_text={"Add to Set"}/>
      )

}