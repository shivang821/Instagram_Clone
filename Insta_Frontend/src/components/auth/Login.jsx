import { useEffect, useState } from 'react'
import './login.css'
import InstaWord from './InstaWord.svg'
import { useDispatch, useSelector } from 'react-redux'
import { login, signUp } from '../../actions/userActions'
const Login = () => {
    const dispatch=useDispatch()
    const {error}=useSelector(state=>state.User)
    const [isLoginForm, setLoginForm] = useState(true)
    const [loginUserName,setLoginUserName]=useState("")
    const [loginPassword,setLoginPassword]=useState("")
    const [signUpEmail,setSignUpEmail]=useState("")
    const [signUpName,setSignUpName]=useState("")
    const [signUpUserName,setSignUpUserName]=useState("")
    const [signUpPassword,setSignUpPassword]=useState("")
    const submitSignUp=(e)=>{
        e.preventDefault()
        let signUpData=new FormData()
        signUpData.set('email',signUpEmail)
        signUpData.set('name',signUpName)
        signUpData.set('username',signUpUserName)
        signUpData.set('password',signUpPassword)
        dispatch(signUp(signUpData))
    }
    const submitLogin=(e)=>{
        e.preventDefault()
        let loginData=new FormData()
        loginData.set('username',loginUserName)
        loginData.set('password',loginPassword)
        dispatch(login(loginData))
    }
    useEffect(()=>{
        if(error){
            // console.log(error);
        }
    },[error])
    return (
        <>
            <div className="login" >
                <div className={`loginForm ${isLoginForm?"loginDiv":"signupDiv"}`}>
                    <div><img src={InstaWord} alt="" /></div>
                    {isLoginForm ?
                        <form encType="multipart/form-data" onSubmit={submitLogin} style={{display:!isLoginForm?"none":"flex"}} >
                            <div>
                                <input type="text" required placeholder='Username' value={loginUserName} onChange={(e)=>{setLoginUserName(e.target.value)}} name='email' autoFocus autoComplete='off' />
                            </div>
                            <div>
                                <input type="password" required value={loginPassword} onChange={(e)=>{setLoginPassword(e.target.value)}} name="password" placeholder='Password' />
                            </div>
                            <button type='submit' className='loginBtn'>Login</button>

                            <span className='span' ><div></div><p>OR</p><div></div></span>
                            <p className='questionForSignUp' >Don&apos;t have an account? <span onClick={()=>{setLoginForm(!isLoginForm)}}> Sign up</span></p>
                        </form> :
                        <form encType="multipart/form-data" onSubmit={submitSignUp} style={{display:isLoginForm?"none":"flex"}}>
                            <div>
                                <input type="text" required placeholder='Email' name='signUpEmail' onChange={(e)=>{setSignUpEmail(e.target.value)}} value={signUpEmail}  autoFocus autoComplete='off' />
                            </div>
                            <div>
                                <input type="text" required placeholder='Full Name' name='signUpName' onChange={(e)=>{setSignUpName(e.target.value)}} value={signUpName} autoComplete='off' />
                            </div>
                            <div>
                                <input type="text" required placeholder='Username' onChange={(e)=>{setSignUpUserName(e.target.value)}} value={signUpUserName} name='signUpUserName' autoComplete='off' />
                            </div>
                            <div>
                                <input type="password" required onChange={(e)=>{setSignUpPassword(e.target.value)}} value={signUpPassword} name="signUpPassword" placeholder='Password' />
                            </div>
                            <button type='submit' className='loginBtn signUpBtn'>Sign up</button>

                            <span className='span' ><div></div><p>OR</p><div></div></span>
                            <p className='questionForSignUp' >Have an account? <span onClick={()=>{setLoginForm(!isLoginForm)}}> Log in</span></p>
                        </form>
                    }
                </div>
            </div>
        </>
    )
}

export default Login