import axios from "axios";
import { baseApi } from "../../../uitils/commonApi";

// ✅ reportsRouter "/reports" use kar raha hai
const reportApi = `${baseApi}/reports`; // becomes: http://localhost:5000/api/v1/reports

export interface MonthlyReportRecord {
  month: number;
  day: number;
  total: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  year?: number;
}

export const getMonthlyReportApi = async (
  year: number,
): Promise<MonthlyReportRecord[]> => {
  try {
    console.log("🌐 Full URL:", `${reportApi}/monthly-enquiry?year=${year}`);

    const response = await axios.get<ApiResponse<MonthlyReportRecord[]>>(
      `${reportApi}/monthly-enquiry`,
      {
        params: { year },
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("✅ Response Status:", response.status);
    console.log("✅ Response Data:", response.data);

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return response.data.data;
    }

    return [];
  } catch (error: any) {
    console.error("❌ API Error Details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle specific errors
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - Server is taking too long");
    }

    if (!error.response) {
      throw new Error(
        `Cannot connect to server at ${baseApi}. ` +
          "Please check if backend is running on port 5000",
      );
    }

    throw new Error(
      error.response.data?.message || `Server error: ${error.response.status}`,
    );
  }
};

// ✅ Test function to check API connection
export const testConnection = async () => {
  try {
    // Test root endpoint
    const response = await axios.get(baseApi.replace("/api/v1", "")); // http://localhost:5000/
    return {
      success: true,
      message: "Connected to backend",
      data: response.data,
    };
  } catch (error) {
    return { success: false, error };
  }
};
