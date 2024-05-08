'use client'
import React, {useState} from 'react';
import {TransposeButton} from './transpose_button';
import {useContext} from 'react';
import {SongContext} from '../song_context.js';
import {transpose, readKey} from './transposer.js';
import {AddSongButton} from './add_song_button.js';
import { IconButton } from './icon_button.js';

const font_up_icon =(<svg width="16" height="16" fill="white">
    <path d="M 9.7540852,9.5811552 9.285731,11.117309 H 8.0913186 L 10.095825,5.1430044 h 1.382651 l 1.995543,5.9743046 H 12.219101 L 11.749627,9.5811552 Z M 11.513211,8.7015923 10.782669,6.2847554 h -0.05266 L 9.9994652,8.7015923 Z"/>
    <path d="m 4.4987912,13.501168 c 0,0.666666 -1,0.666666 -1,0 V 3.7081678 l -1.146,1.147 c -0.472,0.472 -1.18,-0.236 -0.708,-0.708 l 2,-1.999 0.007,-0.007 c 0.195401,-0.190538 0.507893,-0.18786 0.7,0.006 l 2,2 c 0.471999,0.471333 -0.235001,1.179333 -0.707,0.708 l -1.146,-1.147 z"/>
</svg>);

const font_down_icon=(<svg width="16" height="16" fill="white">
<path d="m 10.681767,9.964243 -0.351556,1.153066 H 9.4336628 L 10.938283,6.6328835 h 1.037844 l 1.497892,4.4844255 H 12.532054 L 12.179658,9.964243 Z M 12.0022,9.3040266 11.453841,7.4899033 h -0.03953 l -0.548359,1.8141233 z"/>
<path d="m 4.4987912,2.4999997 c 0,-0.666666 -1,-0.666666 -1,0 V 12.293 l -1.146,-1.147 c -0.472,-0.472 -1.18,0.236 -0.708,0.708 l 2,1.999 0.007,0.007 c 0.195401,0.190538 0.507893,0.18786 0.7,-0.006 l 2,-2 c 0.471999,-0.471333 -0.235001,-1.179333 -0.707,-0.708 l -1.146,1.147 z"/>
</svg>);

const leftArrowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M3.646 8 9.75 1.896a.5.5 0 1 1 .708.708L4.707 8l5.75 5.396a.5.5 0 1 1-.708.708L3.646 8z"/>
    </svg>
  );
  
  const rightArrowIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M12.354 8 6.25 1.896a.5.5 0 0 1 .708-.708l6.5 6.5a.5.5 0 0 1 0 .708l-6.5 6.5a.5.5 0 1 1-.708-.708L12.354 8z"/>
    </svg>
  );
  
  

export function ChordDashboard(props) {

    const {current_song, update_current_song, current_set_song, update_current_set_song, set_list, update_set_list, font_size, update_font_size, line_height, update_line_height} = useContext(SongContext);

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

    function fontSizeUp() {
        update_font_size(font_size+1);
        update_line_height(line_height+1.2);

    } 
    function fontSizeDown() {
        update_font_size(font_size-1);
        update_line_height(line_height-1.2);

    }

    function nextSong() {
        if (current_set_song < set_list.length-1) {
            update_current_song(set_list[current_set_song+1]);
            update_current_set_song(current_set_song+1);
        }
    }
    function prevSong() {
        console.log(current_set_song);
        if (current_set_song > 0) {
            update_current_song(set_list[current_set_song-1]);
            update_current_set_song(current_set_song-1);
        }
    }
    
    return (
        <div className="box-border flex p-2 bg-ssmblue w-full justify-between">
            <AddSongButton/>
            <div className="m-0 p-0 inline-block text-left text-white ">
                <IconButton handler={prevSong} button_icon={leftArrowIcon} />
                <IconButton handler={nextSong} button_icon={rightArrowIcon}/>
            </div>
            <div className="m-0 p-0 inline-block text-right">
                <IconButton handler={fontSizeUp} button_icon={font_up_icon} color='#0D336A'/>
                <IconButton handler={fontSizeDown} button_icon={font_down_icon} color='#0D336A'/>
                <div id="key_label" className="inline-block align-middle text-base text-white font-light ml-2"> Current Key: </div>
                <div id="key_display" className="inline-block align-middle text-base text-white font-bold w-4 mr-4 py-1 px-2 text-left">{display_key}</div>
                <TransposeButton sign="-" handler={transpose_key_down}/>
                <TransposeButton sign="+" handler={transpose_key_up}/>
                
            </div>

        </div>)

}