import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import validator from 'email-validator';


axios.defaults.withCredentials=true;

function Login() {
    const navigate=useNavigate();
    const [loginStatus,setLoginStatus]=useState();
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    function hashing(password) {
        password = password.toString();
        const search = 'a';
        const replaceWith = '-';

        const ans = password.split(search).join(replaceWith);
        return ans;
    }
    function handlechange(event) {
        let value = event.target.value;
        let name = event.target.name;
        setUser((preval) => {
            return {
                ...preval,
                [name]: [value]
            }
        })

    }
    

    function handlesubmit(event) {
        console.log(user);
        if (!user.email || !user.password) {
            alert("Please provide data");
        }
        else {
            user.password = hashing(user.password);
            axios.post("http://localhost:8080/login",user).then((response)=>{
                setUser({email:"",password:""})
                if(response.data.message){
                    setLoginStatus(response.data.message);
                }
                else{
                    setLoginStatus(response.data[0].username);
                    if(response.data[0].type==1){
                        setTimeout(()=>navigate('/admin'),500)
                    }
                    else{
                        setTimeout(()=>navigate('/home'),500)
                    }
                }
            }).catch((err)=>{
                console.log(err);
            })
            
        }
    }




    const [isValidEmail, setIsValidEmail] = useState();
    function handlechange1(event) {

        const { value } = event.target;
        setUser((preval) => {
            return {
                ...preval,
                email: [value]
            }
        })


        if (validator.validate(value)) {
            setIsValidEmail(true);
        }
        else if(value==''){
            setIsValidEmail();
        }
        else{
            setIsValidEmail(false);
        }

    }
    const [click, setClick] = useState(false);
    return (
        <React.Fragment>
            <div className='maindiv'>
                <div className='logindiv'>
                <h1>Login Here</h1>
                <p>Email Id</p>
            <input type='text' name='email' value={user.email} onChange={handlechange1} onClick={() => setClick(true)} /><br />
            {click == true ? isValidEmail ? (<p style={{ color: "green" }}>Valid email address!</p>) : (<p style={{ color: "red" }}>Invalid email address!</p>): ""}

                <p>Password</p>
                <input type='text' name='password' value={user.password} onChange={handlechange} /><br />
                <button onClick={() => {
                    if(isValidEmail){
                        handlesubmit();
                    }
                    else{
                        window.alert("Incorrect Details");
                    }
                }}>Login</button>
                {/* <button onClick={handlesubmit}>Login</button> */}
                <Link to='/signup'>
                    <button>SignUp</button>
                </Link>
                {loginStatus}
            </div>
            </div>
        </React.Fragment>
    )
}

export default Login