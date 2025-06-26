import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    // Create mock hourly forecast data
    const currentHour = today.getHours();
    const hourlyForecast = [];
    
    for (let i = 0; i < 7; i++) {
      const hour = (currentHour + i) % 24;
      const displayHour = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`;
      
      // Generate slightly varying temperatures for the forecast
      const tempVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2 degrees
      
      hourlyForecast.push({
        hour: displayHour,
        temperature: 75 + tempVariation,
        weather: 'Sunny'
      });
    }
    
    return { 
      weather: 'Sunny', 
      temperature: 75, 
      location,
      date: formattedDate,
      hourlyForecast
    };
  },
});

export const tools = {
  displayWeather: weatherTool,
};