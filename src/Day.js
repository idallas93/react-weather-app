import React, { useState, useEffect } from "react";
import "./index.css";

//component rendered for each object included in the filtered array passed down from app.js
const Day = ({
  temperature,
  startTime,
  icon,
  min,
  max,
  number
}) => {
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    setTemp(temperature);
  }, [temperature]);

  return (
    <article className="forecast-info">
      <img src={icon} alt={number}/>
      <div>
        <p className="day">Day and Time: {startTime}</p>
        <p className="current-temp"> Current Temperature: {temperature}</p>
        <p>Daily Low Temp: {min}</p>
        <p>Daily High Temp: {max}</p>
      </div>
    </article>
  );
};

export default Day;
