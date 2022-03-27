import api from '../utils/api';

export interface CI {
  city: string;
  province: string;
  area: string;
  population: string;
}

export const getCities = () => api.get('/cities');
