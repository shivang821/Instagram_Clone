import { createSlice } from "@reduxjs/toolkit";

const reelsSlice=createSlice({
    name:"Reels",
    initialState:{
        loading:false,
        error:null,
        reels:[],
        isReceived:false,
        hasMore:true   
    },
    reducers:{
        REELS_REQUEST:(state)=>{
            state.loading=true;
        },
        REELS_SUCCESS:(state,action)=>{
            state.loading=false;
            state.hasMore=action.payload.hasMore;
            state.reels=[...state.reels,...action.payload.reels];
            state.isReceived=true;
        },
        REELS_ERROR:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        REELS_RESET:(state)=>{
            state.loading=false;
            state.error=null;
        }
    }
})
export const {REELS_ERROR,REELS_REQUEST,REELS_RESET,REELS_SUCCESS}=reelsSlice.actions;
export default reelsSlice.reducer