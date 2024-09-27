import { useStrongPassword } from "6pp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Link,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../redux/thunks/auth.password";
import { useDispatch, useSelector } from "react-redux";
import logo from "../pages/image/logo.png";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const password = useStrongPassword();
  const confirmPassword = useStrongPassword();
  const nevigate = useNavigate();

  const dispatch = useDispatch();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const { resetPasswordSuccess, resetPasswordLoading, resetPasswordError } =
    useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      resetPassword({
        token,
        password: password.value,
        passwordConfirm: confirmPassword.value,
      })
    );
  };

  useEffect(() => {
    if (resetPasswordSuccess) {
      // Redirect to profile page after successful password reset
      nevigate("/");
    }
  }, [resetPasswordSuccess, nevigate]);

  return (
    <div
      style={{
        backgroundColor: "#000", // Black background
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "60% 40%", // 60% left, 40% right
      }}
    >
      {/* Left side - Chat image and welcome text */}
      <div
        style={{
          // backgroundColor: "grey",
          backgroundImage: `url()`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff",
          padding: "1rem",
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
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // Position relative to contain absolutely positioned elements
          zIndex: 11, // Ensure the form appears above the background
          padding: "2rem",
        }}
      >
        {/* Purple circles at corners */}
        <div
          style={{
            opacity: "0.4",
            position: "absolute",
            top: "5%",
            left: "-11%",
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
            bottom: "9%",
            right: "-7%",
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
            {/* Right half - Password reset form */}
            <Paper
              elevation={6}
              sx={{
                height: "70vh",
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
              <Stack
                alignItems={"center"}
                spacing={2}
                sx={{
                  width: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#610cff" }}
                >
                  Reset Password
                </Typography>
                <Typography align="center" sx={{ color: "#fff" }}>
                  Please enter your new{" "}
                  <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                    password
                  </span>
                  .
                </Typography>
                <form
                  style={{
                    width: "100%",
                    marginTop: "2rem",
                  }}
                  onSubmit={handleSubmit}
                >
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    variant="outlined"
                    value={confirmPassword.value}
                    onChange={confirmPassword.changeHandler}
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
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    sx={{
                      marginTop: "1.5rem",
                      padding: "0.75rem",
                      // bgcolor: "#610cff",
                      backgroundImage:
                        "linear-gradient(36deg, rgba(52,185,236,1) 4%, rgba(155,4,181,0.9472163865546218) 63%)",
                    }}
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={resetPasswordLoading}
                  >
                    {resetPasswordLoading ? "Loading..." : "Reset"}
                  </Button>

                  <Stack
                    direction={"row"}
                    justifyContent={"flex-end"}
                    sx={{
                      mt: 2,
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to="/login"
                      variant="body2"
                      sx={{ color: "#fff" }}
                    >
                      Back to Sign In
                    </Link>
                  </Stack>
                </form>
                {resetPasswordError && (
                  <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
                    {resetPasswordError}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ResetPassword;
