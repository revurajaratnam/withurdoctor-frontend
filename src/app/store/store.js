import { configureStore } from "@reduxjs/toolkit";
import {signinApi} from "../../features/auth/api/signinApi"
import {signupApi} from "../../features/auth/api/signupApi"
import { VerifyEmailApi } from "../../features/auth/api/VerifyEmail";
import { resendOtpApi } from "../../features/auth/api/resendOTP";
import { drDataApi, useDrdataMutation } from "../../features/auth/api/drDataApi";
import userReducer from "../../features/auth/Slice/UserSlice"
import { setupListeners } from "@reduxjs/toolkit/query";
import {  AppointmentBookingApi } from "../../features/auth/api/AppoApi";

export  const store = configureStore({
    reducer:{
        [signupApi.reducerPath] : signupApi.reducer,
        [signinApi.reducerPath] : signinApi.reducer,
        [VerifyEmailApi.reducerPath] : VerifyEmailApi.reducer,
        [resendOtpApi.reducerPath]:resendOtpApi.reducer,
        [drDataApi.reducerPath]:drDataApi.reducer,
        [AppointmentBookingApi.reducerPath] : AppointmentBookingApi.reducer,

    
        
        dr: userReducer

    },
   
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(signupApi.middleware,
                                      signinApi.middleware,
                                      VerifyEmailApi.middleware,
                                      resendOtpApi.middleware,
                                      drDataApi.middleware,
                                      AppointmentBookingApi.middleware,
                                
                                    )
})

setupListeners(store.dispatch)
    