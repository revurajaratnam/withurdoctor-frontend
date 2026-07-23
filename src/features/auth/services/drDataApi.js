import {
    createApi,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
  
  export const drDataApi = createApi({
    reducerPath: "drDataApi",
  
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:4545",
  
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
  
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
  
        return headers;
      },
    }),
  
    tagTypes: ["Doctors", "Appointments"],
  
    endpoints: (build) => ({
      drdata: build.mutation({
        query: (formData) => ({
          url: "/drdata",
          method: "POST",
          body: formData,
        }),
  
        invalidatesTags: ["Doctors"],
      }),
  
      getdrdata: build.query({
        query: ({
          cursor = "",
          search = "",
          location = "",
          specialization = "",
          phone = "",
          id = "",
          gender = "",
          experienceMin = "",
          experienceMax = "",
          consultationFeeMin = "",
          consultationFeeMax = "",
        } = {}) => {
          const params = new URLSearchParams();
  
          if (cursor) {
            params.set("cursor", cursor);
          }
  
          if (search) {
            params.set("search", search);
          }
  
          if (location) {
            params.set("location", location);
          }
  
          if (specialization) {
            params.set("specialization", specialization);
          }
  
          if (phone) {
            params.set("phone", phone);
          }
  
          if (id) {
            params.set("id", id);
          }
  
          if (gender) {
            params.set("gender", gender);
          }
  
          if (experienceMin !== "") {
            params.set("experienceMin", experienceMin);
          }
  
          if (experienceMax !== "") {
            params.set("experienceMax", experienceMax);
          }
  
          if (consultationFeeMin !== "") {
            params.set(
              "consultationFeeMin",
              consultationFeeMin
            );
          }
  
          if (consultationFeeMax !== "") {
            params.set(
              "consultationFeeMax",
              consultationFeeMax
            );
          }
  
          return {
            url: `/drdata?${params.toString()}`,
            method: "GET",
          };
        },
  
        providesTags: ["Doctors"],
      }),
  
      appointment: build.mutation({
        query: (appointmentData) => ({
          url: "/book",
          method: "POST",
          body: appointmentData,
        }),
  
        invalidatesTags: ["Appointments"],
      }),
    }),
  });
  
  export const {
    useDrdataMutation,
    useLazyGetdrdataQuery,
    useGetdrdataQuery,
    useAppointmentMutation,
  } = drDataApi;