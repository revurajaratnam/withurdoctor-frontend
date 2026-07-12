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
        getdrdata: build.query({
            query:({cursor , search , location ,phone , id , gender,experienceMin , experienceMax , consultationFeeMin,consultationFeeMax}={}) => {
                const params = new URLSearchParams();
                if(cursor) params.append("cursor" , cursor);
                if(search) params.append("search",search);
                if(location) params.append("location",location);
                if(id) params.append("id",id);
                if(gender) params.append("gender",gender)
                if(experienceMin) params.append("experienceMin",experienceMin)
                if(experienceMax) params.append("experienceMax",experienceMax)
                if(consultationFeeMin) params.append("consultationFeeMin",consultationFeeMin)
                if(consultationFeeMax) params.append("consultationFeeMax",consultationFeeMax)
                if(phone) params.append("phone",phone)


                return `/drdata?${params.toString()}`;

            },
        })
    })

});

export const { useDrdataMutation ,useLazyGetdrdataQuery , useGetdrdataQuery} = drDataApi;
