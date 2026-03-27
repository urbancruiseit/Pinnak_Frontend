// E:\Pinnak\PINAK_FRONTEND\src\app\features\AnnualReport\annualreportSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnnualReportApi, AnnualReportData } from "./annualReportApi";

interface AnnualReportState {
  daysData: number[][];
  sourceData: number[][];
  paxData: number[][];
  year: number;
  loading: boolean;
  error: string | null;
}

const initialState: AnnualReportState = {
  daysData: [],
  sourceData: [],
  paxData: [],
  year: new Date().getFullYear(),
  loading: false,
  error: null,
};

export const fetchAnnualReport = createAsyncThunk(
  "annualReport/fetchAnnualReport",
  async (year: number, { rejectWithValue }) => {
    try {
      console.log("🔄 Fetching Annual Report for year:", year);
      const response = await getAnnualReportApi(year);
      return response;
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const annualReportSlice = createSlice({
  name: "annualReport",
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnualReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnualReport.fulfilled, (state, action) => {
        state.loading = false;
        state.daysData = action.payload.daysData;
        state.sourceData = action.payload.sourceData;
        state.paxData = action.payload.paxData;
        state.year = action.payload.year;
      })
      .addCase(fetchAnnualReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setYear } = annualReportSlice.actions;
export default annualReportSlice.reducer;