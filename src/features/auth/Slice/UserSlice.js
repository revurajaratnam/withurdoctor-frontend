import { createSlice } from "@reduxjs/toolkit";

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Unable to read saved user:", error);
    return null;
  }
};

const savedToken = localStorage.getItem("token");
const savedUser = getSavedUser();
const savedEmail = localStorage.getItem("email");

const initialState = {
  user: savedUser,
  email: savedUser?.email || savedEmail || "",
  token: savedToken || null,

  // Keep login active after page refresh
  isLoggedIn: Boolean(savedToken),
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      const token = action.payload?.token;

      const receivedUser =
        action.payload?.user ||
        action.payload?.doctor ||
        action.payload?.patient ||
        null;

      const receivedEmail =
        receivedUser?.email ||
        action.payload?.email ||
        "";

      state.token = token || null;
      state.user = receivedUser || { email: receivedEmail };
      state.email = receivedEmail;
      state.isLoggedIn = Boolean(token);

      if (token) {
        localStorage.setItem("token", token);
      }

      if (state.user) {
        localStorage.setItem("user", JSON.stringify(state.user));
      }

      if (receivedEmail) {
        localStorage.setItem("email", receivedEmail);
      }
    },

    logout: (state) => {
      state.user = null;
      state.email = "";
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;