import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import membersApi from "./memberSlice";
import plansApi from "./plansSlice";



const store = configureStore({
    reducer:{
        auth:authReducer,
        membersApi:membersApi.reducer,
        plansApi:plansApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(membersApi.middleware, plansApi.middleware),
   
})

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;