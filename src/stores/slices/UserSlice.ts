import { notificationType } from './../../types/notification.d';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserSlice } from '../../types/userSlice';
import { SignUpStackParamList, User } from '@type/*';

const initialState: IUserSlice = {
  accessToken: null,
  profile: null,
  userData: null,
  wishList: [],
  userType: null,
  notaryStep: 0,
  userStep: 0,
  signUpToken: null,
  notification: {
    NotificationsCount: 0,
    NotificationsDetailsList: {},
    status: false,
  },
};

// Define an async thunk to handle registration
export const registerUser = createAsyncThunk('user/register', async (userData, { dispatch }) => {
  // Your asynchronous registration logic here
  // You can dispatch other actions within this thunk
});

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setNotification: (state, action: PayloadAction<notificationType>) => {
      state.notification = action.payload;
    },
    logoutUser: (state) => {
      state.accessToken = null;
    },
    setProfileData: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    removeProfileData: (state) => {
      state.profile = {} as User;
    },
    setUserType: (state, action: PayloadAction<'User' | 'Notary' | null>) => {
      state.userType = action.payload;
    },
    setUserStep: (state, action: PayloadAction<number>) => {
      state.userStep = action.payload;
    },
    setNotaryStep: (state, action: PayloadAction<number>) => {
      state.notaryStep = action.payload;
    },
    setSignUpToken: (state, action: PayloadAction<string>) => {
      state.signUpToken = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(registerUser.pending, (state) => {
  //     state.loading = true;
  //   });
  //   builder.addCase(registerUser.fulfilled, (state, action) => {
  //     state.loading = false;
  //     state.data = action.payload;
  //   });
  //   builder.addCase(registerUser.rejected, (state, action) => {
  //     state.loading = false;
  //     state.error = action.error.message;
  //   });
  // },
});

export const {
  setAccessToken,
  logoutUser,
  setProfileData,
  removeProfileData,
  setUserType,
  setUserStep,
  setNotaryStep,
  setSignUpToken,
  setNotification,
  setUserData,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUser = (state: { user: IUserSlice }) => state.user;
export const selectUserData = (state: { user: IUserSlice }) => state.user.userData;
export const selectAccessToken = (state: { user: IUserSlice }) => state.user.accessToken;
export const selectNotification = (state: { user: IUserSlice }) => state.user.notification;
export const selectProfileData = (state: { user: IUserSlice }) => state.user.profile;
export const selectWishlist = (state: { user: IUserSlice }) => state.user.wishList;
export const selectUserStep = (state: { user: IUserSlice }) => state.user.userStep;
export const selectNotaryStep = (state: { user: IUserSlice }) => state.user.notaryStep;
export const selectSignupToken = (state: { user: IUserSlice }) => state.user.signUpToken;
