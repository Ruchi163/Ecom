import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css'
function Admin() {
    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const [users, setUsers] = useState();

    const [fileFile, setFile] = useState(null);

    
  



    const [product, setProduct] = useState({
        productname: "",
        category: "",
        image_path: "0",
        description: "",
        price: "",
        saleprice: "",
        quantity: 0
    })
    const [product1, setProduct1] = useState({
        productname: "",
        category: "",
        image_path: "0",
        description: "",
        price: "",
        saleprice: "",
        quantity: 0
    })
    const [data, setData] = useState([]);
    const [user, setUser] = useState({
        categoryname: "",
    })

    useEffect(() => {
        axios.get('http://localhost:8080/login').then((response) => {
            // console.log(response);
            if (response.data.loggedin === true) {
                setStatus(response.data.user[0].username);
            }
            else {
                navigate('/');
            }
        })
    }, [])

    async function loaddata() {
        const response = await axios.get('http://localhost:8080/showcategory', user);
        setData(response.data);
        const response1 = await axios.get('http://localhost:8080/showproduct', product);

        setProduct(response1.data);
        const response2 = await axios.get('http://localhost:8080/showuser', users);
        setUsers(response2.data);

    }

    useEffect(() => {

        loaddata();

    }, [])



    function logout() {
        axios.get('http://localhost:8080/logout').then((response) => {
            console.log(response);
            navigate('/');
        })
    }

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

    
    function handlesubmit(event) {
        if (!user.categoryname) {
            alert("Enter details");
        }
        else {
            axios.post('http://localhost:8080/addcategory', user).then((response) => {
                setUser({ categoryname: "" })
                alert("Category Added");
            })
            loaddata();
        }
    }

    function deleteCategory(id) {
        if (window.confirm("Are you sure you want to delete the category")) {
            axios.delete(`http://localhost:8080/deletecategory/${id}`);
            loaddata();
        }
    }

    function deleteProduct(id) {
        if (window.confirm("Are you sure you want to delete the product ")) {
            axios.delete(`http://localhost:8080/deleteproduct/${id}`);
            loaddata();
        }
    }

    function deleteUser(id) {
        if (window.confirm("Are you sure you want to remove the user")) {
            axios.delete(`http://localhost:8080/deleteuser/${id}`);
            loaddata();
        }
    }

    function updateProduct(id) {
        let num = parseInt(prompt("Update the Quantity to"));
        console.log(typeof num);
        if (isNaN(num)) {
            alert("Invalid input!");
        }

        axios.put(`http://localhost:8080/updatequantity/${id}/${num}`);
        loaddata();
    }



    function handlechange1(event) {
        let name = event.target.name;
        let value = event.target.value;
        setProduct1((preval) => {
            return {
                ...preval,
                [name]: [value]
            }
        })
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };
    
 


    function handlesubmit1(event) {
        if (!product1.productname || !product1.category || !product1.description || !product1.price || !product1.saleprice || !product1.image_path) {
            alert("Enter Details");
        }
        else {
            event.preventDefault();
            
            // product1.image_path=file;
            // console.log(product1.image_path);
            axios.post('http://localhost:8080/addproduct', product1).then((response) => {
                setProduct1({
                    productname: "",
                    category: "",
                    image_path: "0",
                    description: "",
                    price: 0,
                    saleprice: 0
                })
                alert("Product Added");
            }).catch((err)=>{
                console.log("Error");
                console.log(err);
            })
            loaddata();
        }
    }







    return (
        <div>
            <div className='navbar'>
                
                <div>
                    <h1>Admin Panel</h1>
                    <h2>Welcome {status}</h2>
                </div>
                <Link to='/home'>
                    <button>Home</button>
                </Link>
                <Link to='/orderpanel'>
                    <button>Order Panel</button>
                </Link>
                <button onClick={logout}>Logout</button>
                

            </div>

            <div className='topbox'>
                <div className='box'>
                    <h1 className='boxhead'>Add Category</h1>
                    <p>Enter Category Name</p>
                    <input type='text' onChange={handlechange} name='categoryname' value={user.categoryname} />
                    <button onClick={handlesubmit}>Submit</button>
                    <div className='list'>
                        <h1>List of Categories</h1>
                        <table className='table'>
                            <tbody>
                            <tr>
                                <th>Id.No</th>
                                <th>Category Name</th>
                            </tr>
                            {data.map((item) => {
                                return (
                                    
                                    <tr key={item.id} className='flexx '>
                                        <td>{item.id}</td>
                                        <td>{item.categoryname}</td>
                                        <td><button onClick={() => deleteCategory(item.id)} >Delete</button></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className='box'>
                    <h1 className='boxhead'>Add Product</h1>
                    <div className='boxinput'>


                        <p>ProductName</p>
                        <input type='text' onChange={handlechange1} name='productname' value={product1.productname} />
                        <p>Category</p>
                        {/* <input type='text' onChange={handlechange1} name='category' value={product1.category} /> */}

                        <select name='category' onChange={handlechange1} value={product1.category} >
                            <option value={0}>Select Category</option>
                            {data.map((item) => {
                                return (

                                    <option value={item.id}>{item.categoryname}</option>

                                )
                            })}
                        </select>


                        <p>ImagePath</p>
                        {/* <input type='text' onChange={handlechange1} name='image_path' value={product1.image_path} /> */}


                        <input type="file" name='image_path' id="imageInput" onChange={handleFileChange} />
                       {/* <button onClick={handleupload}>Upload</button> */}




                        <p>Description</p>
                        <input type='text' onChange={handlechange1} name='description' value={product1.description} />
                        <div>
                            <p>Price</p>
                            <input type='text' onChange={handlechange1} name='price' value={product1.price} />
                            <p>Sale Price</p>
                            <input type='text' onChange={handlechange1} name='saleprice' value={product1.saleprice} />
                            <p>Quantity</p>
                            <input type='text' onChange={handlechange1} name='quantity' value={product1.quantity} />
                        </div>
                        <p> </p>
                        <button onClick={handlesubmit1}>Add Product</button>
                    </div>

                </div>
            </div>








            <div className='listt'>
                <h1>List of Products</h1>
                <table className='tablee'>

                    <tbody>
                    <tr>
                        <th>Item Id</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Sale Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                    {Object.keys(product).map(key => {
                        const item = product[key];
                        return (
                            <tr key={item.id} className=' '>
                                <td>{item.id}</td>
                                <td>{item.productname}</td>
                                <td>{item.categoryname}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>{item.saleprice}</td>
                                <td>{item.quantity}</td>
                                <td><button onClick={() => deleteProduct(item.id)}>Delete </button>
                                <button onClick={() => updateProduct(item.id)}>Update </button></td>


                            </tr>

                        )
                    })}
                    </tbody>
                </table>
            </div>




            <div className='listt'>
                <h1>List of Users</h1>
                <table className='tablee'>
                    <tbody>

                    <tr>
                        <th>User Id</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>IsAdmin</th>
                        <th>Actions</th>

                    </tr>
                    {users && Object.keys(users).map(key => {
                        const item = users[key];
                        return (
                            <tr key={item.id} className=' '>
                                <td>{item.id}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>{item.type==0 ? "User" : "Admin"}</td>
                                <td><button onClick={() => deleteUser(item.id)}>Delete </button></td>

                            </tr>

                        )
                    })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Admin