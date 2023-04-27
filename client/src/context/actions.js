export const actions = (state, dispatch) => ({
  state,
  dispatch,
  setPopup: (open) => {
    dispatch({type:"setPopup", payload:open})
  },
  setSelectedDay: (selectedDay) => {
    dispatch({type:"setSelectedDay", payload:selectedDay})
  },
  updateUserData: (email, token, isAdmin) => {
    dispatch({
      type: "updateUser",
      payload: {
        userData: {
          email,
          token,
          isAdmin
        },
      }
    })
  }
  // ,
  // fetchCalendarData: async () => {

  // }
})
