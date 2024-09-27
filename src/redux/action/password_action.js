// src/store/actions/authActions.js

import axios from "axios";

export const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE";

export const forgotPasswordRequest = () => ({
  type: FORGOT_PASSWORD_REQUEST,
});

export const forgotPasswordSuccess = (data) => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: data,
});

export const forgotPasswordFailure = (error) => ({
  type: FORGOT_PASSWORD_FAILURE,
  payload: error,
});

export const forgotPassword = (email) => {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return async (dispatch) => {
    dispatch(forgotPasswordRequest());
    try {
      const response = await axios.post(
        `${server}/api/v1/user/forgot-password`,
        { email },
        config
      );
      console.log(response);
      dispatch(forgotPasswordSuccess(response.data));
    } catch (error) {
      dispatch(forgotPasswordFailure(error.message));
    }
  };
};
