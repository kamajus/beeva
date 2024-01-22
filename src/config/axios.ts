import axios from 'axios';

export const mapApi = axios.create({
  baseURL: 'https://photon.komoot.io/api',
});

export const placeApi = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
});
