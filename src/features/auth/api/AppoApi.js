import { createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";



      export const AppointmentBookingApi=  createApi({
                reducerPath:"AppointmentBooking",
                baseQuery: fetchBaseQuery({
                    baseUrl:"https://withurdoctor.onrender.com",
                    prepareHeaders : (headers ,{getState}) =>{
                        const reduxToken = getState()?.dr?.token;
      const localToken = localStorage.getItem("token");

      const token = reduxToken || localToken;

    //   console.log("Appointment request token:", token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
                    }
                }),
                endpoints:(builder) =>(
                    {
                        AppointmentBooking:builder.mutation({
                            query:(booking)=>({
                                url:"/appointmentBooking",
                                method:"POST",
                                body:booking,
                            })
                        })
                    }
                )
       })

       export const {useAppointmentBookingMutation} = AppointmentBookingApi;