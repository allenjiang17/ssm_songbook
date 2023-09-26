'use client'
import React, {useState, useEffect} from 'react';
import {SongContext} from '../song_context.js';
import {useContext} from 'react';
import { TextButton } from './text_button.js';
import {Popup} from 'reactjs-popup';
import { useUser, useOrganizationList } from '@clerk/nextjs';

import * as docx from 'docx'
import * as jspdf from 'jspdf'
import PptxGenJS from 'pptxgenjs'

export function ExportInterface(props) {
  //user auth
  const {isLoaded, isSignedIn, user} = useUser();
  var can_edit, guest;
  if (isLoaded && isSignedIn) {
    //can_edit = props.edit_list.includes(user?.id);
    can_edit = user?.publicMetadata['edit_privileges'];

    if (can_edit) {
      console.log("User has edit privileges")
    } else {
      console.log("User has no edit privileges")
    }
  } else {
    guest = true;
    can_edit = false;
  }

  //state variables
    const {set_list} = useContext(SongContext);
    const [popup_open, set_popup_open] = useState(false);
    const [save_set_name, set_save_set_name] = useState();
    const closePopup = () => set_popup_open(false);

    //hide export button if set is 0
    var export_button_style;
    if (set_list.length == 0) {
       export_button_style = "hidden";

    } else {
       export_button_style = "";
    }

    //create default set name
    var today = new Date();
    var date = String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0') + String(today.getFullYear()).substring(2);
    var write_name = 'set' + date;

    useEffect(()=>{
      set_save_set_name(write_name);
    },[]);

    function downloadSet() {

        var list_of_songs = set_list;
        const dtype = document.getElementById("export_select").value;
    
        if (dtype == "pdf") {
            let songstringlist = [];
            for(let i=0; i<list_of_songs.length; i++) {
                songstringlist[i] = list_of_songs[i].sheet;
            }
            downloadToPDF(songstringlist, write_name + '.pdf')
        } else if (dtype == "ppt") {
            let export_songs = []
            for (let i=0; i<list_of_songs.length; i++) {
                export_songs[i] = list_of_songs[i].lyrics;
            }
            downloadToPPT(export_songs, write_name +'.pptx');
        } else if (dtype == "text") {
            var intro_string = "PREPARE YOUR SET USING THE FOLLOWING:\n 1. Use a " + 
            "monospaced font to ensure spacing is right (e.g Courier)\n 2. Select " + 
            "all the set and format into two columns\n 3. Add page breaks into " + 
            "between songs\n";
            var export_string = "";
    
            for (let i=0; i<list_of_songs.length; i++) {
              export_string = export_string + "\n" + list_of_songs[i].sheet;
            }
            export_string = intro_string + export_string;
            downloadToTextFile(export_string, write_name + '.txt', 'text/plain');
        } else if (dtype == "docx") {
            let songstringlist = [];
            for(let i=0; i<list_of_songs.length; i++) {
                songstringlist[i] = list_of_songs[i].sheet;
            }
            downloadDocx(songstringlist, write_name + '.docx')
        } 
    }

    function openExportModal(){
      set_popup_open(o=>!o);
    }

    async function saveSetToDb(){

      if (guest) {window.alert("Please sign-in to save sets to the online database"); return}
      if (!can_edit) {window.alert("User has no permission to save sets online"); return}

      var response = await fetch('/api/save_set_to_mongo_db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({set_name: save_set_name, set_author: user.fullName, set_list: set_list, set_date: date})
        });

    console.log(response);
    closePopup();
    }

    function handleInputChange(event){
      set_save_set_name(event.target.value);
    }
    return(
        <div>
            <TextButton handler={openExportModal} button_text={"Export Set"} add_classes={export_button_style}/>

            <Popup open={popup_open} onClose={closePopup}>
            <div className="box-border bg-gray-100 rounded-md p-5 drop-shadow-lg dark:bg-gray-700">
            <div className="flex justify-between">
              <p className = "inline-block mb-2 text-lg font-semibold">Export Set</p>
              <img src= "./x-lg.svg" className="inline-block h-fit ml-1 hover:bg-gray-300" onClick={closePopup}/>
            </div>
            <div className="mb-2">
              <p className = "mb-2 text-sm font-semibold">Save Set Online</p>
                <input className="text-sm p-1 dark:bg-gray-800" value={save_set_name} onChange={handleInputChange}/>
                <TextButton handler={saveSetToDb} button_text={"Save"}/>
            </div>
            <div className="mb-2">
            <p className = "mb-2 text-sm font-semibold">Download Set as File</p>
              <select defaultValue="" name="export_select" id="export_select" className="box-border min-w-fit text-xs p-2 border-b border-gray-300 focus:outline-gray-300 focus:border-gray-300 dark:bg-gray-800">
                  <option value="" disabled>Export Set</option>
                  <option value="docx">Word Doc</option>
                  <option value="pdf">PDF</option>
                  <option value="ppt">Powerpoint (Media Slides)</option>
                  <option value="text">Plain Text</option>
              </select>
              <TextButton handler={downloadSet} button_text={"Download"}/>
              </div>
            </div>
            </Popup>

        </div>

        
    )

}

