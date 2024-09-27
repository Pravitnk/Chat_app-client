import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { emailValidator } from "../utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { forgotPassword } from "../redux/thunks/auth.password";
import logo from "../pages/image/logo.png";

// import ChatImage from "./path/to/your/chat-image.jpg"; // Replace with your actual chat image path

const ForgotPassword = () => {
  // const email = useInputValidation("", emailValidator);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { forgotPasswordLoading, resetURL, forgotPasswordError } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (resetURL) {
      setEmail("");
    }
  }, [resetURL]);

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
                  Forgot Password
                </Typography>
                <Typography align="center" sx={{ color: "#fff" }}>
                  Please enter your email address to receive an OTP to reset
                  your{" "}
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
                    label="Email Address"
                    margin="normal"
                    variant="outlined"
                    autoComplete="email"
                    autoFocus
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? "Loading..." : "Submit"}
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
                {forgotPasswordError && (
                  <Typography variant="body2" sx={{ color: "red", mt: 2 }}>
                    {forgotPasswordError}
                  </Typography>
                )}

                {resetURL && (
                  <Typography variant="body2" sx={{ color: "green", mt: 2 }}>
                    Reset link sent to your email. Please check your inbox
                    (including spam folder).
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

export default ForgotPassword;
