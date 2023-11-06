import { configureStore } from '@reduxjs/toolkit';
import userSlice from './Slices';
import navSlice  from './NavSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    nav:navSlice
  },
});

export default store;
