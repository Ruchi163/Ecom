import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import validator from 'email-validator';

import './Login.css'
function Signup() {

    const [user, setUser] = useState({
        email: "",
        username: "",
        password: "",
        timecreated: "",
        type: 0
    })

    function handlechange(event) {

        let name = event.target.name;
        let value = event.target.value;
        setUser((preval) => {
            return {
                ...preval,
                [name]: [value]
            }
        })
    }

    function hashing(password) {
        password = password.toString();
        const search = 'a';
        const replaceWith = '-';

        const ans = password.split(search).join(replaceWith);
        return ans;
    }
    function check() {
        let admin = prompt("Enter the code for admin");
        if (admin == '1234') {
            return 1;
        }
        else {
            return 0;
        }
    }

    const navigate = useNavigate();
    function handlesubmit(event) {
        if (!user.email || !user.password || !user.username) {
            alert("Enter valid details");
        }
        else {
            if (user.type == '1') {
                user.type = check();
            }
            var date = new Date();
            date = date.toISOString().slice(0, 19).replace('T', ' ');
            user.timecreated = date;
            user.password = hashing(user.password);
            axios.post("http://localhost:8080/adduser", user).then((response) => {
                setUser({
                    email: '',
                    password: '',
                    username: '',
                    timecreated: "",
                    type: 0
                })
            }).catch((err) => {
                console.log(err);
            })
            setTimeout(() => navigate('/'), 500)
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
    const [click1, setClick1] = useState(false);
    const [username1, setUsername1] = useState();
    function handlechange2(event) {

        const { value } = event.target;
        setUser((preval) => {
            return {
                ...preval,
                username: [value]
            }
        })
        for (let i = 0; i < value.length; i++) {
            const charCode = value.charCodeAt(i);
            if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
                setUsername1(false);
            }
            else {
                setUsername1(true);
            }
        }

    }

    return (
        <>
            <div className='maindiv'>
                <div className='logindivv'>
                <h1>Sign Up</h1>
            <p>Email Id</p>
            <input type='text' name='email' value={user.email} onChange={handlechange1} onClick={() => setClick(true)} /><br />
            {click == true ? isValidEmail ? (<p style={{ color: "green" }}>Valid email address!</p>) : (<p style={{ color: "red" }}>Invalid email address!</p>): ""}

            <p>Username</p>
            <input type='text' name='username' value={user.username} onChange={handlechange2} onClick={() => setClick1(true)} /><br />
            {click1 == true ? username1 ? (<p style={{ color: "green" }}>Valid username !</p>) : (<p style={{ color: "red" }}>Invalid username !</p>): ""}
            <p>Password</p>
            <input type='text' name='password' value={user.password} onChange={handlechange} /><br />
                <p></p>
            <input type="radio" value="1" name="type" onChange={handlechange} /> Admin
            <input type="radio" value="0" name="type" onChange={handlechange} /> User<br />
            <button onClick={() => {
                if(isValidEmail && username1){
                    handlesubmit();
                }
                else{
                    window.alert("Incorrect Details");
                }
            }}>Sign Up</button>

                </div>
            </div>

        </>
    )
}

export default Signup