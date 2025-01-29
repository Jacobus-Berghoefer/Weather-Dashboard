import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(__dirname, '../../searchHistory.json');
  }
  
  // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    console.log(this.filePath); //delete later
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If the file doesn't exist, return an empty array
        return [];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private  async write(cities: City[]): Promise<void> {
    const citiesData = cities.map(city => ({ name: city.name, id: city.id }));
    const data = JSON.stringify(citiesData, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities(): Promise<City[]> {
      const data = await this.read();
      return data.map((city: { name: string, id: string }) => new City(city.name, city.id));
    }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName: string): Promise<City>  {
      const cities = await this.getCities();
      const id = Date.now().toString(); // Use a timestamp as a unique ID
      const newCity = new City(cityName, id);
      cities.push(newCity);
      await this.write(cities);
      return newCity;
    }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string): Promise<boolean> {
      const cities = await this.getCities();
      const updatedCities = cities.filter((city) => city.id !== id);

      if (updatedCities.length === cities.length) {
        return false; // City with the given ID was not found
      }

      await this.write(updatedCities);
      return true; // City successfully removed
    }
  }

export default new HistoryService();
