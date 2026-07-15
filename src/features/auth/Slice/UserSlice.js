import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
let savedUser = null;
try{
  const userData = localStorage.getItem("user");
  if(userData && userData !== "undefined") {
    savedUser = JSON.parse(userData);
  }
}catch(error){
    console.error("Error parsing user data from localStorage:", error);
    localStorage.removeItem("user");
    savedUser = null;
}
const initialState = {
  user: savedUser || null,
  isLoggedIn: !! token ,
  token: token || null,
  email: savedUser?.email || null,
  role: savedUser?.role || null,
};

const userSlice = createSlice({
  name: "dr",

  initialState,

  reducers: {
    setUser: (state, action) => {
      console.log("login payload", action.payload);

      state.user = action.payload.user;
      state.email = action.payload.user?.email;
      state.token = action.payload.token;
      state.isLoggedIn = !!token;
      // state.role = user?.role || action.payload.role || null;

      if(token){
        localStorage.setItem("token", action.payload.token);
      }
      // if(user){
      // // localStorage.setItem("user", JSON.stringify(action.payload.user));
      // }
    },

    logout: (state) => {
      state.user = null;
      state.email = null;
      state.token = null;
      state.role = null;
      state.isLoggedIn = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;