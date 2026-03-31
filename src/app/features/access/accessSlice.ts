// features/access/accessSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/types";
import { baseApi } from "@/uitils/commonApi";

interface AssignState {
  salesUsers: User[];
  loading: boolean;
  error: string | null;
  assignLoading: boolean;
  assignError: string | null;
  selectedUserId: string | null; // Single user selection
}

const initialState: AssignState = {
  salesUsers: [],
  loading: false,
  error: null,
  assignLoading: false,
  assignError: null,
  selectedUserId: null,
};

// Fetch all sales users
export const fetchSalesUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("assign/fetchSalesUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseApi}/user/sales`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch sales users");
    }
    
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }
    
    return data.data;
    
  } catch (error: any) {
    console.error("Error fetching sales users:", error);
    return rejectWithValue(error.message);
  }
});

// Assign lead to single user (Simple Assignment)
export const assignLeadToUser = createAsyncThunk<
  void,
  { leadId: string; userId: string },
  { rejectValue: string }
>("assign/assignLeadToUser", async ({ leadId, userId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseApi}/assign/assign`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId: leadId,
        userId: userId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Assignment failed");
    }
    
    return data;
    
  } catch (error: any) {
    console.error("Error assigning lead:", error);
    return rejectWithValue(error.message);
  }
});

const assignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUserId = null;
    },
    clearAssignError: (state) => {
      state.assignError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAssignState: (state) => {
      state.salesUsers = [];
      state.loading = false;
      state.error = null;
      state.assignLoading = false;
      state.assignError = null;
      state.selectedUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales users
      .addCase(fetchSalesUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.salesUsers = action.payload;
      })
      .addCase(fetchSalesUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Assign lead to user
      .addCase(assignLeadToUser.pending, (state) => {
        state.assignLoading = true;
        state.assignError = null;
      })
      .addCase(assignLeadToUser.fulfilled, (state) => {
        state.assignLoading = false;
        state.selectedUserId = null;
      })
      .addCase(assignLeadToUser.rejected, (state, action) => {
        state.assignLoading = false;
        state.assignError = action.payload as string;
      });
  },
});

export const { 
  setSelectedUser, 
  clearSelectedUser, 
  clearAssignError, 
  clearError,
  resetAssignState 
} = assignSlice.actions;

export default assignSlice.reducer;