import axios from "axios";
import { CustomerRecord } from "@/types/types";
import { baseApi } from "@/uitils/commonApi";

const BASE_URL = `${baseApi}/customers`;
export const createCustomerApi = async (
  formData: CustomerRecord
): Promise<any> => {
  try {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.log("FULL ERROR:", error);
    console.log("ERROR RESPONSE:", error?.response);
    console.log("ERROR DATA:", error?.response?.data);
    console.log("ERROR STATUS:", error?.response?.status);

    throw error;
  }
};

export const getAllCustomersApi = async () => {
  const response = await axios.get(BASE_URL);
  return response.data.data.customers;
};

export const getCustomerByIdApi = async (uuid: string) => {
  const response = await axios.get(`${BASE_URL}/${uuid}`);
  return response.data.data;
};

export const updateCustomerApi = async (
  uuid: string,
  data: CustomerRecord
) => {
  const response = await axios.put(`${BASE_URL}/${uuid}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.data;
};

export const deleteCustomerApi = async (uuid: string) => {
  const response = await axios.delete(`${BASE_URL}/${uuid}`);
  return response.data;
};