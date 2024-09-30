import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/Hooks";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);

  // Assuming the logged-in user data is stored in state.auth.user
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend request...", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* <List>
          {users.map((usr) => (
            <UserItem
              user={usr}
              key={usr._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingFriendRequest}
            />
          ))}
        </List> */}

        <List>
          {users
            .filter((usr) => usr._id !== currentUser._id) // Exclude the logged-in user
            .map((usr) => (
              <UserItem
                user={usr}
                key={usr._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingFriendRequest}
              />
            ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
