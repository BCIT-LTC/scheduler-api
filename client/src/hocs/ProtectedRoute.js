import React, { useContext } from "react";
import { Navigate } from "react-router-dom"
import { GlobalContext } from "../context";

export default function ProtectedRoute ({ children }) {
  const {
    state: {
      userData: { isAdmin },
    },
  } = useContext(GlobalContext);

  if (isAdmin) {
    return children
  }
  return <Navigate to="/" replace />
}
