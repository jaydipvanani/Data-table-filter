// ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Home = () => {

     let base_url = "http://localhost:3001/Books"

    let name = useRef();
    let price = useRef();
    let Pimage = useRef();
    let Author = useRef();
    let description = useRef();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [update, setupdate] = useState({})

    useEffect(() => {
        fetchData();
    }, []);

    // Get Products Data
    const fetchData = () => {
        axios.get(base_url)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    // Add Products
    const addProduct = async () => {
        let obj = {
            name: name.current.value,
            price: price.current.value,
            Pimage: Pimage.current.value,
            Author: Author.current.value,
            description: description.current.value,
        }

        let result = await axios.post(base_url, obj)
        setProducts([...products, result.data])

        name.current.value = '';
        price.current.value = '';
        Pimage.current.value = '';
        Author.current.value = '';
        description.current.value = '';
    }

    // Delete Product
    const deleteProduct = async (id) => {
        let deletedProduct = await axios.delete(base_url + `/${id}`)
        setProducts(products.filter((product) => product.id !== id))
        console.log(products);
    }
    // Update Products Data
    const viewdata = (id) => {
        const user = products.find(product => product.id === id);
        setupdate(user);
    }

    const updateHandler = (e) => {
        setupdate({ ...update, [e.target.name]: e.target.value })
    }

    const updateProduct = async () => {
        let updatedData = await axios.put(base_url + `/${update.id}`, update)
        console.log(updatedData);

        setProducts(products.map((val, ind) => {
            if (val.id == updatedData.data.id) {
                return updatedData.data
            } else {
                return val
            }
        })
        )
    }

    // Searching products
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    //  Updating Shorted Products
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    //  Filtering products
    const filteredProducts = sortedProducts.filter(product =>
        product.price.toString().includes(searchTerm) || product.name.toLowerCase().includes(searchTerm.toLowerCase())

    );

    return (
        <>
            <div className='inputfields row col-12 mb-5'>
                <div class="card col-9" style={{ width: "18" }}>
                    <div class="card-body">
                        <h2>Add products</h2>
                        <input type="text" placeholder='Book Name' ref={name} />
                        <input type="text" placeholder='Product Image Url' ref={Pimage} />
                        <input type="text" placeholder='Author Name' ref={Author} />
                        <input type="text" placeholder='description' ref={description} />
                        <input type="text" placeholder='Price' ref={price} />
                        <button className='btn btn-info' onClick={addProduct} style={{ width: "100%" }}>Add</button>
                    </div>
                </div>
                <div class="card col-3" style={{ width: "18" }}>
                    <div class="card-body">

                        <h4>Product Dashboard</h4>
                        <input
                            type="text"
                            placeholder="Search by name or price..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </div> <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th scope="col" style={{ width: "260px" }}>Book Image</th>
                        <th scope="col" style={{ width: "200px" }}>Book Name</th>
                        <th scope="col" style={{ width: "200px" }}>Author Name</th>
                        <th scope="col" style={{ width: "50%" }}>Desc</th>
                        <th scope="col" style={{ width: "40px" }}>Price</th>
                        <th scope="col" style={{ width: "40px" }}>Update</th>
                        <th scope="col" style={{ width: "40px" }}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredProducts.map((product, index) => {
                            return (
                                <>
                                    <tr>
                                        <th scope="row" style={{ width: "60px", height: "60px" }}><img width={80} src={product.Pimage} alt="Loding...." /></th>
                                        <td>{product.name}</td>
                                        <td>{product.Author}</td>
                                        <td>{product.description}</td>
                                        <td>${product.price}</td>
                                        <td style={{ width: '75px' }}><button className='btn btn-primary' data-toggle="modal" data-target="#exampleModal" onClick={() => viewdata(product.id)}>Edit</button>
                                        </td>
                                        <td style={{ width: '100px' }}><button className='btn btn-outline-danger' onClick={() => deleteProduct(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <input type="text" value={update.Pimage} placeholder='img' name='Pimage' onChange={updateHandler} />
                                                    <input type="text" value={update.name} placeholder='Product Name' name='name' onChange={updateHandler} />
                                                    <input type="text" value={update.Author} placeholder='author name ' name='Author' onChange={updateHandler} />
                                                    <input type="text" value={update.description} placeholder='desc' name='desc' onChange={updateHandler} />
                                                    <input type="text" value={update.price} placeholder='Price' name='price' onChange={updateHandler} />
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={updateProduct}>Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </>
                            )
                        })
                    }
                </tbody >
            </table >
        </>
    );
};

export default Home;
