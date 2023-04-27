import "./calendar-day.css"

export default function CalendarDay ({ date, data }) {

  /*
  day:3
  end time: 0.4791666666666667
  facilitator: "Jasica"
  month: "feb"
  room number: 3020
  start time: 0.3541666666666667
  __rowNum__: 1
  */
//console.log("what is data", data, date)
  return (
    <div className="calendar-day">
      { data ? (
          <div className="lab">
          </div>
        )
      : (
        <div className="no-lab" />
      )}
    </div>
  )
}
