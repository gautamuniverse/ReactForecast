import React, { Component } from "react";

class WeatherData extends Component {
  renderRealtimeData() {
    const { time, values } = this.props.data.data;
    const { name } = this.props.data.location;
    return (
      <div className="glassmorphic-card">
        <h2>{name}</h2>
        <p>{new Date(time).toLocaleString()}</p>
        <p>Temperature: {values.temperature}°C</p>
        <p>Feels Like: {values.temperatureApparent}°C</p>
        <p>Humidity: {values.humidity}%</p>
        <p>Wind Speed: {values.windSpeed} m/s</p>
      </div>
    );
  }

  renderForecastData() {
    const { timelines } = this.props.data;
    const dailyData = timelines.daily.filter(
      (day) =>
        new Date(day.time) >= new Date() &&
        new Date(day.time) <= new Date(this.props.endDate)
    );

    return dailyData.map((day, index) => (
      <div key={index} className="glassmorphic-card" id="forecast-cards">
        <h3>{new Date(day.time).toLocaleDateString()}</h3>
        <p>Average Temperature: {day.values.temperatureAvg}°C</p>
        <p>Max Temperature: {day.values.temperatureMax}°C</p>
        <p>Min Temperature: {day.values.temperatureMin}°C</p>
      </div>
    ));
  }

  componentWillUnmount() {
    this.props.handleCurrentMenu("home");
  }

  render() {
    return (
      <div id="weather-page">
        {this.props.type === "realtime"
          ? this.renderRealtimeData()
          : this.renderForecastData()}
      </div>
    );
  }
}

export default WeatherData;
