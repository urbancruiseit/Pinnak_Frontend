import { baseApi } from "@/uitils/commonApi";
import { travelcity } from "@/types/types";
import axios from "axios";

const cityApi = `${baseApi}/travelcity`;

export const getAllCitiesApi = async (): Promise<travelcity[]> => {
  try {
    const response = await axios.get(cityApi);
   
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    throw error.response?.data || error.message;
  }
};

export const getCityByIdApi = async (
  id: number | string,
): Promise<travelcity> => {
  try {
    const response = await axios.get(`${cityApi}/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching city:", error);
    throw error.response?.data || error.message;
  }
};

export const getCityNamesApi = async (): Promise<
  Pick<travelcity, "id" | "uuid" | "cityName">[]
> => {
  try {
    const response = await axios.get(`${cityApi}/names`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching city names:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch city names",
    );
  }
};
