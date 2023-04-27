import { useState, useEffect } from "react";
import Alert from './Alert'

import "./Announcements.css";

const AnnouncementTable = () => {
  const [table, setTable] = useState([]);
  const [deleteClicked, setDeleteClicked] = useState({isOpen:false,idx:-1}); // when the user clicks on a button, deleteClicked is updated
  // idx stores the row of the announcement that the delete button belongs to


  useEffect(() => {
    const interval = setInterval(() => { //fetch announcement data every 3 seconds
      fetch("http://localhost:8080/api/announcementTable") //retrieve announcements for announcement table
        .then((response) => response.json())
        .then((data) => setTable(data.reverse())) //reverse the elements so the most recent appear first
        .catch((error) => console.error(error));
    }, 3000); //set interval

    return () => clearInterval(interval); //stop the interval   
  }, []);

  //sends table data to /delete endpoint
  const deleteAnnouncement = async (userid) => {
    return await fetch(`http://localhost:8080/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userid,
      }),
    }).then(() => {
      setDeleteClicked({ isOpen: false, idx: -1 });
      // fetch is done again to update the table, because it won't update without getting the announcement table
      fetch("http://localhost:8080/api/announcementTable")
        .then((response) => response.json())
        .then((data) => setTable(data.reverse().slice()))
        .catch((error) => console.error(error));
    }).catch((error) => console.error(error));
  };
  const submitButton = document.getElementById('submit-button')
    if(deleteClicked.isOpen) {
      document.body.classList.add("active-modal")
      submitButton.style.pointerEvents = "none"}
      else{
        document.body.classList.remove("active-modal")
        if(submitButton){
        submitButton.style.pointerEvents = "auto"}
      }
    
  // the map function is used below to iterate through each announcement in the database and append it to a row, with the title, description, date, and delete button

  //the position for the delete button is set to relative so that it does not dissapear when the Alert component appears 

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, index) => (
              <tr key={row.announcements_id} className="table-item">
                <td>{row.title}</td>
                <td className="text-overflow">{row.description}</td>
                <td>
                  {" "}
                  {new Date(row.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "America/Los_Angeles",
                  })}
                </td>
                <td width="20%" style={{position: 'relative'}}>
                <button
                  className="button"
                  id="delete-button"
                  type="submit"
                  onClick={() => {
                    setDeleteClicked({isOpen: true, idx: index});
                  }}
                >
                Delete
              </button>
              {deleteClicked.isOpen && deleteClicked.idx === index ? (
                <div style={{position: 'absolute', top: '100%', left: 0}}>
            <Alert 
              isOpen={true}
              onClose={() => setDeleteClicked({isOpen:false,idx:-1})}
              title="Delete Announcement" 
              description="Are you sure you want to delete this?"
              confirmBtnLabel="Delete"
              onConfirm={() => deleteAnnouncement(row.announcements_id)}
            />
              </div>
            ) : null}
            </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>      
    </div>
  );
};

export default AnnouncementTable;