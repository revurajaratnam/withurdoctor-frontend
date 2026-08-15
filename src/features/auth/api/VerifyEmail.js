import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";


    export const VerifyEmailApi = createApi({
        reducerPath:"VerifyEmailApi",
        baseQuery:fetchBaseQuery({
            baseUrl:import.meta.env.VITE_API_URL,
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