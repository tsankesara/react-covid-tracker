import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData } from "./util";
import "leaflet/dist/leaflet.css";
import {
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
} from "@material-ui/core";

//TIMESTAMP: 3:27
// https://youtu.be/cF3pIMJUZxM?t=12446
function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [TableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796,
    });
    const [mapCountries, setmapCountries] = useState([]);
    const [mapZoom, setMapZoom] = useState(4);
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((res) => res.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);
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
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                    setmapCountries(data);
                });
        };
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);

        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            });
    };
    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>Covid-Tracker</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            variant="outlined"
                            value={country}
                            onChange={onCountryChange}>
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
                    <InfoBox
                        title="Coronavirus Cases"
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases}
                    />
                    <InfoBox
                        title="Recovered"
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered}
                    />
                    <InfoBox
                        title="Deaths"
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths}
                    />
                </div>
                <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                    casesType={casesType}
                />
            </div>

            <Card className="app__right">
                <CardContent>
                    <h3>Live Cases by Country</h3>
                    <Table countries={TableData} />
                    <h3>Worldwide new cases</h3>
                    <LineGraph />
                </CardContent>
            </Card>
        </div>
        //MAP
    );
}

export default App;
