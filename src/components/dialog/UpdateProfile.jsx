import React from "react";
import {
  Biotech as BiotechIcon,
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CameraAlt as CameraAltIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatingProfiel } from "../../redux/reducers/misc";
import { VisuallyHiddenInput } from "../styles/StyledComponent";
import { tranformImage } from "../../libs/features";

const UpdateProfile = ({
  profileData,
  handleInputChange,
  handleAvatarChange,
  handleSave,
  isLoading,
  error,
}) => {
  const { isUpdingProfile } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const closeHandler = () => {
    console.log("close handler");
    dispatch(setUpdatingProfiel(false));
  };

  return (
    <Dialog
      open={isUpdingProfile}
      onClose={closeHandler}
      PaperProps={{
        style: {
          maxWidth: "none",
          margin: "1.5rem",
          position: "absolute",
          right: 0,
        },
      }}
    >
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
          {profileData?.avatar && (
            <Avatar
              src={profileData.avatar}
              sx={{
                width: "10rem",
                height: "10rem",
                objectFit: "contain",
              }}
            />
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
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </>
          </IconButton>
        </Stack>

        <DialogTitle textAlign={"center"}>Edit Profile</DialogTitle>
        <List>
          <ListItem>
            <Tooltip title="Bio">
              <ListItemIcon>
                <BiotechIcon />
              </ListItemIcon>
            </Tooltip>
            <TextField
              variant="outlined"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              fullWidth
            />
          </ListItem>

          <ListItem>
            <Tooltip title="Name">
              <ListItemIcon>
                <FaceIcon />
              </ListItemIcon>
            </Tooltip>
            <TextField
              variant="outlined"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              fullWidth
            />
          </ListItem>

          <ListItem>
            <Tooltip title="Username">
              <ListItemIcon>
                <UsernameIcon />
              </ListItemIcon>
            </Tooltip>
            <TextField
              variant="outlined"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              fullWidth
            />
          </ListItem>
        </List>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button variant="contained" color="error" onClick={closeHandler}>
            <CancelIcon />
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading}
          >
            <SaveIcon />
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Stack>

        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Stack>
    </Dialog>
  );
};

export default UpdateProfile;
