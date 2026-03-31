import { baseApi } from "@/uitils/commonApi";
import axios from "axios";
import type { User } from "@/types/types";

interface LoginData {
  email: string;
  password: string;
}
const loginApi = `${baseApi}/user`;
export const loginUser = async (data: LoginData): Promise<User> => {
  try {
    console.log("login form data", data);
    const response = await axios.post<User>(`${loginApi}/login`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const currentUser = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${loginApi}/current-user`, {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Current user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unauthorized");
  }
};

export const createUser = async (formData: Partial<User>): Promise<User> => {
  try {
    console.log("create user", formData);
    const response = await axios.post<User>(loginApi, formData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error("Create User Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "User creation failed");
  }
};
