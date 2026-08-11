import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../Slice/UserSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",

  prepareHeaders: (headers, { getState }) => {
    const reduxToken = getState()?.dr?.token;
    const localToken = localStorage.getItem("token");

    const token = reduxToken || localToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithAutoLogout = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(
    args,
    api,
    extraOptions
  );

  if (result?.error?.status === 401) {
    api.dispatch(logout());

    if (
      window.location.pathname !==
      "/LoginAndSignupDashboard"
    ) {
      window.location.replace(
        "/LoginAndSignupDashboard"
      );
    }
  }

  return result;
};