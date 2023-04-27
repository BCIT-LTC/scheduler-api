export default function reducer (state, action) {
  switch (action.type) {
    case "setPopup":
      return {
        ...state, popupOpen: action.payload
      }
    case "closePopup":
      return {
        ...state, popupOpen: false
      }
    case "setSelectedDay":
      return {
        ...state, selectedDay: action.payload
      }
    case "updateUser":
      return {
        ...state,
        userData: action.payload.userData,
        isAdmin: action.payload.isAdmin
      }
    default: return state
  }
}
