import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function ShowOrders() {
    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const [orderdetails,setOrderDetails]=useState({
        productname:"",
        orderid:"",
        address:"",
        tracking:"",
        trackingid:""
    });
    useEffect(()=>{
        axios.get('http://localhost:8080/login').then((response)=>{
            console.log(response);
            if(response.data.loggedin===true){
                setStatus(response.data.user[0].username);
            }
            else{
                navigate('/');
            }
        })
        axios.get('http://localhost:8080/showorders').then((response)=>{
            console.log(response.data);
            setOrderDetails(response.data);
        })
        
    },[])
  return (
    <div>
<Link to='/home'>
            <button>Home</button>
        </Link>
<h1>Order List</h1>
<div className='listt'>
                <h1>Your Orders</h1>
                <table className='tablee'>

                    <tbody>
                    <tr>
                        <th>Item Id</th>
                        <th>Product Name</th>
                        <th>Order Id</th>
                        <th>Address</th>

                        <th>Tracking Status</th>
                        <th>Tracking Id</th>

                        
                    </tr>
                    {orderdetails && Object.keys(orderdetails).map(key => {
                        const item = orderdetails[key];
                        return (
                            <tr key={item.id} className=' '>
                                <td>{item.id}</td>
                                <td>{item.productname}</td>
                                <td>{item.orderid}</td>
                                <td>{item.address}</td>

                                <td>{item.tracking === 0 ? 'Not Confirmed' : item.tracking === 1 ? 'Confirmed' : item.tracking === 2 ? 'Declined' : "Delivered"}</td>
                                <td>{item.trackingid}</td>


                            </tr>

                        )
                    })}
                    </tbody>
                </table>
            </div>

















    </div>
  )
}

export default ShowOrders