import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CameraAlt as CameraAltIcon,
  Chat,
  Password,
  Visibility,
  VisibilityOff,
  WifiPassword as WifiPasswordIcon,
} from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponent";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator, emailValidator } from "../utils/validators";
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExist } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";
import logo from "./image/logo.png";

const Login = () => {
  const [isLogin, setIslogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const toggleOnClick = () => setIslogin((prev) => !prev);

  const name = useInputValidation("");
  const identifier = useInputValidation("", emailValidator, usernameValidator); // For both username and email
  const email = useInputValidation("", emailValidator);
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const bio = useInputValidation("");

  const avatar = useFileHandler("single");

  //login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const loginData = {
      password: password.value,
    };

    if (identifier.value.includes("@")) {
      loginData.email = identifier.value;
    } else {
      loginData.username = identifier.value;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        loginData,
        config
      );
      dispatch(userExist(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //sing up submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Singing In...");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("email", email.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("bio", bio.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/signUp`,
        formData,
        config
      );

      dispatch(userExist(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000", // Black background
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "60% 40%", // 60% left, 40% right
        position: "relative",
      }}
    >
      {/* Left side - Chat image and welcome text */}
      <div
        style={{
          backgroundImage: `url()`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff",
          padding: "1rem",
          //
          // padding: "1rem",
          height: "100vh",
          position: "fixed",
          width: "60%",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Welcome To Our Chat App
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", marginBottom: "1rem" }}
        ></Typography>

        <img
          src={logo}
          alt="chat app"
          style={{ width: "400px", height: "400px", background: "black" }}
        />
      </div>

      {/* Right side - Password reset form */}

      <div
        style={{
          marginLeft: "103.5%", // Offset the right side by the width of the fixed left side
          padding: "2rem",
          width: "60%",
        }}
      >
        <Container
          component={"main"}
          maxWidth="xs"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative", // Position relative to contain absolutely positioned elements
            top: isLogin ? "4%" : "0%",
            zIndex: 11, // Ensure the form appears above the background
            padding: "2rem",
          }}
        >
          {/* Purple circles at corners */}
          <div
            style={{
              opacity: "0.4",
              position: "absolute",
              top: isLogin ? "-5.5%" : "-3.5%",
              left: isLogin ? "-11%" : "-12%",
              width: "180px",
              height: "180px",
              // backgroundColor: "#610cff",

              backgroundImage:
                "linear-gradient(36deg, rgba(52,185,236,1) 10%, rgba(52,185,236,1) 10%, rgba(155,4,181,0.804359243697479) 73%)",
              borderRadius: "50%",
              zIndex: -1, // Behind the form
            }}
          />
          <div
            style={{
              opacity: "0.4",
              position: "absolute",
              bottom: isLogin ? "-3%" : "-2%",
              right: "-6%",
              width: "130px",
              height: "130px",
              // backgroundColor: "#610cff",
              backgroundImage:
                "linear-gradient(36deg, rgba(155,4,181,1) 25%, rgba(52,185,236,1) 87%)",
              borderRadius: "50%",
              zIndex: -1, // Behind the form
            }}
          />

          {/* Grid layout with two columns */}
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Paper
                elevation={4}
                sx={{
                  height: isLogin ? "70vh" : "120vh",
                  padding: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "12px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Black with 50% opacity for blur effect
                  backdropFilter: "blur(10px)", // Blur effect
                  border: "2px solid #610cff", // Purple border
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)", // Shadow effect
                }}
              >
                {isLogin ? (
                  <>
                    <Typography variant="h5" color={"#610cff"}>
                      Login
                    </Typography>
                    <form
                      style={{
                        width: "100%",
                        marginTop: "2rem",
                      }}
                      onSubmit={handleLogin}
                    >
                      <TextField
                        required
                        fullWidth
                        label="Username/Email"
                        margin="normal"
                        variant="outlined"
                        value={identifier.value}
                        onChange={identifier.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                      />

                      <TextField
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        margin="normal"
                        variant="outlined"
                        value={password.value}
                        onChange={password.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                sx={{ color: "#610cff" }}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Button
                        sx={{
                          marginTop: "1.5rem",
                          // bgcolor: "#610cff",
                          backgroundImage:
                            "linear-gradient(36deg, rgba(52,185,236,1) 4%, rgba(155,4,181,0.9472163865546218) 63%)",
                        }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                      >
                        Login
                      </Button>
                      <Stack
                        alignItems={"flex-end"}
                        sx={{
                          my: 2,
                        }}
                      >
                        <Link
                          component={RouterLink}
                          to="/forgot-password"
                          variant="subtitle4"
                        >
                          Forgot Password
                        </Link>
                      </Stack>
                      <Typography
                        textAlign={"center"}
                        m={"1rem"}
                        color={"white"}
                      >
                        Or
                      </Typography>
                      <Button
                        disabled={isLoading}
                        variant="text"
                        fullWidth
                        onClick={toggleOnClick}
                      >
                        Sign Up
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" color={"#610cff"}>
                      Sign Up
                    </Typography>
                    <form
                      style={{
                        width: "100%",
                        marginTop: "1rem",
                      }}
                      onSubmit={handleSignUp}
                    >
                      <Stack
                        position={"relative"}
                        width={"10rem"}
                        margin={"auto"}
                      >
                        <Avatar
                          sx={{
                            width: "10rem",
                            height: "10rem",
                            objectFit: "contain",
                          }}
                          src={avatar.preview}
                        />
                        {avatar.error && (
                          <Typography color="error" variant="caption">
                            {avatar.error}
                          </Typography>
                        )}

                        <IconButton
                          sx={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            backgroundColor: "white",
                            ":hover": {
                              bgcolor: "rgb(0, 0, 0, 0.5)",
                            },
                          }}
                          component="label"
                        >
                          <>
                            <CameraAltIcon />
                            <VisuallyHiddenInput
                              type="file"
                              onChange={avatar.changeHandler}
                            />
                          </>
                        </IconButton>
                      </Stack>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        margin="normal"
                        variant="outlined"
                        value={name.value}
                        onChange={name.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                      />
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        margin="normal"
                        variant="outlined"
                        value={email.value}
                        onChange={email.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                      />
                      {email.error && (
                        <Typography color="error" variant="caption">
                          {email.error}
                        </Typography>
                      )}

                      <TextField
                        required
                        fullWidth
                        label="Username"
                        margin="normal"
                        variant="outlined"
                        value={username.value}
                        onChange={username.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                      />
                      {username.error && (
                        <Typography color="error" variant="caption">
                          {username.error}
                        </Typography>
                      )}

                      <TextField
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        margin="normal"
                        variant="outlined"
                        value={password.value}
                        onChange={password.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={(e) => e.preventDefault()}
                                sx={{ color: "#610cff" }}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {password.error && (
                        <Typography color="error" variant="caption">
                          {password.error}
                        </Typography>
                      )}
                      <TextField
                        required
                        fullWidth
                        label="Bio"
                        margin="normal"
                        variant="outlined"
                        value={bio.value}
                        onChange={bio.changeHandler}
                        sx={{
                          backgroundColor: "#000", // Black background for input
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#610cff", // Purple border for input
                          },
                          "& .MuiInputLabel-root": {
                            color: "#fff", // White label color
                          },
                          "& .MuiInputBase-input": {
                            color: "#fff", // White text color
                          },
                        }}
                      />

                      <Button
                        sx={{
                          marginTop: "1rem",
                          // bgcolor: "#610cff",
                          backgroundImage:
                            "linear-gradient(36deg, rgba(52,185,236,1) 4%, rgba(155,4,181,0.9472163865546218) 63%)",
                        }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                      >
                        Sing Up
                      </Button>

                      <Typography
                        textAlign={"center"}
                        m={"1rem"}
                        color={"white"}
                      >
                        Or
                      </Typography>
                      <Button
                        disabled={isLoading}
                        variant="text"
                        fullWidth
                        onClick={toggleOnClick}
                      >
                        Login
                      </Button>
                    </form>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Login;
