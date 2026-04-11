import { baseApi } from "@/uitils/commonApi";
import axios from "axios";

export interface CustomerRecord {
  id?: number;
  uuid?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  customerName?: string;
  customerPhone: string;
  customerEmail?: string;
  companyName?: string;
  customerType?: string;
  customerCategoryType?: string;
  alternatePhone?: string;
  countryName?: string;
  customerCity?: string;
  customerState?: string;
  address?: string;
  date_of_birth?: string;
  anniversary?: string;
  gender?: string;
  state?: string;
  pincode?: string;
  city?: string;
  cityId?: number;
  stateId?: number;
}

const customersApi = `${baseApi}/newcustomer`;

// ─── Field mapper: CustomerForm shape → backend shape ──────────────────────
// Form mein: phone, email, dateOfBirth
// Backend mein: customerPhone, customerEmail, date_of_birth
const mapFormToBackend = (
  formData: Partial<CustomerRecord> & {
    phone?: string;
    email?: string;
    dateOfBirth?: string;
  },
): Partial<CustomerRecord> => ({
  firstName: formData.firstName || undefined,
  middleName: formData.middleName || undefined,
  lastName: formData.lastName || undefined,
  customerPhone: formData.customerPhone || (formData as any).phone,
  customerEmail: formData.customerEmail || (formData as any).email || undefined,
  alternatePhone: formData.alternatePhone || undefined,
  date_of_birth:
    formData.date_of_birth || (formData as any).dateOfBirth || undefined,
  anniversary: formData.anniversary || undefined,
  gender: formData.gender || undefined,
  address: formData.address || undefined,
  state: formData.state || undefined,
  city: formData.city || undefined,
  pincode: formData.pincode || undefined,
  stateId: formData.stateId ?? undefined,
  cityId: formData.cityId ?? undefined,
  companyName: formData.companyName || undefined,
  customerType: formData.customerType || undefined,
  customerCategoryType: formData.customerCategoryType || undefined,
  countryName: formData.countryName || undefined,
  customerCity: formData.customerCity || undefined,
  customerState: formData.customerState || undefined,
});

// ─── Fetch All Customers ────────────────────────────────────────────────────
export const fetchCustomersAPI = async (): Promise<CustomerRecord[]> => {
  try {
    const response = await axios.get(customersApi);
    if (response.data?.data?.customers) {
      return response.data.data.customers;
    }
    return [];
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching customers",
    );
  }
};

// ─── Search Customers ───────────────────────────────────────────────────────
export const searchCustomersAPI = async (
  searchTerm: string,
): Promise<CustomerRecord[]> => {
  try {
    const response = await axios.get(`${customersApi}/search`, {
      params: { search: searchTerm },
    });
    if (response.data?.data?.customers) return response.data.data.customers;
    if (response.data?.customers) return response.data.customers;
    if (Array.isArray(response.data)) return response.data;
    return [];
  } catch (error: any) {
    console.error("Error searching customers:", error);
    throw new Error(
      error.response?.data?.message || "Error searching customers",
    );
  }
};

// ─── Create Customer ────────────────────────────────────────────────────────
export const createCustomerAPI = async (
  formData: Partial<CustomerRecord> & { phone?: string; email?: string },
): Promise<CustomerRecord> => {
  try {
    const payload = mapFormToBackend(formData);
    const response = await axios.post(customersApi, payload);

    if (response.data?.data?.customer) return response.data.data.customer;
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating customer:", error);
    throw new Error(error.response?.data?.message || "Error creating customer");
  }
};

// ─── Update Customer ────────────────────────────────────────────────────────
// Backend route: PUT /newcustomer/:id  ← patch nahi, PUT hai
export const updateCustomerAPI = async (
  id: number,
  formData: Partial<CustomerRecord> & {
    phone?: string;
    email?: string;
    dateOfBirth?: string;
  },
): Promise<CustomerRecord> => {
  try {
    const payload = mapFormToBackend(formData);

    // axios.put — route file mein router.route("/:id").put(updateCustomer)
    const response = await axios.put(`${customersApi}/${id}`, payload);

    if (response.data?.data?.customer) return response.data.data.customer;
    if (response.data?.data) return response.data.data;

    // Backend data: null bhejta hai update pe — form data se reconstruct
    return { ...payload, id, customerPhone: payload.customerPhone! };
  } catch (error: any) {
    console.error("Error updating customer:", error);
    throw new Error(error.response?.data?.message || "Error updating customer");
  }
};
