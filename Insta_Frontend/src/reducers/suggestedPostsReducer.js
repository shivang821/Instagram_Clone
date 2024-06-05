import { createSlice } from "@reduxjs/toolkit";

export const suggestedPostsSlice = createSlice({
  name: "suggestedPosts",
  initialState: {
    suggestedPosts: [],
    hasMore: true,
    loading:false
  },
  reducers: {
    loadSuggestedPosts:(state)=>{
        state.loading=true
    },
    setSuggestedPosts:(state,action)=>{
        state.loading=false;
        state.suggestedPosts=[...state.suggestedPosts,...action.payload.posts];
        if(action.payload.hasMore){
          state.hasMore=true;
        }else{
          state.hasMore=false
        }
    }
  },
});
export const { loadSuggestedPosts, setSuggestedPosts} =
suggestedPostsSlice.actions;
export default suggestedPostsSlice.reducer;
