
import "./formrow.css";

export default function FormRow ({ formNumber, forms, setForms, errorState = false, errorType}) {

  function handleUpdateForm (field, value) {
    const newForms = [...forms]
    newForms[formNumber] = {...newForms[formNumber], [field]: value }
    setForms(newForms)
  }
  console.log("forms, form number", forms, formNumber, forms[formNumber]?.date)

  return (
    <form className={`data-form ${errorState ? "data-form--error" : ""}`}>
      <div className="data-form__inputs">
        <div className={(errorType.includes("Same Date") && "data-form__inputs--error") || ""}>
          <label htmlFor="date">date</label>
          <input
            name="date"
            type="date"
            value={forms[formNumber]?.date ? new Date(forms[formNumber].date).toISOString().split("T")[0] : undefined}
            onChange={(e) => handleUpdateForm('date', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="start-time">start time</label>
          <input
            name="start-time"
            type="time"
            value={forms[formNumber]?.['start-time']}
            onChange={(e) => handleUpdateForm('start-time', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-time">end time</label>
          <input
            name="end-time"
            type="time"
            value={forms[formNumber]?.['end-time']}
            onChange={(e) => handleUpdateForm('end-time', e.target.value)}
          />
        </div>
        <div className={(errorType.includes("No Facilitator") && "data-form__inputs--error") || ""} >
          <label htmlFor="facilitator">facilitator</label>
          <input
            name="facilitator"
            type="text"
            value={forms[formNumber]?.facilitator}
            onChange={(e) => handleUpdateForm('facilitator', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="stat">stat</label>
          <input
            name="stat"
            type="checkbox"
            value={forms[formNumber]?.stat}
            onChange={(e) => handleUpdateForm('stat', e.target.value)}
          />
        </div>
        <div className={(errorType.includes("No Room") && "data-form__inputs--error") || ""}>
          <label htmlFor="room">room number</label>
          <input
            name="room"
            type="text"
            value={forms[formNumber]?.['room']}
            onChange={(e) => handleUpdateForm('room', e.target.value)}
          />
        </div>
      </div>
    </form>
  )
}
