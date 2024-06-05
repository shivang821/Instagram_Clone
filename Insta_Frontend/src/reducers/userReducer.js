import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        isAuthenticate: false,
        loading: false,
        error: null,
        isProfileUpdate:false,
        profileUpdateLoading:false,
        myPosts:[],
        myReels:[],
        hasMorePosts:true,
        hasMoreReels:true,
        isDailyLimitExceed:false,
        screenTime:0,
        Followers:[],
        Followings:[],
        suggestedUsers:[],
        suggestedPosts:[]
    },
    reducers: {
        setUserLoading: (state) => {
            state.loading = true;
        },
        loadUser: (state, action) => {
            state.isAuthenticate = true;
            state.user = action.payload;
            state.loading = false;
        },
        userFail: (state, action) => {
            state.error = action.payload;
            state.loading = false;

        },
        clearUserError: (state) => {
            state.error = null
        },
        profileUpdate_request:(state)=>{
            state.profileUpdateLoading=true;
        },
        profileUpdate_success:(state)=>{
            state.isProfileUpdate=true;
            state.profileUpdateLoading=false;
        },
        profileUpdate_fail:(state,action)=>{
            state.profileUpdateLoading=false;
            state.error=action.payload;
        },
        profileUpdate_reset:(state)=>{
            state.profileUpdateLoading=false;
            state.error=null;
            state.isProfileUpdate=false;
        },
        myPosts_success:(state,action)=>{
            state.loading=false;
            state.myPosts=[...state.myPosts,...action.payload]
        },
        myReels_success:(state,action)=>{
            state.loading=false;
            state.myReels=[...state.myReels,...action.payload]
        },
        user_error:(state,action)=>{
            state.error=action.payload
        },
        clear_user_error:(state)=>{
            state.error=null
        },
        logout_user:(state)=>{
            state.isAuthenticate=false;
            state.user=null;
            state.error=null;
            state.myPosts=[];
            state.myReels=[];
            state.hasMorePosts=true;
            state.hasMoreReels=true;
        },
        update_dailyLimit_exceed:(state,action)=>{
            state.screenTime=action.payload.screenTime;
            state.isDailyLimitExceed=action.payload.exceed;
        },
        handleUserFollowing:(state,action)=>{
            state.user.following=[...action.payload]
        },
        set_followings:(state,action)=>{
            state.Followings=[...action.payload]
        },
        reset_followings:(state)=>{
            state.Followings=[]
        },
        set_followers:(state,action)=>{
            state.Followers=[...action.payload];
        },
        reset_followers:(state)=>{
            state.Followers=[]
        },
        suggestedUsers_success:(state,action)=>{
            state.suggestedUsers=[...action.payload]
        },
        suggestedPosts_success:(state,action)=>{
            state.suggestedPosts=[...action.payload]
        }
    }
})
export const { setUserLoading, loadUser, userFail, clearUserError,profileUpdate_fail,profileUpdate_reset,profileUpdate_success,profileUpdate_request, myReels_success,myPosts_success,clear_user_error,user_error,logout_user,update_dailyLimit_exceed,handleUserFollowing,set_followings,set_followers,reset_followers,reset_followings,suggestedUsers_success,suggestedPosts_success} = userSlice.actions
export default userSlice.reducer