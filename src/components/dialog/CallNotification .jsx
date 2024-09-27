import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReceivingCall, setCaller } from "../../redux/reducers/misc";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Adjust the URL to your backend server

const CallNotification = () => {
  const dispatch = useDispatch();
  const { isReceivingCall, caller } = useSelector((state) => state.misc);

  socket.on("incoming-call", (data) => {
    dispatch(setReceivingCall(true));
    dispatch(setCaller(data.caller));
  });

  return (
    <div>
      {isReceivingCall && (
        <div>
          <p>{caller} is calling...</p>
          {/* Accept/Reject buttons can be added here */}
        </div>
      )}
    </div>
  );
};

export default CallNotification;
