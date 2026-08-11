import { createApi ,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAutoLogout } from "../../auth/api/baseQuery";

export const signinApi=createApi({
    reducerPath:"signinApi",
    
    baseQuery: baseQueryWithAutoLogout,
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:4545",
        //this is the autorization
        prepareHeaders:(headers) => {
            const tokens = localStorage.getItem("token");
            // console.log(tokens);
            if(tokens){
                headers.set("Authorization",`Bearer ${tokens}`)
            }
            return headers;
        }
    }),
    endpoints:(build)=>({
        Signin:build.mutation({
            query:(DrData) =>({
                url:"/Login",
                method:"POST",
                body:DrData
            })
        }),
       
        UserLogin:build.mutation({
            query:(formdata)=>({
                url:"/user",
                method:"POST",
                body:formdata,
            })
        }),
        Dashboard: build.query({
            query:() => ({
                url:"/Profile",
                method:"GET"
            })
        }),
   
    



        
    })
   
    

})

export  const{ useSigninMutation , useDashboardQuery , useUserLoginMutation ,useUserInfoDataQuery} = signinApi;