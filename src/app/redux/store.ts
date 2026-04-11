import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import leadReducer from "../features/lead/leadSlice";
import countryReducer from "../features/countrycode/countrycodeSlice";
import vehicleReducer from "../features/vehicle/vehicleSlice";
import travelcityReducer from "../features/travelcity/travelcitySlice";
import stateCityReducer from "../features/State/stateSlice";
import assignReducer from "../features/access/accessSlice";
import reportReducer from "../features/reports/reportsSlice";
import annualReportReducer from "../features/AnnualReport/annualreportSlice";
import HoursReportReducer from "../features/HoursReport/hoursreportsSlice";
import NewcustomerReducer from "../features/NewCustomer/NewCustomerSlice";
import vendorReducer from "../features/vendor/vendorSlice";
import driverReducer from "../features/Driver/driverSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    lead: leadReducer,
    country: countryReducer,
    vehicle: vehicleReducer,
    travelcity: travelcityReducer,
    stateCity: stateCityReducer,
    report: reportReducer,
    annualReport: annualReportReducer,
    hoursReport: HoursReportReducer,
    assign: assignReducer,
    newCustomer: NewcustomerReducer,
    vendor: vendorReducer,
    driver: driverReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
