import { lookUp } from 'geojson-places';

export function regionCounter(data) {
  const continentCounter = {};
  const countryCounter = {};
  const stateCounter = {};

  for (let i = 0; i < data.length; i++) {
    const locationData = lookUp(data[i].latitude, data[i].longitude);

    if (locationData) {
      const { continent_code, country_a2, state_code } = lookUp(
        data[i].latitude,
        data[i].longitude
      );

      if (!continentCounter[continent_code]) {
        continentCounter[continent_code] = true;
      }
      if (!countryCounter[country_a2]) {
        countryCounter[country_a2] = true;
      }

      if (!stateCounter[state_code]) {
        stateCounter[state_code] = true;
      }
    }
  }
  return {
    continents: Object.keys(continentCounter).length,
    countries: Object.keys(countryCounter).length,
    states: Object.keys(stateCounter).length,
  };
}
