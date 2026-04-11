import { baseApi } from "@/uitils/commonApi";
import axios from "axios";

export interface VendorFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  panNumber: string;
  aadhaarNumber: string;
  companyName: string;
  businessNumber: string;
  companyRegisteredNumber: string;
  gstNumber: string;
  registeredAddress: string;
  garageAddress: string;
  garagePhone: string;
  cooperativeName: string;
  cooperativeNumber: string;

  // ✅ Files ab string hain (Cloudinary URL baad mein ayega, abhi "" bhejo)
  passportPhoto: string;
  panDoc: string;
  gstDoc: string;
  vendorProof: string;
  vehicleDoc: string;

  code: string;
  managerName2: string;
  managerName1: string;
  ownerName: string;
  managerPhone1: string;
  managerEmail1: string;
  managerPhone2: string;
  managerEmail2: string;
  shortName: string;
  companyType: string;
  companyPanNumber: string;
  ownerPhone: string;
  ownerEmail: string;

  personalInfo: {
    personalAddress: string;
    personalCity: string;
    personalState: string;
  };

  companyinfo: {
    companyState: string;
    companyCity: string;
  };
}

export interface VendorResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  code: string;
  message?: string;

  // Alternative field names that might come from backend
  vendor_name?: string;
  mobile?: string;
  company_name?: string;
  companyType?: string;
  company_type?: string;
  gst_number?: string;
  gstNumber?: string;
  owner_name?: string;
  ownerName?: string;
  personal_city?: string;
  personal_state?: string;
  city?: string;
  state?: string;
  status?: string;

  // Nested objects
  personalInfo?: {
    personalAddress: string;
    personalCity: string;
    personalState: string;
  };
  companyinfo?: {
    companyState: string;
    companyCity: string;
  };
}

const vendorApi = `${baseApi}/vendor`;

// ✅ Sirf JSON payload banao — koi FormData nahi, koi File object nahi
const buildJsonPayload = (data: VendorFormData): Record<string, any> => {
  const payload: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof VendorFormData];

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

// ─── Create Vendor ────────────────────────────────────────────────────────
export const createVendorAPI = async (
  formData: VendorFormData,
): Promise<VendorResponse> => {
  try {
    const payload = buildJsonPayload(formData);
    console.log("Payload being sent to API:", payload);

    const response = await axios.post(vendorApi, payload, {
      headers: {
        "Content-Type": "application/json", // ✅ lowercase + JSON (pehle galat tha)
      },
    });

    if (response.data?.data?.vendor) return response.data.data.vendor;
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating vendor:", error);
    throw new Error(error.response?.data?.message || "Error creating vendor");
  }
};

// ─── Update Vendor ────────────────────────────────────────────────────────
export const updateVendorAPI = async (
  id: number,
  formData: VendorFormData,
): Promise<VendorResponse> => {
  try {
    const payload = buildJsonPayload(formData);
    console.log("Update Payload:", payload);

    const response = await axios.put(`${vendorApi}/${id}`, payload, {
      headers: {
        "Content-Type": "application/json", // ✅ JSON kyunki ab koi file nahi
      },
    });

    if (response.data?.data?.vendor) return response.data.data.vendor;
    return response.data.data;
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    throw new Error(error.response?.data?.message || "Error updating vendor");
  }
};

// ─── Get All Vendors ────────────────────────────────────────────────────────
export const getAllVendorsAPI = async (): Promise<VendorResponse[]> => {
  try {
    const response = await axios.get(`${vendorApi}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Get All Vendors Response:", response.data);

    // Handle different response structures from backend
    if (response.data?.data?.vendors) {
      return response.data.data.vendors;
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.vendors && Array.isArray(response.data.vendors)) {
      return response.data.vendors;
    }

    return [];
  } catch (error: any) {
    console.error("Error fetching vendors:", error);
    throw new Error(error.response?.data?.message || "Error fetching vendors");
  }
};

// ─── Get Single Vendor by ID ────────────────────────────────────────────────
export const getVendorByIdAPI = async (
  id: number,
): Promise<VendorResponse | null> => {
  try {
    const response = await axios.get(`${vendorApi}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Get Vendor By ID Response:", response.data);

    // Handle different response structures
    if (response.data?.data?.vendor) {
      return response.data.data.vendor;
    }

    if (response.data?.data) {
      return response.data.data;
    }

    if (response.data?.vendor) {
      return response.data.vendor;
    }

    return response.data || null;
  } catch (error: any) {
    console.error("Error fetching vendor by ID:", error);
    throw new Error(error.response?.data?.message || "Error fetching vendor");
  }
};
export default {
  createVendorAPI,
  updateVendorAPI,
  getAllVendorsAPI,
  getVendorByIdAPI,
};
