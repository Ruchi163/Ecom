import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function OrderPanel() {
    const navigate = useNavigate();
    const [status, setStatus] = useState();

    const [orderdetails, setOrderDetails] = useState({
        productname: "",
        orderid: "",
        address: "",
        tracking: "",
        trackingid: ""
    });
    function loaddata() {
        axios.get('http://localhost:8080/login').then((response) => {
            // console.log(response);
            if (response.data.loggedin === true) {
                setStatus(response.data.user[0].username);
            }
            else {
                navigate('/');
            }
        })
        axios.get('http://localhost:8080/showallorders').then((response) => {
            // console.log(response.data);
            setOrderDetails(response.data);
        })
    }
    useEffect(() => {

        loaddata();
    }, [])


    function handleAccept(orderid) {

        let ans = prompt("Enter Tracking Id", "");
        console.log(ans);
        axios.get(`http://localhost:8080/settrackingid/${orderid}/${ans}`);
        loaddata();
    }


    function handleDecline(orderid) {
        axios.get(`http://localhost:8080/decline/${orderid}`)
        loaddata();
    }
    function handleDelivered(orderid) {
        axios.get(`http://localhost:8080/delivered/${orderid}`)
        loaddata();
    }

    return (
        <div>
            <h1>Admin Panel Order List</h1>
            <Link to='/admin'>
                <button>Admin</button>
            </Link>

            <div className='listt'>
                <h1>Your Orders</h1>
                <table className='tablee'>

                    <tbody>
                        <tr>
                            <th>Item Id</th>
                            <th>Product Id</th>
                            <th>Username</th>
                            <th>Product Name</th>
                            <th>Order Id</th>
                            <th>Address</th>
                            <th>Payment Method</th>
                            <th>Tracking Status</th>
                            <th>Tracking Id</th>

                        </tr>
                        {orderdetails && Object.keys(orderdetails).map(key => {
                            const item = orderdetails[key];
                            return (
                                <tr key={item.id} className=' '>
                                    <td>{item.id}</td>
                                    <td>{item.pid}</td>
                                    <td>{item.username}</td>
                                    <td>{item.productname}</td>
                                    <td>{item.orderid}</td>
                                    <td>{item.address}</td>
                                    <td>{item.mode==1 ? "Pre-Paid":"Post-Paid"}</td>
                                    {/* <td>{item.tracking}</td> */}
                                    {item.tracking === 0 && (
                                        <>
                                            <td>
                                                <button onClick={() => handleAccept(item.orderid)} >Accept</button>
                                                <button onClick={() => handleDecline(item.orderid)} >Decline</button>
                                            </td>

                                        </>
                                    )}
                                    {item.tracking === 1 && (
                                        <>
                                            <td>
                                                Confirmed
                                                <button onClick={() => handleDelivered(item.orderid)} >Delivered</button>
                                            </td>

                                        </>
                                    )}
                                    {item.tracking === 2 && (
                                        <>
                                            <td>
                                                Declined
                                            </td>

                                        </>
                                    )}
                                    {item.tracking === 3 && (
                                        <>
                                            <td>
                                                Delivered
                                            </td>
                                        </>
                                    )}
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

export default OrderPanel