type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
  date?: string;
  hourlyForecast?: Array<{
    hour: string;
    temperature: number;
    weather: string;
  }>;
};

export const Weather = ({ temperature, weather, location, date, hourlyForecast = [] }: WeatherProps) => {
  // Format the date if provided, otherwise use current date
  const formattedDate = date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return (
        <div className="w-12 h-12 rounded-full bg-yellow-300"></div>
      );
    } else if (lowerCondition.includes('cloud')) {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
      );
    } else if (lowerCondition.includes('rain')) {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-300"></div>
      );
    } else {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      );
    }
  };

  return (
    <div className="bg-blue-500 text-white rounded-lg overflow-hidden shadow-lg max-w-3xl">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">{formattedDate}</p>
            <div className="flex items-center mt-2">
              <span className="text-6xl font-bold">{Math.round(temperature)}°</span>
              <div className="ml-4">
                {getWeatherIcon(weather)}
              </div>
            </div>
            <p className="text-xl mt-2">{weather}</p>
            <p className="text-lg mt-1">{location}</p>
          </div>
        </div>
      </div>
      
      {hourlyForecast && hourlyForecast.length > 0 && (
        <div className="bg-blue-400 p-4 flex justify-between">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-sm">{hour.hour}</span>
              <div className="my-2">
                {getWeatherIcon(hour.weather)}
              </div>
              <span className="text-sm font-medium">{Math.round(hour.temperature)}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};