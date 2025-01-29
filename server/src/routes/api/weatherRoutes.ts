import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { city } = req.body;
    console.log(`City: ${city}`);

    if (!city) {
      return res.status(400).json({ error: 'City name is required.' });
    }

  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found for the specified city.' });
    }

  // TODO: save city to search history
  await HistoryService.addCity(city);

  return res.status(200).json(weatherData);
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'An error occurred while retrieving weather data.' });
}

});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required.' });
    }

    const result = await HistoryService.removeCity(id);

    if (result) {
      return res.status(200).json({ message: 'City deleted from search history.' });
    } else {
      return res.status(404).json({ error: 'City not found in search history.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while deleting city from search history.' });
  }
});

export default router;
