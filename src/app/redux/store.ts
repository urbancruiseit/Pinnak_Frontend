import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import leadReducer from "../features/lead/leadSlice";
import countryReducer from "../features/countrycode/countrycodeSlice";
import vehicleReducer from "../features/vehicle/vehicleSlice";
import travelcityReducer from "../features/travelcity/travelcitySlice";
import customerReducer from "../features/Customer/customerSlice";
import stateCityReducer  from "../features/State/stateSlice";

import reportReducer from "../features/reports/reportsSlice";
import annualReportReducer from "../features/AnnualReport/annualreportSlice";
import HoursReportReducer from "../features/HoursReport/hoursreportsSlice";
import { userApi } from "../features/user/userApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    lead: leadReducer,
    country: countryReducer,
    vehicle: vehicleReducer,
    travelcity: travelcityReducer,
    customer: customerReducer,
    stateCity: stateCityReducer ,
    report: reportReducer,
    annualReport: annualReportReducer,
    hoursReport: HoursReportReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
