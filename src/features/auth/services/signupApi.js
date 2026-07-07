import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signupApi= createApi({
    reducerPath:"signupApi",
    baseQuery:fetchBaseQuery({
        baseUrl:'http://localhost:4545',
    }),
    endpoints:(build) => ({
        signUp :build.mutation({
            query:(DoctorsData) => ({
                url:"/signup",
                method:"POST",
                body: DoctorsData,
                responseHandler:'text'
            }),
           

        })
    })
})

export const{ useSignUpMutation} =  signupApi;