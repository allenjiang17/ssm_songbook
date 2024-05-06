'use client'
import {useContext} from 'react';
import {SongContext} from '../song_context.js';

export function SongDisplay(props) {
    const {current_song, update_current_song, current_set_song, set_list, update_set_list, font_size, update_font_size, line_height, update_line_height} = useContext(SongContext);
    
    //Conversion of font-size from vh (out of 100vh) to rem (out of 16rem), which correspondes to the h-64 tailwind class for the preview box
    var screen_preview_font = {"font-size": (font_size/100*16) + "rem", "line-height": (line_height/100*16)+ "rem"};
    
    function change_sheet(event) {
        //perform copy of current_song object
        if (current_song != undefined) {
            var new_song = JSON.parse(JSON.stringify(current_song));
            new_song.sheet = event.target.value;
            update_current_song(new_song);

            var new_set_list = JSON.parse(JSON.stringify(set_list));
            new_set_list[current_set_song] = new_song;
            update_set_list(new_set_list);
        }
    }

    const style = "box-border w-full font-mono text-sm m-0 p-8 rounded-none border-solid border-2 dark:bg-gray-900 dark:border-none " + props.window_height;

    let display = "";
    if (props.song !== undefined) {
        display = props.song.sheet;
    }
        return (
            <textarea className={style} style={screen_preview_font} value={display} onChange={change_sheet}></textarea>
        )

}