//from https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
const downloadToTextFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(a.href);
};

/**
 * Formats and prints lines to a pdf page
 * returns remaining unprinted lines
 */
function printPage(songlines, doc) {
  let tmp = songlines;
  while(tmp[0].trim() == "") { tmp.shift(); }
  doc.text(tmp.slice(0, 68).join('\n'), 15, 15)
  if(tmp.length > 69) {
    tmp = tmp.slice(0, 136);
    if(tmp.every(line => line.length < 45)) { 
      // All lines fit in one column
      doc.text(tmp.slice(68, 136).join('\n'), 110, 15)
      if(tmp.length > 136) {
        tmp = tmp.slice(136);
        while(tmp[0].trim() == "") { tmp.shift(); }
        if(tmp.length > 0) { 
          doc.addPage()
          return tmp;
        }
      }
    } else {
      tmp = tmp.slice(68);
      while(tmp[0].trim() == "") { tmp.shift(); }
      if(tmp.length > 0) { 
        doc.addPage()
        return tmp;
      }
    }
  }
  return [];
}

const downloadToPDF = (contentlist, filename) => {
    var doc = new jspdf.jsPDF();
    doc.setFont("SourceCodePro-Regular", "normal");
    doc.setFontSize(10);
    for (let i=0; i<contentlist.length; i++) { // Iterate through set list
        let songlines = contentlist[i].split("\n");
        while(songlines.length > 0) {
            songlines = printPage(songlines, doc);
        }
        if(i + 1 < contentlist.length) {
            doc.addPage()
        }
    }
    doc.save(filename)
};

const downloadToPPT = (content, filename) => {
    var pres = new PptxGenJS();
    for (let i=0; i<content.length; i++) {
        var lyrics = splitLyrics(content[i])
        for (let j=0; j<lyrics.length; j++) {
            var slide = pres.addSlide();
            slide.background = { color: "111111" }; 
            slide.addText(lyrics[j], {
                align: "center", 
                color: "FFFFFF", 
                fontFace: "Georgia",
                fontSize: 30,
                lineSpacing: 45,
                // Default 16x9 size is 10 x 5.625 in
                x: 0.75, // slide width minus text width divided by 2
                y: 0.75,
                h: 4.125,
                w: 8.5,
            });
        }
    }
    pres.writeFile({ fileName: filename });
};

function downloadDocx(content, filename) {
  let paragraphlist = [];
  content.forEach((song, index) => {
    song = song.split('\n');
    if(index > 0) {
      paragraphlist.push(new docx.Paragraph({children: [new docx.PageBreak()], }))
    }
    for(const line of song) {
      paragraphlist.push(new docx.Paragraph({children: [ 
        new docx.TextRun({text: line, font: "Courier New"}), 
      ],}))
    }
  });
  const doc = new docx.Document({
    sections: [{
          properties: {column: new docx.Columns({count: 2})},
          children: paragraphlist,
          }]
  });
  
  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    const a = document.createElement('a');
    a.href= URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    console.log("Document created successfully");
  });
}

/* Splits lyrics string into multiple chunks based on newlines
 *
 * @return list of strings
 */
export function splitLyrics(lyrics) {
    lyrics = lyrics.split('\n')
    lyrics.push('') // add empty string so no need for ending statement
    var nlyrics = new Array();
    var currlyric = "";
    var empty = true;
    for (let i=0; i < lyrics.length; i++) {
        var l = lyrics[i].trim()
        var regex = [
            '^\\[.*\\]$',
            '^TEMPO:',
            '^NOTE',
            '^Verse.*:',
            '^Chorus.*:',
            '^Bridge.*:'
        ]
        var re = new RegExp(regex.join('|'), 'i')
        if(re.test(l)) { l = "" }
        if(l) {
            l = l.replace(/AUTHOR:/i, '')
            if(empty) {
                currlyric = l
            } else {
                currlyric = currlyric + '\n' + l
            }
            empty = false
        } else if(!empty){
            nlyrics.push(currlyric)
            currlyric = "";
            empty = true
        }
    }
    return nlyrics;
}
