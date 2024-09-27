import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios directly from its package
import { server } from "../../constants/config";
import { getSocket } from "../../Socket";

// Initial state
const initialState = {
  open_audio_dialog: false,
  open_audio_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
  incoming: false,
};

// Thunks
axios.defaults.withCredentials = true;

const startAudioCall = createAsyncThunk(
  "audioCall/startAudioCall",
  async (requestData, { getState, dispatch }) => {
    try {
      console.log("Starting audio call with requestData:", requestData.id);

      dispatch(resetAudioCallQueue());
      console.log("resetAudioCallQueue:", resetAudioCallQueue());

      const { token } = getState().auth;
      if (!requestData.id) {
        throw new Error("id is undefined");
      }
      if (!token) {
        throw new Error("Token is undefined");
      }
      const apiUrl = `${server}/api/v1/chat/start-audio-call`;
      const requestDataToSend = {
        id: requestData.id,
        // Add other necessary fields from requestData
      };
      console.log("Requesting API:", apiUrl);
      console.log("Request data:", requestDataToSend);

      const { data } = await axios.post(apiUrl, requestDataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        transformRequest: [(data) => JSON.stringify(data)],
      });

      console.log("Response data:", data);
      dispatch(
        slice.actions.pushToAudioCallQueue({
          call: data.data,
          incoming: false,
        })
      );
    } catch (error) {
      console.error("Error starting audio call:", error);
      throw error; // Rethrow the error to propagate it
    }
  }
);

const handleIncomingCall = createAsyncThunk(
  "audioCall/handleIncomingCall",
  async (call, { dispatch, getState }) => {
    console.log("Handling incoming call:", call);

    dispatch(slice.actions.pushToAudioCallQueue({ call, incoming: true }));
  }
);

// Slice
const slice = createSlice({
  name: "audioCall",
  initialState,
  reducers: {
    pushToAudioCallQueue(state, action) {
      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload.call);
        if (action.payload.incoming) {
          state.open_audio_notification_dialog = true; // Open notification dialog for incoming call
          state.incoming = true;
        } else {
          state.open_audio_dialog = true; // Open audio dialog for outgoing call
          state.incoming = false;
        }
      } else {
        const socket = getSocket();
        socket.emit("user_is_busy_audio_call", {
          call: {
            _id: action.payload.call._id,
          },
        });
      }
    },

    resetAudioCallQueue(state) {
      state.call_queue = [];
      state.open_audio_notification_dialog = false;
      state.incoming = false;
    },
    closeNotificationDialog(state) {
      state.open_audio_notification_dialog = false;
    },
    updateCallDialog(state, action) {
      console.log("updateCallDialog called with action:", action);
      state.open_audio_dialog = action.payload.state;
      state.open_audio_notification_dialog = false;
    },
  },
});

// Exporting actions
export const {
  resetAudioCallQueue,
  closeNotificationDialog,
  updateCallDialog,
} = slice.actions;

// Exporting thunks
export { startAudioCall, handleIncomingCall };

// Reducer
export default slice.reducer;
