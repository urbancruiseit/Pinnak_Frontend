import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerRecord } from "@/types/types";
import {
  createCustomerApi,
  getAllCustomersApi,
  getCustomerByIdApi,
  updateCustomerApi,
  deleteCustomerApi,
} from "./customerApi";

interface CustomerWithUUID extends CustomerRecord {
  uuid: string;
}

interface CustomerState {
  customers: CustomerWithUUID[];
  customer: CustomerWithUUID | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  customer: null,
  loading: false,
  error: null,
};

export const createCustomerThunk = createAsyncThunk<
  CustomerWithUUID,
  CustomerRecord,
  { rejectValue: string }
>("customer/create", async (data, { rejectWithValue }) => {
  try {
    return (await createCustomerApi(data)) as CustomerWithUUID;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to create customer");
  }
});

export const getCustomersThunk = createAsyncThunk<
  CustomerWithUUID[],
  void,
  { rejectValue: string }
>("customer/getAll", async (_, { rejectWithValue }) => {
  try {
    return (await getAllCustomersApi()) as CustomerWithUUID[];
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch customers");
  }
});

export const getCustomerByIdThunk = createAsyncThunk<
  CustomerWithUUID,
  string,
  { rejectValue: string }
>("customer/getById", async (uuid, { rejectWithValue }) => {
  try {
    return (await getCustomerByIdApi(uuid)) as CustomerWithUUID;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to fetch customer");
  }
});

export const updateCustomerThunk = createAsyncThunk<
  CustomerWithUUID,
  { uuid: string; data: CustomerRecord },
  { rejectValue: string }
>("customer/update", async ({ uuid, data }, { rejectWithValue }) => {
  try {
    return (await updateCustomerApi(uuid, data)) as CustomerWithUUID;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to update customer");
  }
});

export const deleteCustomerThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("customer/delete", async (uuid, { rejectWithValue }) => {
  try {
    await deleteCustomerApi(uuid);
    return uuid;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to delete customer");
  }
});

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomerState: (state) => {
      state.error = null;
      state.customer = null;
    },
    clearSelectedCustomer: (state) => {
      state.customer = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create Customer
      .addCase(createCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCustomerThunk.fulfilled,
        (state, action: PayloadAction<CustomerWithUUID>) => {
          state.loading = false;
          state.customer = action.payload;

          const exists = state.customers.some(
            (c) => c.uuid === action.payload.uuid
          );

          if (!exists) {
            state.customers.unshift(action.payload);
          }
        }
      )
      .addCase(createCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create customer";
      })

      // Get All Customers
      .addCase(getCustomersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomersThunk.fulfilled,
        (state, action: PayloadAction<CustomerWithUUID[]>) => {
          state.loading = false;
          state.customers = action.payload;
        }
      )
      .addCase(getCustomersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customers";
      })

      // Get Customer By Id
      .addCase(getCustomerByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomerByIdThunk.fulfilled,
        (state, action: PayloadAction<CustomerWithUUID>) => {
          state.loading = false;
          state.customer = action.payload;
        }
      )
      .addCase(getCustomerByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customer";
      })

      // Update Customer
      .addCase(updateCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCustomerThunk.fulfilled,
        (state, action: PayloadAction<CustomerWithUUID>) => {
          state.loading = false;
          state.customer = action.payload;

          const index = state.customers.findIndex(
            (c) => c.uuid === action.payload.uuid
          );

          if (index !== -1) {
            state.customers[index] = action.payload;
          }
        }
      )
      .addCase(updateCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update customer";
      })

      // Delete Customer
      .addCase(deleteCustomerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCustomerThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;

          state.customers = state.customers.filter(
            (c) => c.uuid !== action.payload
          );

          if (state.customer?.uuid === action.payload) {
            state.customer = null;
          }
        }
      )
      .addCase(deleteCustomerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete customer";
      });
  },
});

export const { clearCustomerState, clearSelectedCustomer } =
  customerSlice.actions;

export default customerSlice.reducer;