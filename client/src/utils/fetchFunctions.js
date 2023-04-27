export function updateCalendar (forms, updateOrCreate) {
  return fetch(`http://localhost:8080/api/${updateOrCreate === "create" ? "updateCalendar" : "updateOpenLabDay"}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({forms})
  })
}

export function fetchCalendar (month) {
  return fetch("http://localhost:8080/api/getMonth", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({month})
    }).then((results) => {
      if (results.status === 200) {
        return results.json()
      }
    })
}
