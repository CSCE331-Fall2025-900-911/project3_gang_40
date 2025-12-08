import { useEffect, useState } from "react";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const getWeatherIcon = (iconCode) => {
    const night = iconCode.endsWith('n');
    const code = iconCode.slice(0, 2);  // Fixed: slice(0, 2) gets first 2 chars
    
    if (code === '01') return night ? '🌙' : '☀️';
    if (code === '02') return night ? '🌤️' : '⛅';
    if (code === '03' || code === '04') return '☁️';
    if (code === '09' || code === '10') return '🌧️';
    if (code === '11') return '⛈️';
    if (code === '13') return '🌨️';
    if (code === '50') return '🌫️';
    return '🌈'; // default
  };

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=College%20Station,US&appid=${API_KEY}&units=imperial`
        );
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setWeather(data);
        console.log("Weather icon code:", data.weather[0].icon);
      } catch (err) {
        setError("Could not load weather");
      }
    }
    loadWeather();
  }, []);

  if (error) return <p>{error}</p>;
  if (!weather) return <p>Loading...</p>;

  return (
    <div>
      <p style={{ color: 'white' }}>{getWeatherIcon(weather.weather[0].icon)} {weather.main.temp} °F</p>
    </div>
  );
}

export default Weather;
