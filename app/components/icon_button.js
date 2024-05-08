'use client'

import React from 'react';

export function IconButton(props) {
  if (props.clicked) {
      return(
        <button className="inline-block align-middle p-2 mx-1 bg-ssmblue800 rounded-sm cursor-pointer hover:bg-ssmbluenight" 
        onClick={props.handler}>{props.button_icon}</button> 
      )
  } else {
        return(
        <button className="inline-block align-middle p-2 mx-1 bg-ssmblue300 rounded-sm cursor-pointer hover:bg-ssmblue400" 
          onClick={props.handler} style={{ backgroundColor: props.color }}>{props.button_icon}</button>

        )
  }

}