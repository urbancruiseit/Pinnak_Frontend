import { baseApi } from "@/uitils/commonApi";
import axios from "axios";

export interface MonthlyHourReportRecord {
  month: number;
  day: number;
  hour: number;
  total: number;
}

const hoursReportApi = `${baseApi}/hoursreport`;

export const getMonthlyReportApi = async (
  year: number,
): Promise<MonthlyHourReportRecord[]> => {
  try {
    const response = await axios.get<{ data: MonthlyHourReportRecord[] }>(
      hoursReportApi,
      {
        params: { year },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching monthly hour report:", error);
    throw error?.response?.data || error.message || "Something went wrong";
  }
};
