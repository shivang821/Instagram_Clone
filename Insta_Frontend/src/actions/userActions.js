import axios from 'axios'
import { setUserLoading, userFail, loadUser, clearUserError, profileUpdate_request, profileUpdate_success, profileUpdate_fail, user_error, myPosts_success, myReels_success } from '../reducers/userReducer'


export const login = (user) => async(dispatch) => {
    try {
        dispatch(setUserLoading());
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post('/api/login', user, config)
        dispatch(loadUser(data.user));
        localStorage.setItem('isAutheticate', true)
    } catch (error) {
        localStorage.setItem('isAutheticate', false)
        dispatch(userFail(error.response.data.message))
    }
}

export const signUp = (userData) => async(dispatch) => {
    try {
        dispatch(setUserLoading())
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post('/api/signup', userData, config)
        dispatch(loadUser(data.user));
        localStorage.setItem('isAutheticate', true)

    } catch (error) {
        localStorage.setItem('isAutheticate', false)
        dispatch(userFail(error.response.data.message))
    }
}

export const fetchUser = () => async(dispatch) => {
    try {
        dispatch(setUserLoading())
        const { data } = await axios.get("/api/me");
        dispatch(loadUser(data.user))
        localStorage.setItem('isAutheticate', true)
    } catch (error) {
        console.log(error);
        localStorage.setItem('isAutheticate', false)
        dispatch(userFail(error.response.data.message))
    }
}
export const updateUser=(myForm)=>async(dispatch)=>{
    try {
        console.log(myForm.get('files'));
        dispatch(profileUpdate_request());
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		await axios.patch('/api/me', myForm , config);
        dispatch(profileUpdate_success())
    } catch (error) {
        dispatch(profileUpdate_fail(error.response.data.error))
    }
}
export const getMyPosts=()=>async(dispatch)=>{
    try {
        dispatch(setUserLoading());
        const {data}=await axios.get('/api/myposts');
        dispatch(myPosts_success(data.posts));
    } catch (error) {
        console.log(error);
        dispatch(user_error("somthing went wrong"))
    }
}
export const getMyReels=()=>async(dispatch)=>{
    try {
        dispatch(setUserLoading());
        const {data}=await axios.get('/api/myreels');
        dispatch(myReels_success(data.reels));
    } catch (error) {
        console.log(error);
        dispatch(user_error("somthing went wrong"))
    }
}
export const ClearUserErrors = () => async(dispatch) => {
    localStorage.setItem('isAutheticate', false)
    dispatch(clearUserError())
}


// ********** production mode *************

// export const login = (user) => async(dispatch) => {
//     try {
//         dispatch(setUserLoading());
//         const config = { headers: { "Content-Type": "application/json" } };
//         const { data } = await axios.post('/login', user, config)
//         dispatch(loadUser(data.user));
//         localStorage.setItem('isAutheticate', true)
//     } catch (error) {
//         localStorage.setItem('isAutheticate', false)
//         dispatch(userFail(error.response.data.message))
//     }
// }

// export const signUp = (userData) => async(dispatch) => {
//     try {
//         dispatch(setUserLoading())
//         const config = { headers: { "Content-Type": "application/json" } };
//         const { data } = await axios.post('/signup', userData, config)
//         dispatch(loadUser(data.user));
//         localStorage.setItem('isAutheticate', true)

//     } catch (error) {
//         localStorage.setItem('isAutheticate', false)
//         dispatch(userFail(error.response.data.message))
//     }
// }

// export const fetchUser = () => async(dispatch) => {
//     try {
//         dispatch(setUserLoading())
//         const { data } = await axios.get("/me");
//         dispatch(loadUser(data.user))
//         localStorage.setItem('isAutheticate', true)
//     } catch (error) {
//         console.log(error);
//         localStorage.setItem('isAutheticate', false)
//         dispatch(userFail(error.response.data.message))
//     }
// }

// export const ClearUserErrors = () => async(dispatch) => {
//     localStorage.setItem('isAutheticate', false)
//     dispatch(clearUserError())
// }