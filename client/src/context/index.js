import { createContext, useMemo, useReducer } from "react";
import { initialState } from "./initialState";
import reducer from "./reducer";
import { actions } from "./actions";

export const GlobalContext = createContext(undefined)

export default function ContextProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => {
    return { ...actions(state, dispatch) }
  }, [state])

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}
