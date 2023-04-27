import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PopUp from '../components/PopUp';
import CalendarDay from '../components/CalendarDay';
import React, { useState, useEffect, useContext, useRef } from "react";
import { GlobalContext } from '../context';
import { fetchCalendar  } from '../utils/fetchFunctions';


export default function CalendarPage() {
  const Context = useContext(GlobalContext);
  const [month, setMonth] = useState(new Date())
  const [ filteredSheetData, setFilteredSheetData ] = useState([])
  const matchedDates = useRef({})

  async function fetchData() {
    const response = await fetchCalendar(month.getMonth() + 1)
    console.log("what is response", response)
    setFilteredSheetData(response.results)
    matchedDates.current = {}
  }
  useEffect(() => {
    // calendar month button is buggy. this prevents it from being used
    const calendarMonthLabel = document.querySelector('.react-calendar__navigation button.react-calendar__navigation__label')
    calendarMonthLabel.setAttribute('tabindex', -1)
    calendarMonthLabel.style.pointerEvents = 'none'

  }, [])

  useEffect(() => {
    console.log("month changed")
    fetchData()
  }, [month])

  // useEffect(() => {
  //   if (dummyData.length > 0) {
  //     setFilteredSheetData(dummyData.filter((openLab) => {
  //       return new Date(openLab.date).getUTCMonth() === month.getMonth()
  //     }))
  //   }
  //   // eslint-disable-next-line
  // }, [dummyData, month])

  function handleActiveStartDateChange ({activeStartDate}) {
      console.log("properties.activestartdate", activeStartDate.getMonth())
    setMonth(activeStartDate)
  }

  return (
    <div className="App">
      <Calendar
        onActiveStartDateChange={handleActiveStartDateChange}
        value={month}
        onClickDay={(date, event) => {

          const selectedDay = matchedDates.current[date.toISOString()]
          console.log("selected dayyy", selectedDay)
          if (selectedDay) {
            Context.setSelectedDay(selectedDay)
          }
          Context.setPopup(!Context.state.popupOpen)
        }}
        showNeighboringMonth={false}
        tileDisabled={({ activeStartDate, date, view }) => {
          return date.getDay() === 0 || date.getDay() === 6
        }}
        tileContent={({ date, view }) => {
          let matchingDay
          //console.log("date, month", date, month)
          if (filteredSheetData && filteredSheetData.length > 0) {
            matchingDay = filteredSheetData.find((openLab) => {
              return date.getDate() === new Date(openLab.date).getUTCDate()
            })
            if (matchingDay) {
              console.log("matching day", matchingDay)
              // store matched dates for the month in an object to make looking up a clicked day faster
              matchedDates.current = {
                ...matchedDates.current,
                [date.toISOString()]: matchingDay
              }
            }

          }
          return <CalendarDay date={date} data={matchingDay} />
        }}
      />
      <PopUp />
    </div>
  )
}
