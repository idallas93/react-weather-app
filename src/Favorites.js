import React, { useState, useEffect } from "react";
import Subfavorite from "./Subfavorite";
import "./index.css";

//place, min, and max values passed down from App.js
const Favorites = ({ place, min, max }) => {
  //set state, is favorite to start as boolean value flse
  const [isFavorite, setFavorite] = useState(false);
//create empty array called favorites2
  let favorites2 = [];
  //loop through local storage
  for (let i = 0; i < localStorage.length; i++) {
    let key2 = localStorage.key(i);
    favorites2.push(JSON.parse(localStorage.getItem(key2)));
  }
//function to change isFavorite state, passed to an onclick function later on
  const renderFavorite = () => {
    setFavorite(!isFavorite);
  };

//if state is false show this
  if (!isFavorite) {
    return (
      <div className="favorites">
        <button className="btn" onClick={renderFavorite}>
          {place}
        </button>
      </div>
    );
  }

  //if state is true show this
  if (isFavorite) {
    return (
      <div>
        <div className="favorites">
          <button className="btn" onClick={renderFavorite}>
            {place}
          </button>
        </div>
        {/* map over fabvorites2 array and filter to return relevant values*/}
        {favorites2.map((subarray2) => {
          if (subarray2[0].place === place) {
            return subarray2
              .filter((dailyFilter) => dailyFilter.number < 24)
              .map((weathers2) => {
                return (
                  //mapping values to the subfavorites compenent to render data saved to local storage to page
                  <Subfavorite
                    key={weathers2.number}
                    {...weathers2}
                    max={max}
                    min={min}
                  ></Subfavorite>
                );
              });
          }
        })}
      </div>
    );
  }
};

export default Favorites;
