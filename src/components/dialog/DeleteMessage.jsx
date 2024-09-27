import { Delete as DeleteIcon } from "@mui/icons-material";
import { Menu, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMessage } from "../../redux/reducers/misc";

const DeleteMessage = () => {
  const dispatch = useDispatch();
  const { isDeleteMessage } = useSelector((state) => state.misc);

  const deleteChatHandler = () => {
    console.log("inside deleteMessage");
  };

  const closeHandler = () => {
    dispatch(setIsDeleteMessage(false));
  };
  return (
    <Menu
      open={isDeleteMessage}
      onClose={closeHandler}
      //   anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={deleteChatHandler}
      >
        <>
          <DeleteIcon /> <Typography>Delete Chat</Typography>
        </>
      </Stack>
    </Menu>
  );
};

export default DeleteMessage;
