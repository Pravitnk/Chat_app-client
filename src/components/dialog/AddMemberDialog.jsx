import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/Hooks";
import { useDispatch, useSelector } from "react-redux";
import { setAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, isError, error, data } = useAvailableFriendsQuery(chatId);

  const dispatch = useDispatch();

  const [addGroupMembers, isLoadingAddGroupMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentEle) => currentEle !== id)
        : [...prev, id]
    );
  };

  const cancelAddMember = () => {
    dispatch(setAddMember(false));
  };

  const AddMemberSubmit = () => {
    addGroupMembers("Adding Members", {
      members: selectedMembers,
      chatId,
    });
    cancelAddMember();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={cancelAddMember}>
      <Stack p={"2rem"} width={"20rem"} spacing={"1rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

        <Stack spacing={"0.5rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Users</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button variant="outlined" color="error" onClick={cancelAddMember}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={AddMemberSubmit}
            disabled={isLoadingAddGroupMembers}
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
