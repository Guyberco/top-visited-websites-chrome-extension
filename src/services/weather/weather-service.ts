import {WeatherInfo} from "../../common/models/weather-Info.model";

class WeatherService {
    private APIKey = '714ed9db8da23a74d5d02f313b16c55a';
    private latitude: number | undefined;
    private longitude: number | undefined;


    setCoordinates(latitude: number, longitude: number): void {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    async getCurrentWeather(): Promise<Partial<WeatherInfo>> {
        const weatherInfo: Partial<WeatherInfo> = {temp: undefined, humidity: undefined};
        if (this.latitude && this.longitude) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.latitude}&lon=${this.longitude}&units=metric&appid=${this.APIKey}`);
            if (response.ok) {
                const data = await response.json();
                const {temp = undefined, humidity = undefined} = data.current;
                return {...weatherInfo, temp, humidity};
            }
        }
        return weatherInfo;
    }
}

export default new WeatherService();
