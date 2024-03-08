'use client'

import React, { useState } from 'react';
import './WeatherDashboard.css';
import axios from 'axios';

interface WeatherData {
    main: {
        temp: number;
    };
}

const WeatherDashboard: React.FC = () => {
    const [zipcode, setZipcode] = useState<string>('');
    const [cities, setCities] = useState<string[]>(['', '', '']);
    const [weatherData, setWeatherData] = useState<{ user_location?: WeatherData; chosen_cities?: { [key: string]: WeatherData } }>({});

    const handleZipcodeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setZipcode(event.target.value);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
        const newCities = [...cities];
        newCities[index] = event.target.value;
        setCities(newCities);
    };

    const fetchWeather = async (): Promise<void> => {
        try {
            const response = await axios.get(`http://localhost:8000/weather?zipcode=${zipcode}&city=${cities[0]}&city=${cities[1]}&city=${cities[2]}`);
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        fetchWeather();
    };

    return (
        <div className="weather-dashboard">
            <h1>Weather Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Zip Code:</label>
                    <input type="text" value={zipcode} onChange={handleZipcodeChange} />
                </div>
                {[0, 1, 2].map((index) => (
                    <div className="input-group" key={index}>
                        <label>City {index + 1}:</label>
                        <input type="text" value={cities[index]} onChange={(event) => handleCityChange(event, index)} />
                    </div>
                ))}
                <button type="submit">Get Weather</button>
            </form>
            <div className="weather-results">
                {weatherData.user_location && (
                    <div className="weather-item">
                        <h2>Your Location</h2>
                        <p>Temperature: {weatherData.user_location.main.temp}°C</p>
                    </div>
                )}
                {weatherData.chosen_cities && (
                    <div>
                        {Object.entries(weatherData.chosen_cities).map(([city, data]) => (
                            <div key={city} className="weather-item">
                                <h2>{city}</h2>
                                <p>Temperature: {data.main.temp}°C</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;
