import { configureStore } from "@reduxjs/toolkit";
import { signupApi } from "../../features/auth/services/signupApi";
import { VerifyEmailApi } from "../../features/auth/services/VerifyEmail";
import { resendOtpApi } from "../../features/auth/services/resendOTP";
import { signinApi } from "../../features/auth/services/signinApi";
import { drDataApi, useDrdataMutation } from "../../features/auth/services/drDataApi";
import userReducer from "../../features/auth/Slice/UserSlice"

export  const store = configureStore({
    reducer:{
        [signupApi.reducerPath] : signupApi.reducer,
        [signinApi.reducerPath] : signinApi.reducer,
        [VerifyEmailApi.reducerPath] : VerifyEmailApi.reducer,
        [resendOtpApi.reducerPath]:resendOtpApi.reducer,
        [drDataApi.reducerPath]:drDataApi.reducer,
    
        
        dr: userReducer

    },
   
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(signupApi.middleware,
                                      signinApi.middleware,
                                      VerifyEmailApi.middleware,
                                      resendOtpApi.middleware,
                                      drDataApi.middleware)
})
    