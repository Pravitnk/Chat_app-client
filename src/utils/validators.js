import { isValidUsername, isValidEmail } from "6pp";

export const usernameValidator = (username) => {
  if (!isValidUsername(username))
    return { isValid: false, errorMessage: "invalid username" };
};

export const emailValidator = (email) => {
  if (!isValidEmail(email))
    return { isValid: false, errorMessage: "invalid email" };
};
