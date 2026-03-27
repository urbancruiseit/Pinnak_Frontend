import { baseApi } from "@/uitils/commonApi";
import { countryData } from "@/types/types";
import axios from "axios";

const countryApi = `${baseApi}/country`;

export const createCountryCodeApi = async (
  formData: countryData,
): Promise<countryData> => {
  try {
    const response = await axios.post(countryApi, formData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating country:", error);
    throw error.response?.data || error.message;
  }
};

export const getAllCountriesApi = async (): Promise<countryData[]> => {
  try {
    const response = await axios.get(countryApi);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching countries:", error);
    throw error.response?.data || error.message;
  }
};

export const getCountryByCodeApi = async (): Promise<
  Pick<countryData, "country_code" | "phone_code">
> => {
  try {
    const response = await axios.get(`${countryApi}/codes`);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching country code:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch country code",
    );
  }
};
