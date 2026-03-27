// E:\Pinnak\PINAK_FRONTEND\src\app\features\AnnualReport\annualReportApi.ts
import axios from "axios";
import { baseApi } from "../../../uitils/commonApi";

export interface AnnualReportData {
  daysData: number[][];
  sourceData: number[][];
  paxData: number[][];
  year: number;
}

interface ApiResponse {
  success: boolean;
  year: number;
  daysData: number[][];
  sourceData: number[][];
  paxData: number[][];
}

export const getAnnualReportApi = async (
  year: number,
): Promise<AnnualReportData> => {
  try {
    // ✅ सही URL - backend route के अनुसार
    const url = `${baseApi}/annualreport/annual-report`;

    console.log("🌐 Fetching Annual Report:");
    console.log("🔍 Base URL:", baseApi);
    console.log("🔍 Full URL:", url);
    console.log("🔍 Year:", year);

    const response = await axios.get<ApiResponse>(url, {
      params: { year },
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("✅ Response Status:", response.status);
    console.log("✅ Response Data:", response.data);

    if (response.data?.success) {
      return {
        daysData: response.data.daysData || [],
        sourceData: response.data.sourceData || [],
        paxData: response.data.paxData || [],
        year: response.data.year,
      };
    }

    // अगर success false है तो empty data return करें
    return {
      daysData: [],
      sourceData: [],
      paxData: [],
      year: year,
    };
  } catch (error: any) {
    console.error("❌ Annual Report API Error Details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      params: error.config?.params,
    });

    // Specific error messages
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout - Server is taking too long");
    }

    if (!error.response) {
      throw new Error(
        `Cannot connect to server at ${baseApi}. Please check if backend is running`,
      );
    }

    if (error.response.status === 404) {
      throw new Error(
        `API endpoint not found: ${error.config?.url}. Please check backend routes`,
      );
    }

    throw new Error(
      error.response.data?.message || `Server error: ${error.response.status}`,
    );
  }
};

// Test connection function
export const testAnnualReportConnection = async () => {
  try {
    const testUrl = `${baseApi}/annualreport/test`; // अगर test endpoint बनाया हो
    const response = await axios.get(testUrl);
    return {
      success: true,
      message: "Connected to annual report API",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      url: error.config?.url,
    };
  }
};
