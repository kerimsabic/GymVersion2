import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import membersApi from "./memberSlice";



const store = configureStore({
    reducer:{
        auth:authReducer,
        membersApi:membersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(membersApi.middleware),
   
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;