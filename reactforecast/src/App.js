import React from "react";
import WeatherData from "./WeatherData";
import {
  apikey,
  foreCastUrl,
  realTimeUrl,
  cityToLatLon,
  latLonToCity,
  apiNinjaKey,
} from "./apiKeys";

class App extends React.Component {
  state = {
    location: "",
    date: "",
    lat: "", 
    lon: "",
    realTime: null,
    forecast: null,
    currentMenu: "home",
    selected:"",
     data: "",
  };

  async componentDidMount() {
    try {
      const locationData = await this.getUserLocation();
      if (locationData) {
        const city = await this.getUserCity(locationData.lat, locationData.lon);
        this.setState({
          location: city,
          lat: locationData.lat,
          lon: locationData.lon,
        });
      }
    } catch (error) {
      alert(error);
    }
  }

  //get the user city from the lat-lon data api from api-ninja
  getUserCity = async (lat, lon) => {
    // const proxy = 'https://proxy.cors.sh/';
    const url = `${latLonToCity}?lat=${lat}&lon=${lon}`;
    const response = await fetch("http://localhost:3001/getcityfromcoord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        header: "X-Api-Key",
        api: apiNinjaKey,
      }),
    });
    const jsonData = await response.json();
    const city = jsonData[0].name ? jsonData[0].name : "unknown";
    return city;
  };

  //Get the users current location(with permissions)
  getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ lat: latitude, lon: longitude });
          },
          (error) => {
            reject(
              "You have disabled location service. Allow 'ReactForecast' to access your location. Your current location will be used for calculating Real time weather."
            );
          }
        );
      } else {
        reject("Geolocation not available");
      }
    });
  };

  handleLocationChange = (event) => {
    this.setState({ location: event.target.value });
  };

  handleDateChange = (event) => {
    this.setState({ date: event.target.value });
  };

  // Add your API calls in these methods
  getRealTimeTemp = async () => {
    // API call to get real-time temperature
    let url;

    //if the user has denied the location permissions then we will be getting the weather details based on the location input by the user

      if(!this.state.lat && !this.state.lon){
      url = `${realTimeUrl}?location=${this.state.location}&apikey=${apikey}`
      const weatherData = await fetch(url, {
        method: 'GET'
      });
      const data = await weatherData.json();
      
      this.setState({
        data: data,
        selected: 'realtime',
        currentMenu: 'weatherdata'
      })
      }
      //User has accepted user access permissions so we will show data based on the lat and lon
      else{
        url = `${realTimeUrl}?location=${this.state.lat},${this.state.lon}&apikey=${apikey}`
        const weatherData = await fetch(url, {
          method: 'GET'
        });
        const data = await weatherData.json();
        
        this.setState({
          data: data,
          selected: 'realtime',
          currentMenu: 'weatherdata'
        })
      }
      


  };

  getForecastTemp = async () => {
    // API call to get forecasted temperature
    // const url = `${foreCastUrl}?location=${this.state.lat},${this.state.lon}&apikey=${apikey}`;

    let url;

    //if the user has denied the location permissions then we will be getting the weather details based on the location input by the user
      if(!this.state.lat && !this.state.lon){
      url = `${foreCastUrl}?location=${this.state.location}&timesteps=1d&apikey=${apikey}`
      const weatherData = await fetch(url, {
        method: 'GET'
      });
      const data = await weatherData.json();
      
      this.setState({
        data: data,
        selected: 'forecast',
        currentMenu: 'weatherdata'
      })
      }
      //User has accepted user access permissions so we will show data based on the lat and lon
      else{
        url = `${foreCastUrl}?location=${this.state.lat},${this.state.lon}&timesteps=1d&apikey=${apikey}`
        const weatherData = await fetch(url, {
          method: 'GET'
        });
        const data = await weatherData.json();
        
        this.setState({
          data: data,
          selected: 'forecast',
          currentMenu: 'weatherdata'
        })
      }
      

  };

  renderRealTimeAndForecast() {
    if(this.state.selected === 'realtime')
    {
      return <WeatherData data={this.state.data} type='realtime' handleCurrentMenu={this.handleCurrentMenu}/>
    }
    else
    {
      return <WeatherData data={this.state.data} type='forecast' endDate={this.state.date} handleCurrentMenu={this.handleCurrentMenu}/>
    }
  }

  handleCurrentMenu = (current) => {
    this.setState({
      currentMenu: current
    })
  }

  renderHome() {
    return (
      <>
        <h1 id="home-headline">ReactForecast - Weather App</h1>
        <div className="real-time-temp">
          <h1>Real-Time Temperature</h1>
          <input
            type="text"
            value={this.state.location}
            onChange={this.handleLocationChange}
            placeholder="Enter location"
            required
          />
          <button onClick={this.getRealTimeTemp}>Get Temperature</button>
          {this.state.realTime && <p>{this.state.realTime}°C</p>}
        </div>
        <div className="forecast-temp">
          <h1>Forecasted Temperature</h1>
          <input
            type="text"
            value={this.state.location}
            onChange={this.handleLocationChange}
            placeholder="Enter location"
          />
          <input
            type="date"
            value={this.state.date}
            onChange={this.handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            max={
              new Date(new Date().setDate(new Date().getDate() + 6))
                .toISOString()
                .split("T")[0]
            }
          />
          <button onClick={this.getForecastTemp}>Get Forecast</button>
          {this.state.forecast && <p>{this.state.forecast}°C</p>}
        </div>

        <div className="footer-info">
          <a href="">Download Source Code</a> &nbsp; | Developed by &nbsp;
          <a target="_blank" href="https://github.com/gautamuniverse">
            Gautam
          </a>{" "}
        </div>
      </>
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.currentMenu === "home"
          ? this.renderHome()
          : this.renderRealTimeAndForecast()}
      </div>
    );
  }
}

export default App;
