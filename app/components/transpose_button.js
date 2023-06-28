'use client'
import React from 'react'

export function TransposeButton(props) {

    if (props.sign == '+') {
        var svg_path = <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>;
        var transpose_no = 1;
    } else {
        var svg_path = <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>;
        var transpose_no = -1;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg"data-direction="transpose_no" className="inline-block align-middle w-6 h-6 m-1 p-1 fill-white bg-ssmbluenight rounded-sm cursor-pointer hover:bg-ssmblue400" onClick={props.handler} >
            {svg_path}
        </svg>
    )

}