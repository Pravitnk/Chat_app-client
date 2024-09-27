import React, { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogutIcon,
  Menu as MenuIcon,
  CircleNotifications as NotificationIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { orange } from "../../constants/color";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsSearch,
  setNewGroup,
  setNotification,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import logo from "../../pages/image/logo2.jpg";

const SearchDialog = lazy(() => import("../specific/Search"));

const NotificationDialog = lazy(() => import("../specific/Notifications"));

const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationsCount } = useSelector((state) => state.chat);

  // const [isValue, setIsValue] = useState(2);

  const HandleMobile = () => {
    dispatch(setIsMobile(true));
  };

  const OpenSearch = () => {
    console.log("HandleOpenSearchDialogue");
    dispatch(setIsSearch(true));
  };

  const HandleOpenNewGroup = () => {
    dispatch(setNewGroup(true));
  };

  const OpenNotifications = () => {
    dispatch(setNotification(true));
    dispatch(resetNotificationCount());
  };

  const NavigateToGroup = () => {
    console.log("NavigateToGroup");
    setIsSearch((prev) => !prev);
    Navigate("/groups");
  };

  const HandleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExist());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          height: "4rem",
        }}
      >
        <AppBar
          position="static"
          sx={{
            // bgcolor: orange,
            bgcolor: "#610cff",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{
                display: { xs: "none", sm: "block" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <img
                src={logo}
                alt="chat app"
                style={{
                  height: "65px",
                  width: "80px",
                }}
              />
              Chat-App
            </Typography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={HandleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <Tooltip title="Search">
                <IconButton color="inherit" size="large" onClick={OpenSearch}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="New Group">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={HandleOpenNewGroup}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Manage Groups">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={NavigateToGroup}
                >
                  <GroupIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={OpenNotifications}
                >
                  {notificationsCount ? (
                    <Badge badgeContent={notificationsCount} color="error">
                      <NotificationIcon />
                    </Badge>
                  ) : (
                    <NotificationIcon />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="LogOut">
                <IconButton color="inherit" size="large" onClick={HandleLogout}>
                  <LogutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};

export default Header;
