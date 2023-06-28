import React, {useState, useContext, useEffect} from 'react';


export function MediaFullScreenWindow() {

    return (
    <div className="h-screen w-screen bg-black overflow-hidden text-center pt-6 cursor-none">
    <span className="text-white text-6xl leading-9 opacity-100">
        props.lyrics
    </span>
  </div>)



}