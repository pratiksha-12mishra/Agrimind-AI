type Props = {
  temperature: number
  humidity: number
  rain_probability: number
}

export default function WeatherCard({ temperature, humidity, rain_probability }: Props) {
  return (
    <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-sky-800 mb-3">Current Weather</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-2xl font-bold text-sky-700">{temperature}°C</p>
          <p className="text-xs text-gray-500">Temperature</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-sky-700">{humidity}%</p>
          <p className="text-xs text-gray-500">Humidity</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-sky-700">{rain_probability}%</p>
          <p className="text-xs text-gray-500">Rain Chance</p>
        </div>
      </div>
    </div>
  )
}