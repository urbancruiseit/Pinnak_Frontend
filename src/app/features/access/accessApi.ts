// assignApi.ts - Make sure your API is properly defined
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "@/uitils/commonApi";

interface User {
  uuid: string;
  name: string;
  email: string;
  role?: string;
}

export const assignApi = createApi({
  reducerPath: "assignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApi,
    credentials: "include",
  }),
  tagTypes: ["SalesUsers"],
  endpoints: (builder) => ({
    getSalesUsers: builder.query<User[], void>({
      query: () => "/user/sales",
      providesTags: ["SalesUsers"],
      transformResponse: (response: { success: boolean; data: User[] }) => {
        // Ensure response.data exists and is an array
        if (!response || !response.data || !Array.isArray(response.data)) {
          return [];
        }

        // Filter only sales users
        const salesUsers = response.data.filter((user) => {
          if (!user.role) return false;
          const userRole = user.role.toLowerCase();
          return userRole === "sales" || userRole.includes("sales");
        });

        return salesUsers;
      },
      transformErrorResponse: (error) => {
        console.error("Error fetching sales users:", error);
        return error;
      },
    }),

    assignToUsers: builder.mutation<
      void,
      { entityId: string; userIds: string[] }
    >({
      query: ({ entityId, userIds }) => ({
        url: "/leads/assign",
        method: "POST",
        body: { leadId: entityId, userIds },
      }),
      invalidatesTags: ["SalesUsers"],
    }),
  }),
});

export const { useGetSalesUsersQuery, useAssignToUsersMutation } = assignApi;
