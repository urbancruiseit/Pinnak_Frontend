import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMonthlyReportApi,
  MonthlyReportRecord,
} from "./reportsApi";

interface ReportState {
  data: MonthlyReportRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchMonthlyReport = createAsyncThunk(
  "report/fetchMonthlyReport",
  async (year: number, { rejectWithValue }) => {
    try {
      console.log("🔄 Fetching for year:", year);
      const response = await getMonthlyReportApi(year);
      return response;
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reportSlice.reducer;