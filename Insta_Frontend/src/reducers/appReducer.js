import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
    name: "App",
    initialState: {
        modalOpen:false,
        device:"",
        darkmode:localStorage.getItem('darkmode')
    },
    reducers: {
        SET_MODAL_OPEN :(state,action)=>{
            state.modalOpen=action.payload
        },
        SET_dEVICE:(state,action)=>{
            state.device=action.payload
        },
        SET_DARKMODE:(state,action)=>{
            state.darkmode=action.payload
        }
    }
})
export const { SET_MODAL_OPEN,SET_dEVICE,SET_DARKMODE} = appSlice.actions
export default appSlice.reducer