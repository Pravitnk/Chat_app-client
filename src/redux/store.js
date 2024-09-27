import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import ChatSlice from "./reducers/chat";
import audioCallReducer from "./thunks/audioCall"; // Ensure correct import of the audioCall slice
import videoCallReducer from "./thunks/videoCall";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [api.reducerPath]: api.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [ChatSlice.name]: ChatSlice.reducer,
    audioCall: audioCallReducer, // Ensure the audioCall slice is added correctly
    videoCall: videoCallReducer,
  },
  middleware: (defaultMiddleWare) => [...defaultMiddleWare(), api.middleware],
});

export default store;
