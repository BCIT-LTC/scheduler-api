import { useState } from "react";
import { read, utils } from 'xlsx';


export default function useReadSpreadsheet () {
    const [file, setFile] = useState("")
    const [sheetData, setOpenLab] = useState([]);
    const submitHandler = (e) => {
        e.preventDefault()
        readSheet()
    }
    async function readSheet() {
        const f = await file.arrayBuffer();
        const wb = read(f); // parse the array buffer
        const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
        const data = utils.sheet_to_json(ws); // generate objects
        setOpenLab(data); // update state
      }
    
    function changeHandler(e) {
        setFile(e.target.files[0])
    }
    

    return { changeHandler, submitHandler, sheetData }
}