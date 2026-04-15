import { createApi } from "@reduxjs/toolkit/query/react";
import axiosInstance from "@/uitils/axioInstance";

// ✅ Custom axios base query
const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    data?: any;
    params?: any;
  }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };

interface User {
  uuid: string;
  name: string;
  email: string;
  role?: string;
}

export const assignApi = createApi({
  reducerPath: "assignApi",
  baseQuery: axiosBaseQuery(), // ✅ axiosInstance used here
  tagTypes: ["SalesUsers"],

  endpoints: (builder) => ({
    // ─── GET SALES USERS ─────────────────────
    getSalesUsers: builder.query<User[], void>({
      query: () => ({
        url: "/user/sales",
        method: "GET",
      }),

      providesTags: ["SalesUsers"],

      transformResponse: (response: { success: boolean; data: User[] }) => {
        if (!response?.data || !Array.isArray(response.data)) return [];

        return response.data.filter((user) => {
          if (!user.role) return false;
          const role = user.role.toLowerCase();
          return role === "sales" || role.includes("sales");
        });
      },

      transformErrorResponse: (error) => {
        console.error("Error fetching sales users:", error);
        return error;
      },
    }),

    // ─── ASSIGN USERS ───────────────────────
    assignToUsers: builder.mutation<
      void,
      { entityId: string; userIds: string[] }
    >({
      query: ({ entityId, userIds }) => ({
        url: "/leads/assign",
        method: "POST",
        data: { leadId: entityId, userIds }, // ✅ body → data (axios)
      }),

      invalidatesTags: ["SalesUsers"],
    }),
  }),
});

export const { useGetSalesUsersQuery, useAssignToUsersMutation } = assignApi;
