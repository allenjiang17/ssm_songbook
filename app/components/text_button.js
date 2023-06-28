'use client'

import React from 'react';

export function TextButton(props) {

    return(
        <button className={"box-border inline-block font-semibold text-white text-sm px-2 py-1 ml-3 bg-ssmblue800 rounded-md hover:bg-ssmbluenight active:bg-ssmbluenight " + props.add_classes}
        onClick={props.handler}>{props.button_text}</button>
      )
}