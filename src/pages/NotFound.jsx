import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        alignItems={"center"}
        spacing={"1.5rem"}
        justifyContent={"center"}
        height={"100%"}
      >
        <ErrorIcon sx={{ fontSize: "8rem" }} />
        <Typography variant="h2">404</Typography>
        <Typography variant="h3">Not Found</Typography>
        <Typography>
          Go back to Home page <Link to="/">click</Link>
        </Typography>
      </Stack>
    </Container>
  );
};

export default NotFound;
