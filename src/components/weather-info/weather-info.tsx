import {useEffect, useState} from "react";
import WeatherService from "../../services/weather/weather-service";
import {WeatherInfo} from "../../common/models/weather-Info.model";
import {Alert, Form, Spinner} from "react-bootstrap";
import {Coordinates} from "../../common/models/coordinates.model";
import './weather-info.scss';
import {FallbackState, fallbackStateToText} from "./fallback-state";

export default function Weather(): JSX.Element {
    const [coordinates, setCoordinates] = useState<Partial<Coordinates>>();
    const [userCoordinates, setUserCoordinates] = useState<Partial<Coordinates>>();
    const [weatherInfo, setWeatherInfo] = useState<Partial<WeatherInfo>>({temp: undefined, humidity: undefined});
    const [fallbackState, setFallbackState] = useState<FallbackState>();
    const {temp, humidity} = weatherInfo;
    const {latitude, longitude} = coordinates ?? {};
    const {latitude: userLatitude, longitude: userLongitude} = userCoordinates || {};
    const isUserLocation = latitude === userLatitude && longitude === userLongitude;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setUserCoordinates({latitude, longitude});
            setCoordinates({latitude, longitude});
        }, () => setFallbackState(FallbackState.CannotFindUserTemp), {timeout: 1000});
    }, []);

    useEffect(() => {
        if (latitude && longitude) {
            WeatherService.setCoordinates(latitude, longitude);
        } else {
            setCoordinates(userCoordinates);
        }

        async function fetchWeather() {
            setFallbackState(FallbackState.Loading);
            const weatherInfo = await WeatherService.getCurrentWeather();
            const {temp, humidity} = weatherInfo;
            setWeatherInfo(weatherInfo);
            if (!temp && !humidity) {
                if (isUserLocation) {
                    setFallbackState(FallbackState.CannotFindUserTemp);
                } else {
                    setFallbackState(FallbackState.InsertedLocationTempUnavailable);
                }
            } else {
                setFallbackState(undefined);
            }
        }

        fetchWeather();
    }, [latitude, longitude]);
    const fallbackMessage = fallbackState !== undefined ? fallbackStateToText[fallbackState] : undefined;

    return (
        <div>
            <div className="weather-input-container">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control type="text"
                                      onChange={(e) => setCoordinates({
                                          ...coordinates,
                                          latitude: e.target.value as any as number || undefined
                                      })}
                                      size="sm"/>
                        <Form.Text
                            className="text-muted">If no latitude is supplied, your current latitude will be
                            set</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control type="text"
                                      onChange={(e) => setCoordinates({
                                          ...coordinates,
                                          longitude: e.target.value as any as number || undefined
                                      })}
                                      size="sm"/>
                        <Form.Text
                            className="text-muted">If no longitude is supplied, your current longitude will be
                            set</Form.Text>
                    </Form.Group>
                </Form>
            </div>
            {fallbackState === FallbackState.Loading && <Spinner animation="border" variant="info"/>}
            <Alert variant="info">
                {temp ? `It is currently ${temp} degrees ${isUserLocation ? 'outside' : 'in the inserted location'}` : fallbackMessage}
            </Alert>
            {
                humidity && (humidity > 65 ?
                    <Alert variant="danger">It is too humid {isUserLocation ? 'outside' : 'there'}! </Alert> :
                    <Alert variant="success">It may be hot {isUserLocation ? 'outside' : 'there'}, but at least there is a low humidity :)</Alert>)
            }
        </div>
    );
}
