import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobile: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  isDeleteMessage: false,
  uploadingLoader: false,
  selectDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  isUpdingProfile: false,
  isVideoCall: false,
  isAudioCall: false,
  isReceivingCall: false,
  caller: null,
  callAccepted: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setIsDeleteMessage: (state, action) => {
      state.isDeleteMessage = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectDeleteChat: (state, action) => {
      state.selectDeleteChat = action.payload;
    },
    setUpdatingProfiel: (state, action) => {
      state.isUpdingProfile = action.payload;
    },
    setVideoCall: (state, action) => {
      state.isVideoCall = action.payload;
    },
    setReceivingCall: (state, action) => {
      state.isReceivingCall = action.payload;
    },
    setCaller: (state, action) => {
      state.caller = action.payload;
    },
    setCallAccepted: (state, action) => {
      state.callAccepted = action.payload;
    },
    setAudioCall: (state, action) => {
      state.isAudioCall = action.payload;
    },
  },
});

export default miscSlice;
export const {
  setNewGroup,
  setAddMember,
  setNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setIsDeleteMessage,
  setUploadingLoader,
  setSelectDeleteChat,
  setUpdatingProfiel,
  setVideoCall,
  setAudioCall,
  setReceivingCall,
  setCaller,
  setCallAccepted,
} = miscSlice.actions;
