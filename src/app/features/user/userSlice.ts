import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/types/types";
import { createUser, currentUser, loginUser } from "./userApi";

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  createdUser?: User | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  createdUser: null,
};

export const loginUserThunk = createAsyncThunk<
  User,
  { email: string; password: string }
>("user/login", async (loginData, { rejectWithValue }) => {
  try {
    const user = await loginUser(loginData);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message || "Login failed");
  }
});
export const currentUserThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/current", async (_, { rejectWithValue }) => {
  try {
    const user = await currentUser();
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message || "Unauthorized");
  }
});

export const createUserThunk = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>("user/create", async (formData, { rejectWithValue }) => {
  try {
    const user = await createUser(formData);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message || "User creation failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CURRENT USER
      .addCase(currentUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        currentUserThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      )
      .addCase(currentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error = action.payload || null;
      })

      // create user
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createUserThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.createdUser = action.payload;
        },
      )
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



// app/features/lead/leadSlice.ts
export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Update failed');
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads?page=${page}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Fetch failed');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const { logout } = userSlice.actions;
export default userSlice.reducer;
