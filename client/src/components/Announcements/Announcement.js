import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./Announcements.css";
import AnnouncementTable from "./AnnouncementTable";
import Submission from './Submission';



const Announcement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submit, setSubmit] = useState(false) // for submission window component
  
  let date = new Date();
  const [count, setCount] = useState(0);  
  const timezone = date.getTimezoneOffset() * 60000;
  const datetime = new Date(Date.now() - timezone).toISOString().slice(0, 19).replace("T", " ");
  
  const counter = (e) => {
    setCount(e.target.value.length);
  };

  function submitClick() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    ;

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    return await fetch("http://localhost:8080/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, date: datetime }),
    }).then((response) => response.json(),
    setSubmit(true)

    );

  };
  const submitButton = document.getElementById('submit-button')
  const buttons = document.querySelectorAll('.button'); //refers to button class from AnnouncementTable

  if (submit) {
    document.body.style.overflowY = "hidden";
    submitButton.setAttribute("disabled", true)
    buttons.forEach(button => {
      button.disabled = true;

    });
    // Perform the click action here
  ;
  } else {
    document.body.style.overflowY = "auto";
    if (submitButton) {
      submitButton.removeAttribute("disabled");
      buttons.forEach(button => {
        button.disabled = false;
      });

    }
  }

  

  return (
    <div>
      <div className="announcement-wrapper">

        <form
          className="form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <h2>Create Announcement</h2>
          <label>
            <p>Title</p>
            <input id="title" type="text" onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <p>Description</p>
            <p className="coun  t">{`${count}/200 Characters`}</p>
            <textarea
              id="description"
              type="text"
              maxlength="200"
              onChange={(e) => {
                setDescription(e.target.value);
                counter(e);
              }}
            />
          </label>
          <div className="submit-button">
            
          <button id="submit-button" type="submit" onClick={submitClick}>
                SUBMIT
              </button>
          </div>
        </form>
        <div>
          <h3>List of Announcements</h3>
          <AnnouncementTable />

        </div>
        <Submission trigger={submit} setTrigger={setSubmit}
        isOpen={submit}
        onClose={() => setSubmit(false)}
        title="Announcement Created"
        />

      </div>
    </div>
  );
};

export default Announcement;
