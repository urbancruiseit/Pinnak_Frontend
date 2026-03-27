import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMonthlyReportApi, MonthlyHourReportRecord } from "./hoursreportsApi";

interface ReportState {
  data: MonthlyHourReportRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchHoursReport = createAsyncThunk<
  MonthlyHourReportRecord[],
  number,
  { rejectValue: string }
>(
  "hoursreport/fetchHoursReport",
  async (year, { rejectWithValue }) => {
    try {
      const response = await getMonthlyReportApi(year);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Failed to fetch report"
      );
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoursReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoursReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // MonthlyHourReportRecord[]
      })
      .addCase(fetchHoursReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default reportSlice.reducer;