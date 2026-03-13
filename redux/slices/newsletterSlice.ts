import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscribeNewsletter } from "@/API/home";

interface NewsletterState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: NewsletterState = {
  loading: false,
  success: false,
  error: null,
};

export const subscribeEmail = createAsyncThunk(
  "newsletter/subscribeEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await subscribeNewsletter(email);

      if (res?.success) {
        return res;
      }

      return rejectWithValue(res?.message);
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  },
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    resetNewsletter: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(subscribeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetNewsletter } = newsletterSlice.actions;
export default newsletterSlice.reducer;
