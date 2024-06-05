import { createSlice } from '@reduxjs/toolkit';

export const uploadSlice = createSlice({
	name: 'Upload',
	initialState: {
		loading: false,
		success: false,
		error: null
	},
	reducers: {
		UPLOAD_REQUEST: (state) => {
			state.loading = true;
		},
		UPLOAD_SUCCESS: (state) => {
			state.success = true;
			state.loading = false;
		},
        UPLOAD_ERROR:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        UPLOAD_RESET:(state)=>{
            state.success=false;
            state.loading=false;
            state.error=null;
        }
	}
});
export const { UPLOAD_SUCCESS,UPLOAD_REQUEST, UPLOAD_ERROR,UPLOAD_RESET } = uploadSlice.actions;
export default uploadSlice.reducer;
