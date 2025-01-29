import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, condition: string, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.condition = condition;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "https://api.openweathermap.org/data/2.5";
    this.apiKey = process.env.API_KEY || "";
    this.city = "";
  }

  // TODO: Create fetchLocationData method
  // Fetches the geolocation (latitude/longitude) for a city using geocoding API
  private async fetchLocationData(query: string): Promise<any> {
    this.city = query;
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    //const response = await fetch(this.buildGeocodeQuery());
    if (!response.ok) throw new Error("Failed to fetch location data.");
    return await response.json();
  }

  // TODO: Create destructureLocationData method
  // Extracts latitude and longitude from the geocoding API response
  private destructureLocationData(locationData: any): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error("No location data found.");
  }
    const { lat: latitude, lon: longitude } = locationData[0];
    return { latitude, longitude };
  }

  // TODO: Create buildGeocodeQuery method
  // Constructs the query URL for fetching geolocation data
  //private buildGeocodeQuery(): string {
  //  return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
  //}

  // TODO: Create buildWeatherQuery method
  // Constructs the query URL for fetching weather data using latitude and longitude
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  // Builds the query URL to fetch 5-day forecast data
  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  // Combines fetching and destructuring location data
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  // Fetches the weather data for a given set of coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) throw new Error("Failed to fetch weather data.");
    return await response.json();
  }

  // Fetches the forecast data for a given set of coordinates (5-day forecast)
  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildForecastQuery(coordinates));
    if (!response.ok) throw new Error("Failed to fetch forecast data.");
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  // Parses the API response and creates a Weather object
  private parseCurrentWeather(response: any): Weather {
    const { temp: temperature, humidity } = response.main;
    const { description: condition } = response.weather[0];
    const { speed: windSpeed } = response.wind;
    return new Weather(temperature, condition, humidity, windSpeed);
  }

  // TODO: Complete buildForecastArray method
  // A placeholder for building a forecast
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    // Example: Extend the array with current and forecast data
    const forecastArray = weatherData.map((forecast) => {
      const { temp: temperature, humidity } = forecast.main;
      const { description: condition } = forecast.weather[0];
      const { speed: windSpeed } = forecast.wind;
          // Create and return a new Weather object
    return new Weather(temperature, condition, humidity, windSpeed);
  });

    return [currentWeather, ...forecastArray]; // Add logic for forecast data
  }

  // TODO: Complete getWeatherForCity method
  // Main method to fetch weather for a specific city
  async getWeatherForCity(city: string): Promise<Weather[] | null> {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();

      const weatherData = await this.fetchWeatherData(coordinates);
      const forecastData = await this.fetchForecastData(coordinates);

      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(currentWeather, forecastData.list);

      return forecastArray;
    } catch (error) {
      console.error(`Error fetching weather data: ${(error as Error).message}`);
      return null;
    }
  }
}

export default new WeatherService();
