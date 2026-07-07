import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";


    export const VerifyEmailApi = createApi({
        reducerPath:"VerifyEmailApi",
        baseQuery:fetchBaseQuery({
            baseUrl:"http://localhost:4545",
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