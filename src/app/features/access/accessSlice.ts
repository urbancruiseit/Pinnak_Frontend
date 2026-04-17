import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  assignTravelAdvisorApi,
  getTravelAdvisorsByCityApi,
} from "./accessApi";

// 🔹 Types
interface TravelAdvisor {
  id: number;
  fullName: string;
}

interface TravelAdvisorState {
  advisors: TravelAdvisor[];
  loading: boolean;
  error: string | null;
  assignLoading: boolean;
  assignSuccess: boolean;
}

// 🔹 Initial State
const initialState: TravelAdvisorState = {
  advisors: [],
  loading: false,
  error: null,
  assignLoading: false,
  assignSuccess: false,
};

//
// ✅ 1. Fetch Advisors
//
export const fetchTravelAdvisors = createAsyncThunk<
  TravelAdvisor[],
  number,
  { rejectValue: string }
>("travelAdvisor/fetchByCity", async (cityId, { rejectWithValue }) => {
  try {
    return await getTravelAdvisorsByCityApi(cityId);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

//
// ✅ 2. Assign Advisor
//
export const assignTravelAdvisor = createAsyncThunk<
  { success: boolean; leadId: number; travelAdvisorId: number },
  { leadId: number; travelAdvisorId: number },
  { rejectValue: string }
>(
  "travelAdvisor/assign",
  async ({ leadId, travelAdvisorId }, { rejectWithValue }) => {
    try {
      return await assignTravelAdvisorApi(leadId, travelAdvisorId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

//
// ✅ Slice
//
const travelAdvisorSlice = createSlice({
  name: "travelAdvisor",
  initialState,
  reducers: {
    resetAssignState: (state) => {
      state.assignSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔹 Fetch Advisors
      .addCase(fetchTravelAdvisors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelAdvisors.fulfilled, (state, action) => {
        state.loading = false;
        state.advisors = action.payload;
      })
      .addCase(fetchTravelAdvisors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch advisors";
      })

      // 🔹 Assign Advisor
      .addCase(assignTravelAdvisor.pending, (state) => {
        state.assignLoading = true;
        state.assignSuccess = false;
      })
      .addCase(assignTravelAdvisor.fulfilled, (state) => {
        state.assignLoading = false;
        state.assignSuccess = true;
      })
      .addCase(assignTravelAdvisor.rejected, (state, action) => {
        state.assignLoading = false;
        state.error = action.payload || "Failed to assign advisor";
      });
  },
});

export const { resetAssignState } = travelAdvisorSlice.actions;

export default travelAdvisorSlice.reducer;
