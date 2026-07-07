import { createApi ,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signinApi=createApi({
    reducerPath:"signinApi",
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
            query:(UserData)=>({
                url:"/userlogin",
                method:"POST",
                body:UserData,
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