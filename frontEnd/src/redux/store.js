import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import documentReducer from './documentSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    document: documentReducer,
  },
});