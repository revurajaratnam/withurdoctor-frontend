import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";


    export const VerifyEmailApi = createApi({
        reducerPath:"VerifyEmailApi",
        baseQuery:fetchBaseQuery({
            baseUrl:"https://withurdoctor.onrender.com",
        }),
        endpoints:(build) =>({
            verify:build.mutation({
                query:(VerifyEmail)=>({
                    url:"/VerifyEmail",
                    method:"POST",
                    body: VerifyEmail
                })
            })
        })
    })


    export const { useVerifyMutation } = VerifyEmailApi;