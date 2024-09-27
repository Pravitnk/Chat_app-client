import { React, memo } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/Hooks";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const CloseNotificationHandle = () => {
    dispatch(setNotification(false));
  };

  const { isLoading, data, isError, error } = useGetNotificationQuery();

  const [acceptFriendRequest] = useAsyncMutation(
    useAcceptFriendRequestMutation
  );

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setNotification(false));

    await acceptFriendRequest("Accepting Friend request....", {
      requestId: _id,
      accept,
    });
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isNotification} onClose={CloseNotificationHandle}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.AllRequests?.length > 0 ? (
              data?.AllRequests?.map(({ sender, _id }) => (
                <NotificationsItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No Notifications yet</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationsItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} send your Friend Request`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
