import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

function BuyNow() {
    const {id}=useParams();
    const[details,setDetails]=useState({
        pid:id,
        address:"",
        mode:"",
        orderid:"",
        tracking:0,
        trackingid:0
    });
    function handlechange(event){
        let name = event.target.name;
        let value = event.target.value;
        setDetails((preval) => {
            return {
                ...preval,
                [name]: [value]
            }
        })
    }
    const navigate=useNavigate();
    function handlesubmit(){
        
        // details.orderid=id;
        console.log(details);
        axios.post('http://localhost:8080/addorder', details).then((response) => {
                setDetails({ pid:"",
                    address:"",
                    mode:"",
                    orderid:"",
                    tracking:0,
                    trackingid:0})
                // alert("Order Placed");
            })
            
    }
  return (
    <div>
        
        <p >Add Address</p>
        <input type='text' name="address" onChange={handlechange} />
        <p>Add Mode</p>
        <select name='mode' onChange={handlechange}  >
        <option value={0}>SelectMode</option>
        <option value={1}>Pre-Paid</option>
        <option value={2}>Post-Paid</option>
       </select><br/>
<p></p>
       <Link to="/showorders">
       <button onClick={handlesubmit}>Place Order</button>
       </Link>

    </div>
  )
}

export default BuyNow