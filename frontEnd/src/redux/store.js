// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import documentReducer from './documentSlice';
import versionReducer from './versionSlice';

 const store = configureStore({
  reducer: {
    user: userReducer,
    documents: documentReducer,
    versions: versionReducer,
  },
});

export default store;
