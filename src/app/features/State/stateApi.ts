import axios from "axios";
import { baseApi } from "../../../uitils/commonApi";

const BASE_URL = `${baseApi}/state`;

export interface City {
  id: number;
  cityName: string;
}

export interface State {
  id: number;
  stateName: string;
}

// Sab states fetch karo
export const getAllStatesApi = async (): Promise<State[]> => {
  const res = await axios.get(`${BASE_URL}/`);
  return res.data.data; // ApiResponse wrapper ka .data
};

// Sab cities fetch karo
export const getAllCitiesApi = async (): Promise<City[]> => {
  const res = await axios.get(`${BASE_URL}/allcity`);
  return res.data.data;
};

// City ke basis pe states fetch karo ← YEH KEY FUNCTION HAI
export const getStatesByCityApi = async (cityName: string): Promise<State[]> => {
  const res = await axios.get(
    `${BASE_URL}/states-by-city/${encodeURIComponent(cityName)}`
  );
  return res.data.data;
};