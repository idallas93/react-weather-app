import React, { useState, useEffect } from "react";
import "./index.css";

//component rendered for each object included in the filtered array passed down from app.js

const Week = ({
  temperature,
  endTime,
  startTime,
  icon,
  cityProp,
  stateProp,
  shortForecast,
  detailedForecast,
  windSpeed,
  min,
  number,
  max,
}) => {
  console.log("min", min);
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    setTemp(temperature);
  }, [temperature]);

  return (
    <article className="forecast-info">
      <img src={icon} alt={number} />
      <div>
        <p className="week-day">Day: {startTime}</p>
        <p className="current-temp"> Forecasted Temperature: {temperature}</p>
      </div>
    </article>
  );
};

export default Week;
