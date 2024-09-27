import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config";
import { useDispatch } from "react-redux";
import { userExist } from "../reducers/auth";

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${server}/api/v1/user/forgot-password`,
        { email },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resettPassword",
  async ({ token, password, passwordConfirm }, { rejectWithValue }) => {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        `${server}/api/v1/user/reset-password`,
        { token, password, passwordConfirm },
        config
      );

      console.log(response.data.user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// export const resetPassword = createAsyncThunk(
//   "auth/resetPassword",
//   async (
//     { token, password, passwordConfirm },
//     { rejectWithValue, dispatch }
//   ) => {
//     const config = {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     try {
//       const response = await axios.post(
//         `${server}/api/v1/user/reset-password`,
//         { token, password, passwordConfirm },
//         config
//       );

//       // After successful password reset, fetch user profile
//       const profileResponse = await axios.get(
//         `${server}/api/v1/user/myProfile`,
//         { withCredentials: true }
//       );
//       dispatch(userExist(profileResponse.data.user)); // Dispatch userExist action with user data
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );
