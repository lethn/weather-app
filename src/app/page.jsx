"use client";
import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const apiKey = 'a4ff56f6f54fbcb82179dfd2a976d9a6'; // API Key

  // Fetch current weather
  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert("Failed to get weather information!");
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async (cityName) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch forecast data: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      alert("Failed to get forecast information!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
    fetchForecast(city);
  };

  const convertToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };


  return (
    <div>
      <div className='flex flex-col items-center justify-center bg-blue-500 text-white'>
        <Image
          src="/logo.png"
          width={500}
          height={500}
          className="rounded-md w-[6rem]"
          alt="Company Logo"
        />
        <h1 className="text-4xl font-bold m-2">Weather App</h1>
        <h1 className="mb-6"> &copy; Author: Thuan Luu</h1>
      </div>

      <div className='flex flex-col items-center justify-center mt-8'>
        <div className='flex space-x-3 rounded-md'>
          <input
            className='f4 br2 pa2 p-1 w-60 border border-black rounded-md focus:outline-none cursor-text'
            type="text"
            placeholder="Enter city (E.g. Athens)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className='f4 br2 pa2 w-32 border border-black rounded-md bg-blue-500 hover:bg-blue-700 text-white'
            onClick={handleSubmit}>
            Get Weather
          </button>
          <button
            className='f4 br2 pa2 w-32 border border-black rounded-md bg-green-500 hover:bg-green-700 text-white'
            onClick={handleInfoClick}>
            Info
          </button>
        </div>

        {weather && (
          <div className='flex flex-col items-center mt-6 border py-2 px-4 rounded-md border-black'>
            <h1 className="text-2xl font-bold text-center">
              Weather Information
            </h1>
            <div className="px-6 text-left">
              <h2>Location: {weather.name}</h2>
              <p>Description: {weather.weather[0].main}</p>
              <p>Temperature: {convertToFahrenheit(weather.main.temp).toFixed(2)}°F</p>
              <p>Wind Speed: {weather.wind.speed}mph</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Pressure: {weather.main.pressure}Pa</p>
            </div>
          </div>
        )}

        {showInfo && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white text-black p-6 rounded-md max-w-lg mx-4'>
              <h2 className='text-xl font-bold mb-4'>About the Program</h2>
              <p>The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.</p>
              <p className='mt-4'>Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavours.</p>
              <button
                className='mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md'
                onClick={handleCloseInfo}>
                Close
              </button>
            </div>
          </div>
        )}

        {forecast && (
          <div className='flex flex-col items-center m-6 border py-2 px-4 rounded-md border-black'>
            <h1 className="text-2xl font-bold text-center">
              5-Day Forecast
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {forecast.list
                .filter((day) => day.dt_txt.includes("12:00:00")) // Filter for forecasts at noon (12:00)
                .map((day, index) => (
                  <div key={index} className="flex flex-col items-center p-2 bg-gray-100 rounded-md">
                    <h2>{new Date(day.dt * 1000).toLocaleDateString()}</h2>
                    <p>Temperature: {convertToFahrenheit(day.main.temp).toFixed(2)}°F</p>
                    <p>Description: {day.weather[0].main}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
