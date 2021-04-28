import React from "react";
import "./index.css";

//component to display favorite when favorite is added and the favorite button is clicked.
const Subfavorite = ({ startTime, icon, temperature, max, number, min }) => {
  return (
    <article className="forecast-info">
      <img src={icon} alt={number} />
      <div>
        <p className="day">Day and Time: {startTime}</p>
        <p className="current-temp"> Current Temperature: {temperature}</p>
        <p>Daily Low Temp: {min}</p>
        <p>Daily High Temp: {max}</p>
      </div>
    </article>
  );
};

export default Subfavorite;
