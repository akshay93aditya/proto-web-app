import { lookUp } from 'geojson-places';

export function regionCounter(data) {
  const countryCounter = {};
  const continentCounter = {};

  for (let i = 0; i < data.length; i++) {
    const { continent_code, country_a2 } = lookUp(
      data[i].latitude,
      data[i].longitude
    );

    if (!continentCounter[continent_code]) {
      continentCounter[continent_code] = true;
    }
    if (!countryCounter[country_a2]) {
      countryCounter[country_a2] = true;
    }
  }
  return {
    countries: Object.keys(countryCounter).length,
    continents: Object.keys(continentCounter).length,
  };
}
