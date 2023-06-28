'use client'
import React, {useState, useContext, useEffect} from 'react';
import {LyricContext} from '../media_mode/lyricContext.js';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {splitLyrics} from './export.js'
import { IconButton } from './icon_button.js';

const fullscreen_icon = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white">
<path d="m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z"/>
<path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z"/>
</svg>);

const blackscreen_icon = (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white">
<path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
</svg>);

const font_up_icon =(<svg width="16" height="16" fill="white">
    <path d="M 9.7540852,9.5811552 9.285731,11.117309 H 8.0913186 L 10.095825,5.1430044 h 1.382651 l 1.995543,5.9743046 H 12.219101 L 11.749627,9.5811552 Z M 11.513211,8.7015923 10.782669,6.2847554 h -0.05266 L 9.9994652,8.7015923 Z"/>
    <path d="m 4.4987912,13.501168 c 0,0.666666 -1,0.666666 -1,0 V 3.7081678 l -1.146,1.147 c -0.472,0.472 -1.18,-0.236 -0.708,-0.708 l 2,-1.999 0.007,-0.007 c 0.195401,-0.190538 0.507893,-0.18786 0.7,0.006 l 2,2 c 0.471999,0.471333 -0.235001,1.179333 -0.707,0.708 l -1.146,-1.147 z"/>
</svg>);

const font_down_icon=(<svg width="16" height="16" fill="white">
<path d="m 10.681767,9.964243 -0.351556,1.153066 H 9.4336628 L 10.938283,6.6328835 h 1.037844 l 1.497892,4.4844255 H 12.532054 L 12.179658,9.964243 Z M 12.0022,9.3040266 11.453841,7.4899033 h -0.03953 l -0.548359,1.8141233 z"/>
<path d="m 4.4987912,2.4999997 c 0,-0.666666 -1,-0.666666 -1,0 V 12.293 l -1.146,-1.147 c -0.472,-0.472 -1.18,0.236 -0.708,0.708 l 2,1.999 0.007,0.007 c 0.195401,0.190538 0.507893,0.18786 0.7,-0.006 l 2,-2 c 0.471999,-0.471333 -0.235001,-1.179333 -0.707,-0.708 l -1.146,1.147 z"/>
</svg>);


export function MediaDisplay(props) {

    const {current_lyric} = useContext(LyricContext);
    const [present_window, update_present_window] = useState(null);
    const [black_screen, update_black_screen] = useState(false);
    const [font_size, update_font_size] = useState(6);
    const [line_height, update_line_height] = useState(9);

    var screen_preview;

    //Conversion of font-size from vh (out of 100vh) to rem (out of 16rem), which correspondes to the h-64 tailwind class for the preview box
    var screen_preview_font = {"font-size": (font_size/100*16) + "rem", "line-height": (line_height/100*16)+ "rem"};

    if (black_screen) {
        screen_preview = "whitespace-pre-wrap box-border w-full h-64 bg-black text-black text-center pt-4";
    } else {
        screen_preview = "whitespace-pre-wrap box-border w-full h-64 bg-black text-white text-center pt-4";
    }


    window?.addEventListener("beforeunload", (event) => {
            if (present_window != null) { 
                present_window.close(); 
                update_present_window(null);

            }
    });

    useEffect(() => {  
        if (present_window != null) {                 
            present_window.document.getElementById('displaypresentation_text').innerText = current_lyric;

    }}, [current_lyric]);

    useEffect(() => {
        if (present_window != null) {     
            present_window.document.getElementById('displaypresentation_text').style.fontSize = font_size + "vh";
            present_window.document.getElementById('displaypresentation_text').style.lineHeight = line_height + "vh";            

        }

    })

    function fontSizeUp() {
        update_font_size(font_size+1);
        update_line_height(line_height+1.2);

    } 
    function fontSizeDown() {
        update_font_size(font_size-1);
        update_line_height(line_height-1.2);

    }
    function blackScreen() {

        if (black_screen) {
            if (present_window != null) {
                present_window.document.getElementById('displaypresentation_text').style.opacity = '1';
            }
            update_black_screen(false);

        } else {
            if (present_window != null) {
                present_window.document.getElementById('displaypresentation_text').style.opacity = '0';
            }
            update_black_screen(true);
        }
    }
    function fullScreen() {

        if (present_window == null) {
            let windowobj = window.open("", "worshipwindow", 
            "popup");

            windowobj.document.head.innerHTML = `
            <link rel="stylesheet" type="text/css" href="styles.css">
            <link rel="stylesheet" type="text/css" href="presentation.css">
        `
            windowobj.document.getElementsByTagName("body")[0].style = 
            "padding:0;margin:0;overflow:hidden;"

            windowobj.document.body.innerHTML = `
            <div id="displaypresentation" class='presentation' 
            style="font-family:Century Gothic, Helvetica, serif;
            height:100vh;width:100vw;background:black;overflow:hidden;
            text-align:center;padding-top:6vh;cursor:none;">
            <span id="displaypresentation_text" 
                style="color:white;font-size:${font_size}vh;line-height:${line_height}vh;opacity:1; white-space:pre-line">
                ${current_lyric}
            </span>
            </div>`            

            windowobj.onbeforeunload = () => {update_present_window(null); update_black_screen(false);}
            update_present_window(windowobj);
        
        } else {
            present_window.close();
            update_present_window(null);
            update_black_screen(false);

        }
    }
    return (   
        <div>   
            <div className="box-border p-2 bg-ssmblue w-full">
                <IconButton handler={fullScreen} button_icon={fullscreen_icon} clicked={present_window!=null}/>
                <IconButton handler={blackScreen} button_icon={blackscreen_icon} clicked={black_screen}/>
                <IconButton handler={fontSizeUp} button_icon={font_up_icon}/>
                <IconButton handler={fontSizeDown} button_icon={font_down_icon}/>

            </div>
            <div className={screen_preview} style={screen_preview_font}>
                {current_lyric}
            </div>
        </div>  
    )
}
