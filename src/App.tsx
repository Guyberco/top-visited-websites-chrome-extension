import React from 'react';
import UsersTopSites from "./components/users-top-sites/users-top-sites";
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from "./components/weather-info/weather-info";

function App() {

    return (
        <div>
            <h1>
                Do you want to navigate into some of your 10 Top visited websites?
            </h1>
            <UsersTopSites/>
            <Weather/>
        </div>
    );
}

export default App;
