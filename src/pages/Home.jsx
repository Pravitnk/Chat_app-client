import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
  // const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItmes: "center",
        justifyContent: "center",
        // backgroundImage:
        //   "linear-gradient(0deg, rgba(28,179,223,0.5802696078431373) 0%, rgba(96,53,204,0.8183648459383753) 87%)",
        backgroundImage:
          "Url(https://www.techgrapple.com/wp-content/uploads/2016/08/beautiful-sky-whatsapp-chat-background.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "50wh",
        height: "110vh",
      }}
      // minHeight={"100%"}
    >
      <Box
        style={{
          height: "60vh",
          width: "40vw",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: "50px",

          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "50px",
          boxShadow: "0 20px 32px 0 rgba(0, 0, 0, 0.77)",
        }}
      >
        <Typography
          p={"2rem"}
          // variant="h2"
          variant={"h2"}
          fontSize={{
            xs: "2rem",
            sm: "2.2rem",
            md: "2.5rem",
            lg: "2.8rem",
            xl: "3rem",
          }}
          textAlign={"center"}
          color={"white"}
        >
          WELCOME
          <Typography
            // fontSize={"1.3rem"}
            fontSize={{
              xs: "1rem",
              sm: "1.2rem",
              md: "1.5rem",
              lg: "1.8rem",
              xl: "2rem",
            }}
          >
            Select the Friend to chat
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout()(Home);
