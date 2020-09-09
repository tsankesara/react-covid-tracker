import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";

import { FormControl, Select, MenuItem } from "@material-ui/core";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    useEffect(() => {
        //async
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    const countries = data.map((dat) => {
                        return {
                            name: dat.country,
                            value: dat.countryInfo.iso2,
                        };
                    });
                    setCountries(countries);
                });
        };
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);
    };
    return (
        <div className="App">
            <div className="app__header">
                <h1>Covid-Tracker</h1>
                <FormControl className="app__dropdown">
                    <Select value={country} onChange={onCountryChange}>
                        <MenuItem value="worldwide">WorldWide</MenuItem>
                        {countries.map((country) => {
                            return (
                                <MenuItem value={country.value}>
                                    {country.name}
                                </MenuItem>
                            );
                        })}
                        {/*
                        Loop through all contries and show dropdown*/}
                    </Select>
                </FormControl>
            </div>
            <div className="app__stats">
                <InfoBox title="Coronavirus Cases" cases="3232" total="23423" />
                <InfoBox title="Recovered" cases="3232" total="23423" />
                <InfoBox title="Deaths" cases="3232" total="23423" />
            </div>
        </div>

        // {Infobox}
        // {Infobox}
        // {Infobox}

        // TABLE
        //GRAPH

        //MAP
    );
}

export default App;
