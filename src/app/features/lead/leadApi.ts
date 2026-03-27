import { baseApi } from "@/uitils/commonApi";
import axios from "axios";
import type { LeadRecord } from "@/types/types";

const leadApi = `${baseApi}/lead`;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const createLeadApi = async (
  leadData: Partial<LeadRecord>,
): Promise<LeadRecord> => {
  try {
    console.log("API leadData:", leadData);
    const response = await axios.post<ApiResponse<LeadRecord>>(
      leadApi,
      leadData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Create Lead Error:", error);

    if (axios.isAxiosError(error)) {
      // Extract detailed error message from API response
      const apiError = error.response?.data;
      const errorMessage =
        apiError?.error ||
        apiError?.message ||
        error.response?.data?.details ||
        error.message ||
        "Failed to create lead";

      throw new Error(errorMessage);
    }

    // Handle network errors or other non-Axios errors
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error(
      "Failed to create lead. Please check your connection and try again.",
    );
  }
};

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedLeadsResponse {
  leads: LeadRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getLeadApi = async (
  page: number = 1,
): Promise<PaginatedLeadsResponse> => {
  try {
    const response = await axios.get<ApiResponse<PaginatedLeadsResponse>>(
      leadApi,
      {
        params: { page },
        withCredentials: true,
      },
    );

    return {
      leads: response.data.data.leads || [],
      total: response.data.data.total || 0,
      page: response.data.data.page || page,
      limit: response.data.data.limit || 15,
      totalPages: Math.ceil(
        (response.data.data.total || 0) / (response.data.data.limit || 15),
      ),
    };
  } catch (error: any) {
    console.error("Get Leads Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch leads";
      throw new Error(errorMessage);
    }

    // Handle network errors or other non-Axios errors
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error(
      "Failed to fetch leads. Please check your connection and try again.",
    );
  }
};

export const updateLeadApi = async (
  id: string,
  leadData: Partial<LeadRecord>,
): Promise<LeadRecord> => {
  try {
    console.log("API update leadData:", id, leadData);
    const response = await axios.put<ApiResponse<LeadRecord>>(
      `${leadApi}/${id}`,
      leadData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Update Lead Error:", error);
    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error(
      "Failed to update lead. Please check your connection and try again.",
    );
  }
};

export const markUnwantedApi = async (
  id: number,
  data: {
    unwanted_status: "unwanted";
    reason?: string;
  },
) => {
  try {
    console.log("🚀 Marking unwanted - ID:", id, "Data:", data);

    // ✅ CORRECT ENDPOINT: Matches backend route
    const response = await axios.patch(`${leadApi}/unwanted/${id}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Success:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("❌ API Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to mark unwanted";
      throw new Error(errorMessage);
    }

    throw new Error(error.message || "Failed to mark unwanted");
  }
};

export const getAllUnwantedLeadsApi = async (): Promise<LeadRecord[]> => {
  try {
    const response = await axios.get<ApiResponse<LeadRecord[]>>(
      `${leadApi}/unwanted/all`,
      {
        withCredentials: true,
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Get All Unwanted Leads Error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch unwanted leads";
      throw new Error(errorMessage);
    }

    throw new Error(
      error.message || "Failed to fetch unwanted leads. Please try again.",
    );
  }
};