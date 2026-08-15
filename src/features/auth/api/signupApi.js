import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signupApi= createApi({
    reducerPath:"signupApi",
    baseQuery:fetchBaseQuery({
        baseUrl:import.meta.env.VITE_API_URL,
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