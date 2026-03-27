import axios from "axios";
import { Vehicle } from "@/types/types";
import { baseApi } from "@/uitils/commonApi";

const vehicleApi = `${baseApi}/vehicle`;

export const getVehiclesApi = async (): Promise<Vehicle[]> => {
  try {
    const res = await axios.get(vehicleApi);

    return res.data.data;
  } catch (error: any) {
    console.error("❌ Error fetching vehicles:", error.message);
    throw error;
  }
};