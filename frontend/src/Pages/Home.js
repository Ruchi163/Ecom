import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
function Home() {
    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const [product, setProduct] = useState({
        productname: "",
        category: "",
        image_path: "0",
        description: "",
        price: "",
        saleprice: "",
        quantity: 0
    })

    useEffect(() => {
        axios.get('http://localhost:8080/login').then((response) => {
            console.log(response);
            if (response.data.loggedin === true) {
                setStatus(response.data.user[0].username);
            }
            else {
                navigate('/');
            }
        })
        axios.get('http://localhost:8080/showproduct', product).then((response) => {
            console.log(response.data);
            setProduct(response.data);
        })

    }, [])


    function addtocart(pid) {
        axios.post(`http://localhost:8080/addtocart/${pid}`);
    }

    function logout() {
        axios.get('http://localhost:8080/logout').then((response) => {
            console.log(response);
            navigate('/');
        })
    }

    return (
        <div>
            <div className='navbarcss'>
                <h2>Home</h2>
                <h2>Welcome Back {status}</h2>
                <Link to='/showorders'>
                    <button style={{width:'150px'}}>Show Orders</button>
                </Link>
                <Link to='/showcart'>
                    <button>Cart</button>
                </Link>

                <button onClick={logout}>Logout</button>

            </div>



            <div>
                <h1>List of Products</h1>
                <div className='cards'>

                    {product && Object.keys(product).map(key => {
                        const item = product[key];
                        return (
                            <div className=' listbox'>

                                <p>Product Name: {item.productname}  </p>
                                <p>Category: {item.categoryname}     </p>
                                <p>Description: {item.description}  </p>
                                <p >Price: <label style={{textDecoration:"line-through"}}>{item.saleprice}</label>  <label> {item.price} </label> 

                                
                                <label style={{ color: "red" }}>{item.quantity < 6 && item.quantity>0 ? "Limited Stock" : " "}</label> </p>
                                {item.quantity<1 ?"Out Of Stock":
                                <p><Link to={`/buynow/${item.id}`}>
                                <button >Buy Now</button>
                            </Link>

                            <button onClick={() => addtocart(item.id)}>Add To Cart</button></p>
                        }
                                <p>Quantity: {item.quantity}     </p>


                            </div>

                        )
                    })}

                </div>

            </div>





        </div>
    )
}

export default Home