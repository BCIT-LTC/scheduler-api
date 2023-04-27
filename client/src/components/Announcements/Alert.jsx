import React from "react";
import "./Alert.css";

function Alert(props) {
  return (
    <div className="alert">
      <h2 className="alert-title">{props.title}</h2>
      <p className="alert-description">{props.description}</p>
      <div className="alert-buttons">
        <button className="alert-confirm" onClick={props.onConfirm}>
          {props.confirmBtnLabel}
        </button>
        <button className="alert-cancel" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Alert;