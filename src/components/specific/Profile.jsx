import React, { Suspense, useState } from "react";
import {
  Avatar,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  Backdrop,
} from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalenderIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import moment from "moment";
import { tranformImage } from "../../libs/features";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatingProfiel } from "../../redux/reducers/misc";
import UpdateProfile from "../dialog/UpdateProfile";
import { useUpdateUserProfileMutation } from "../../redux/api/api";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isUpdingProfile } = useSelector((state) => state.misc);
  const [updateUserProfile, { isLoading, error }] =
    useUpdateUserProfileMutation();
  const [profileData, setProfileData] = useState({
    bio: user?.bio,
    username: user?.username,
    name: user?.name,
    avatar: user?.avatar?.url || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const tempUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        avatar: tempUrl,
        avatarFile: file, // store the file separately
      }));
    }
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", profileData.bio);
      formData.append("username", profileData.username);
      formData.append("name", profileData.name);
      if (profileData.avatarFile) {
        formData.append("avatar", profileData.avatarFile);
      }

      const response = await updateUserProfile(formData).unwrap();
      const updatedUser = response.user;

      // Update the profile data with the new avatar URL from the server response
      setProfileData((prev) => ({
        ...prev,
        avatar: updatedUser.avatar.url,
        avatarFile: null,
      }));

      dispatch(setUpdatingProfiel(false)); // Close the dialog after saving
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const editProfile = (e) => {
    e.preventDefault();
    dispatch(setUpdatingProfiel(true));
  };

  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Tooltip title="Edit">
        <IconButton
          sx={{
            position: "absolute",
            right: 0,
            color: "white",
          }}
          onClick={editProfile}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      {isUpdingProfile && (
        <Suspense fallback={<Backdrop open />}>
          <UpdateProfile
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleAvatarChange={handleAvatarChange}
            handleSave={handleSave}
            isLoading={isLoading}
            error={error}
          />
        </Suspense>
      )}

      <Avatar
        // src={tranformImage(user?.avatar?.url)}
        src={typeof profileData.avatar === "string" ? profileData.avatar : ""}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />

      <ProfileCard heading={"Bio"} text={profileData.bio} />
      <ProfileCard
        heading={"UserName"}
        text={profileData.username}
        Icon={<UsernameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={profileData.name}
        Icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"grey"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
