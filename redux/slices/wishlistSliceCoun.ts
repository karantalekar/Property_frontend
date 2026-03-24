import { createSlice } from "@reduxjs/toolkit";

const wishlistCountReducer = createSlice({
  name: "wishlistCount",
  initialState: {
    count: 0,
  },
  reducers: {
    wishlistUpdated: (state) => {
      state.count += 1;
    },
  },
});

export const { wishlistUpdated } = wishlistCountReducer.actions;
export default wishlistCountReducer.reducer;
