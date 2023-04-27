import React, { useContext, useState } from "react";
import "./popup.css"
import { GlobalContext } from "../context";
// import { updateCalendar } from "../utils/fetchFunctions";
// import FormRow from './FormRow'
// import {defaultFormState} from "../coDataForm"
import FormContainer from "./FormContainer";


export default function PopUp () {
  const context = useContext(GlobalContext)

  const [editFormVisible, setEditFormVisible] = useState(false)
  // const [formState, setFormState] = useState(Object.keys(context.state.selectedDay).length > 0 ? context.state.selectedDay : defaultFormState)


  // function handleFinishEditing () {
  //   console.log('no more editing', formState)
  //   updateCalendar(formState)
  //   setEditFormVisible(false)
  // }

  function handleClose () {
    setEditFormVisible(false)
    context.setPopup(false)
    context.setSelectedDay({})
  }
  console.log("context.state.selectedDay", context.state.selectedDay)

  if (context.state.popupOpen) {
    return (
      <div className="popup">
        <button className="button" onClick={handleClose}>close</button>
        {Object.keys(context.state.selectedDay).length > 0 ? (
          <div>
            <div>Facilitator: {context.state.selectedDay.facilitator}</div>
            <div>Start-time: {context.state.selectedDay['start-time']}</div>
            <div>End-time: {context.state.selectedDay['end-time']}</div>
            <div>Room Number: {context.state.selectedDay['room']}</div>
          </div>
        )
        : <div> No Open Lab </div>
      }
        {context.state.userData.isAdmin && !editFormVisible && (
          <button className="button" onClick={() => setEditFormVisible(true)}>Edit</button>
        )}
        {editFormVisible && (
          <FormContainer
            disableAddRowButton={true}
            initialFormState={context.state.selectedDay}
            updateOrCreate={Object.keys(context.state.selectedDay) > 0 ? "update" : "create"}
            fetchOnSubmit={true}
          />
          //<button className="button" onClick={handleFinishEditing}>Save Changes</button>
        )}
      </div>
    )
  }
  return <></>

}
