import { useState, useEffect } from "react";
//loading component to dislay when items are rendering to page
import Loading from "./Loading";
// favorites component that renders local storage or 'favorites' onto the page
import Favorites from "./Favorites";
// day component where data from API related to the daily hourly forcast is rendered
import Day from "./Day";
// week component where data from API related to the seven day forcast is rendered
import Week from "./Week";
// styles for project
import "./index.css";

// npm package installed that returns zipcode based on lat/ long
let zipcodes = require("zipcodes");

function App() {
  //use states for application
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [forecastType] = useState("hourly");
  const [sevenDay, setSevenDay] = useState(false);
  const [city1, setCity1] = useState("");
  const [state1, setState1] = useState("");
  const [favCit, setFavCit] = useState([]);

  let [url, setUrl] = useState("");

  // the following varibales use the zipcode user input and the zipcode npm package to generate information based on lat/ long including zipcode/ city/ and state
  let zipCode = zipcodes.lookup(searchTerm.length === 5 ? searchTerm : "");

  let lat = zipCode ? zipCode.latitude : "";
  let long = zipCode ? zipCode.longitude : "";
  let city = zipCode ? zipCode.city : "";
  let state = zipCode ? zipCode.state : "";

  // handle input for zipcode searchterm
  const handleInput = (event) => {
    setSearchTerm(event.target.value);
  };

  //adding most recently searched city to state to grab later on
  useEffect(() => {
    setCity1(city);
    setState1(state);
  }, [searchTerm]);

  // creates url differently based on set criteria. If the user wants to see an hourly forcast the first endpoint will be created, else (if they want a daily/ hourly forecast) the second endpoint will be created.
  useEffect(() => {
    if (!sevenDay) {
      setUrl(
        `https://api.weather.gov/points/${lat},${long}/forecast/${forecastType}`
      );
    } else {
      setUrl(`https://api.weather.gov/points/${lat},${long}/forecast`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm][sevenDay]);

  const test = url;

  //fetch function to hit endpoint/ get API data (either hourly or weekly)
  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch(test);
      const weather = await response.json();
      setLoading(false);
      setWeather(weather.properties.periods);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  //function to handle local storage, also adds city and state to object based on zipcode the user input
  const setLocalStorage = () => {
    weather.unshift({ place: city1 }, { state: state1 });
    localStorage.setItem(`${city1}`, JSON.stringify(weather));
    if (favCit) {
      setFavCit(JSON.parse(localStorage.getItem(`${city1}`)));
    } else {
      favCit.push(localStorage.getItem(`${city1}`));
    }
  };

  // set variables to break up date format that is included in the response
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  //array of all temperatures for a given day, array needed to calculate daily high and low as it was not provided by the API
  let hourlyTemps = [];

  // function to create an array, hourly temps, to figure out daily high and low
  const dailyHigh = () => {
    if (!sevenDay && searchTerm.length === 5) {
      weather
        .filter((tempHour) => tempHour.startTime)
        .map((hourTemp) => {
          // console.log('our-temp', hourTemp)
          var dt = hourTemp.startTime.split(/[: T-]/).map(parseFloat);
          // console.log('dt', dt[2])
          // console.log('hour temp', hourTemp.temperature)
          if (hourlyTemps.length === 0 && dt[2].toString() === dd.toString()) {
            hourlyTemps = [parseInt(hourTemp.temperature)];
          } else if (dt[2].toString() === dd.toString()) {
            hourlyTemps.push(parseInt(hourTemp.temperature));
          }
        });
      return hourlyTemps;
    }
  };

  dailyHigh();

  // set hightemp and lowtemp as daily high/ low
  const highTemp = searchTerm.length === 5 ? Math.max(...hourlyTemps) : "";
  const lowTemp = searchTerm.length === 5 ? Math.max(...hourlyTemps) : "";

  let favorites = [];

  //loop through local storage and convert from string (local storage format) to object
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    favorites.push(JSON.parse(localStorage.getItem(key)));
  }

  //render loading page
  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  //render hourly forcast
  if (favCit && !sevenDay) {
    return (
      <article className="App-header">
        <div>
          <h1> Weather Application</h1>
          <p> Search local weather by zipcode</p>

          <input
            className="zip-input"
            type="text"
            placeholder="Enter five-digit zipcode"
            value={searchTerm}
            onChange={handleInput}
          ></input>
          <div className="btn-container">
            <button className="btn" onClick={() => setSevenDay(false)}>
              {" "}
              Hourly forecast{" "}
            </button>
            <button className="btn" onClick={() => setSevenDay(true)}>
              {" "}
              Daily forecast{" "}
            </button>
          </div>
        </div>
        <p>
          {city1} {state1}
        </p>
        <div>
          <h1>Favorites</h1>
          {/* map through favorites array and slice to return only the city/ state values */}
          {favorites.map(function (subarray) {
            return subarray.slice(0, 1).map(function (weathers) {
              return (
                <Favorites
                  Key={weathers.number}
                  {...weathers}
                  max={highTemp}
                  min={lowTemp}
                ></Favorites>
              );
            });
          })}
        </div>
        <button
          className="btn"
          onClick={() => {
            setLocalStorage();
          }}
        >
          Add favorite
        </button>
        <div className="favorites-list"></div>
        <div>
          {/* filter through array to only include valid objects in Day component */}
          {weather
            .filter(function (todaysWeather) {
              if (!todaysWeather.startTime) {
                return false;
              }
              // make sure to only include hourly forecasts for today 
              let dt2 = todaysWeather.startTime
                .toString()
                .split(/[: T-]/)
                .map(parseFloat);
              return dt2[2].toString() === dd.toString();
            })
            //map required information to day component 
            .map((todaysWeather) => {
              return (
                <Day
                  key={todaysWeather.number}
                  {...todaysWeather}
                  max={highTemp}
                  min={lowTemp}
                ></Day>
              );
            })}
        </div>
      </article>
    );
  }

  //render daily forcast
  return (
    //code similar to hourly forecast, slightly different to accomodate for differences in the weekly forecast array of objects
    <article className="App-header">
      <div>
        <h1> Weather Application</h1>
        <p> Search local weather by zipcode</p>
        <input
          className="zip-input"
          type="text"
          placeholder="Enter five-digit zipcode"
          value={searchTerm}
          onChange={handleInput}
        ></input>
        <div className="btn-container">
          <button className="btn" onClick={() => setSevenDay(false)}>
            {" "}
            Hourly forecast{" "}
          </button>
          <button className="btn" onClick={() => setSevenDay(true)}>
            {" "}
            Daily forecast{" "}
          </button>
        </div>
      </div>
      <p>
        {city1} {state1}
      </p>
      <div>
        <h1> Favorites </h1>
        {favorites.map(function (subarray) {
          return subarray.slice(0, 1).map(function (weathers) {
            return (
              <Favorites
                Key={weathers.number}
                {...weathers}
                max={highTemp}
                min={lowTemp}
              ></Favorites>
            );
          });
        })}
      </div>
      <button
        className="btn"
        onClick={() => {
          setLocalStorage();
        }}
      >
        Add favorite
      </button>
      <div className="favorites-list"> </div>
      <div>
        {weather
          .filter((tempTest) => tempTest.startTime)
          .map((daily) => {
            return <Week key={daily.number} {...daily}></Week>;
          })}
      </div>
    </article>
  );
}

export default App;
