import { useState } from "react";
import FormRow from '../components/FormRow'
import { updateCalendar, fetchCalendar } from "../utils/fetchFunctions";
import "./form-container.css"

export const defaultFormState = {
  date: '',
  'start-time': '',
  'end-time': '',
  facilitator: '',
  stat: 0,
  room: ''
}

const errorMap = {
  "Same Date": "You have two open labs scheduled for the same day",
  "No Facilitator": "All open labs must have a facilitator",
  "No Room": "All open labs must have a room number"
}

export default function FormContainer ({ disableAddRowButton = false, initialFormState, updateOrCreate = "create", fetchOnSubmit = false }) {
  console.log("initial form state", initialFormState)
  const [numberOfRows, setNumberOfRows] = useState(1)
  const [forms, setForms] = useState([initialFormState ? {...initialFormState} : { ...defaultFormState}])
  const [formErrorState, setFormErrorState] = useState(false)
  const [errorType, setErrorType] = useState([])


  async function handleSubmit() {
    const noDatesAreTheSame = (forms.length === 1 && forms[0].date) || forms.every((f, i) => {
      const current = forms.slice(i+1)
      return !Boolean(current.filter((c) => c.date === f.date).length > 0)
    })
    const allRoomNumbersAreFilled = forms.every((f, i) => {
      return Boolean(f.room)
    })
    const allRowsHaveFacilitator = forms.every((f, i) => {
      return Boolean(f.facilitator)
    })
    if (
      noDatesAreTheSame && allRoomNumbersAreFilled && allRowsHaveFacilitator
    ) {
      if (updateOrCreate === "update") {
        forms[0].calendar_id = initialFormState.calendar_id
      }
      // temporary fix
      if (!('stat' in forms[0])) forms[0].stat = 0
      await updateCalendar(forms, updateOrCreate)

      //CLEAR FORMS
      setForms([{...defaultFormState}])
      setNumberOfRows(1)
      setFormErrorState(false)
      setErrorType([])
      const allDateInputs = document.querySelectorAll("input[type=date]")
      if (allDateInputs.length > 0) [...allDateInputs].forEach((input) => {
        input.value = ""
      })
      // if (fetchOnSubmit) {

      // }
    } else {
      const newErrorType = []
      if (!noDatesAreTheSame) newErrorType.push("Same Date")
      if (!allRoomNumbersAreFilled) newErrorType.push("No Room")
      if (!allRowsHaveFacilitator) newErrorType.push("No Facilitator")
      setFormErrorState(true)
      setErrorType(newErrorType)
    }
  }

  function handleAddRow () {
    setForms([...forms, { ...defaultFormState}])
    setNumberOfRows(numberOfRows + 1)
  }

  function renderErrorMsg () {
    return errorType.map((e, index) => {
      return <div key={index}>{errorMap[e]}</div>
    })
  }
  return (
    <>
      {Array.from(Array(numberOfRows).keys()).map((_, i) => (
        <FormRow
          setForms={setForms}
          forms={forms}
          formNumber={i}
          errorState={formErrorState}
          key={i}
          errorType={errorType}
        />
      ))}
      {!disableAddRowButton && <button onClick={handleAddRow}>+</button>}
      <button onClick={handleSubmit}>Submit</button>
      {errorType && <div>{renderErrorMsg()}</div>}
    </>
  )
}
