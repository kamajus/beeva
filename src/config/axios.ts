import axios from 'axios'

export const placeApi = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
})
