import React from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import pdf from '../../openLab-pdf/Guidelines.pdf'
import {useState} from 'react'

export default function Home(){
    const isAdmins = sessionStorage.getItem("isAdmins");
    // const handlePDF = () => {
    //     const iframe = document.createElement('iframe');
    //     iframe.setAttribute('src',pdf)
    //     document.body.appendChild(iframe);
    // }
    const [showPDF, setShowPDF] = useState('');
    const handlePDF = () => {
        setShowPDF(pdf);
    }

    return(
        <>
        <h2 className="heading">BCIT BSN Program</h2>
        <div className="buttons">
            <Link className="button" to="/calendar"><img src="./calendar-icon.png" alt=""/>Calendar</Link>
            {isAdmins && <Link className="button" to="/update"><img src="./update-icon.png" alt=""/>Update Calendar</Link>}
            <Link className="button" to="/survey"><img src="./survey-icon.png" alt=""/>Survey</Link>
            <a className="button" href="https://rise.articulate.com/share/5W_xAmCkleiWUwsk5-6InC4YFvvB0R7p" >
            <img src="./casestudies-icon.png" alt=""/>Case Studies</a>
            {/* <button className="button" onClick={handlePDF}>Open Lab Guidelines</button> */}
            <a className="button" href={showPDF} onClick={handlePDF}><img src="./guidelines-icon.png" alt=""/>Open Lab Guidelines</a>
            {isAdmins && <Link className="button" to="/announcements"><img src="./announcements-icon.png" alt=""/>Create Announcements</Link>}
        </div>
        </>
    );
}
