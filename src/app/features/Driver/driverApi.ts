import { baseApi } from "@/uitils/commonApi";
import axios from "axios";

export interface DriverFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    emergencyContact: string;
    bloodGroup: string;
    vendor: string;
    vendorState: string;
    vendorCity: string;
  };
  addressInfo: {
    permanentAddress: string;
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  licenseInfo: {
    licenseNumber: string;
    licenseType: string;
    issuingAuthority: string;
    issueDate: string;
    experienceDetails: string;
    expiryDate: string;
    dlFront: string; // Cloudinary URL
    dlBack: string; // Cloudinary URL
  };
  employmentInfo: {
    employeeId: string;
  };
  documents: {
    aadharCard: string; // Cloudinary URL
    panCard: string; // Cloudinary URL
  };
}

export interface DriverResponse {
  id: number;
  personalInfo?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    emergencyContact: string;
    bloodGroup: string;
    vendor: string;
    vendorState: string;
    vendorCity: string;
  };
  addressInfo?: {
    permanentAddress: string;
    currentAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  licenseInfo?: {
    licenseNumber: string;
    licenseType: string;
    issuingAuthority: string;
    issueDate: string;
    experienceDetails: string;
    expiryDate: string;
    dlFront: string;
    dlBack: string;
  };
  employmentInfo?: {
    employeeId: string;
  };
  documents?: {
    aadharCard: string;
    panCard: string;
  };
  message?: string;
  status?: string;
}

const driverApi = `${baseApi}/driver`;

// ✅ Sirf JSON payload banao — koi FormData nahi, koi File object nahi
const buildJsonPayload = (data: DriverFormData): Record<string, any> => {
  const payload: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof DriverFormData];

    // Nested objects ko as-is rakho
    if (typeof value === "object" && value !== null) {
      payload[key] = value;
    }
    // Empty strings skip karo (optional — hata sakte ho agar backend ko chahiye)
    else if (value !== null && value !== undefined && value !== "") {
      payload[key] = value;
    }
  });

  return payload;
};

// ─── Create Driver ────────────────────────────────────────────────────────
export const createDriverAPI = async (
  formData: DriverFormData,
): Promise<DriverResponse> => {
  try {
    const payload = buildJsonPayload(formData);
    console.log("Driver Payload being sent to API:", payload);

    const response = await axios.post(driverApi, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data?.data?.driver) return response.data.data.driver;
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating driver:", error);
    throw new Error(error.response?.data?.message || "Error creating driver");
  }
};

export default {
  createDriverAPI,
};
