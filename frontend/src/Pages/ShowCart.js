import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function ShowCart() {
    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const [total,setTotal]=useState(0);
    const [cart,setCart]=useState({
        productname:"",
        price:""
    });
    function loaddata(){
        axios.get('http://localhost:8080/showcart').then((response)=>{
            console.log(response.data);
            setCart(response.data);
         })

         axios.get('http://localhost:8080/showtotal').then((response)=>{
            console.log(response.data[0].sum);
            setTotal(response.data[0].sum);
         })
         
    }

    useEffect(()=>{
        axios.get('http://localhost:8080/login').then((response) => {
            // console.log(response);
            if (response.data.loggedin === true) {
                setStatus(response.data.user[0].username);
            }
            else {
                navigate('/');
            }
        })

         loaddata();
        
    },[])


function deleteproduct(id){
    axios.delete(`http://localhost:8080/deleteproductcart/${id}`).catch((err)=>{
        console.log(err);
    });
    alert("Item Deleted Successfully")
    loaddata();
}

  return (
    <div >
        <Link to='/home'>
            <button>Home</button>
        </Link>
        <h1>User Cart</h1>
        


        


        <table className='tablee'>

<tbody>
<tr>
    <th>CID</th>
    <th>Product Name</th>
    <th>Price</th>
    
</tr>
{Object.keys(cart).map(key => {
    const item = cart[key];
    return (
        <tr className=' '>
            <td>{item.id}</td>
            <td>{item.productname}</td>
            <td>{item.saleprice}</td>
            <td><button onClick={()=>deleteproduct(item.id)}>Delete</button></td>


        </tr>

    )
})}

</tbody>
</table>

<div style={{textAlign:'left',marginLeft:"150px"}}>
        <h2 >Total Price: {total}</h2>

        <button>Place Order</button>
</div>


    </div>
  )
}

export default ShowCart