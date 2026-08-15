import { createApi ,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

       export const resendOtpApi =createApi({
            reducerPath:"resendOtpApi",
            baseQuery:fetchBaseQuery({
                baseUrl:"https://withurdoctor.onrender.com",
            }),
            endpoints:(build) =>({
                resendOTP : build.mutation({
                    query:(OtpVerify)=>({
                        url:"/resendOTP",
                        method:"POST",
                        body:OtpVerify,
                    })
                })
            })
            
        })

    export const {useResendOTPMutation} = resendOtpApi;