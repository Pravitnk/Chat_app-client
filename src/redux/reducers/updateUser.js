import { createSlice } from "@reduxjs/toolkit";
import { updateUserProfile } from "../thunks/auth.update";

const initialState = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },

    userNotExist: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success("Profile updated successfully!");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to update profile");
      });
  },
});

export default userSlice.reducer;
export const { userExist, userNotExist } = userSlice.actions;
