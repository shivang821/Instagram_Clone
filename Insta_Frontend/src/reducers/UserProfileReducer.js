import { createSlice } from "@reduxjs/toolkit";

export const userProfileSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userPosts: [],
    userReels: [],
    hasMorePosts: true,
    hasMoreReels: true,
    Followers: [],
    Followings: [],
  },
  reducers: {
    loadUserProfile: (state, action) => {
      state.user = action.payload;
    },
    userPosts_success: (state, action) => {
      state.userPosts = [...state.userPosts, ...action.payload];
    },
    userReels_success: (state, action) => {
      state.userReels = [...state.userReels, ...action.payload];
    },
    set_user_following: (state, action) => {
      state.Followings = [...action.payload];
    },
    set_user_followers: (state, action) => {
      state.Followers = [...action.payload];
    },
    reset_user_profile: (state) => {
      state.user = null;
      state.userPosts = [];
      state.userReels = [];
      state.Followers = [];
      state.Followings = [];
      state.hasMorePosts = true;
      state.hasMoreReels = true;
    },
  },
});
export const { loadUserProfile, userReels_success, userPosts_success ,reset_user_profile} =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
