import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const drDataApi = createApi({
    reducerPath: "drDataApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:4545"
    }),
    endpoints:(build) => ({
        drdata:build.mutation({
            query:(formdata)=>({
                url:"/drdata",
                method:"POST",
                body:formdata,

            }),
            
        }),
        getdrdata:build.query({
            query:()=>({
                url:"/drdata",
                method:"GET"
            })
        })
    })

});

export const { useDrdataMutation , useGetdrdataQuery} = drDataApi;
