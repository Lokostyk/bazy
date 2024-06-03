'use client'
import styles from "./page.module.scss";
import { useState, useEffect } from 'react'

const defaultState = {
  numberOfRecords: 10,
  data: []
}

const defaultOrderSearch = {
  numberOfRecords: 10,
  name: "",
  state: "",
  min: 0,
  max: 9999,
  search: true
}

const defaultProductsSearch = {
  numberOfRecords: 10,
  name: "",
  category: "",
  min: 0,
  max: 9999,
  search: true
}

const defaultUserSearch = {
  numberOfRecords: 10,
  username: "",
  full_name: "",
  email: "",
  search: true
}

export interface stateForOrders {
  data: {
    order_id: string,
    username: string,
    product_name: string,
    total_amount: number,
    status: string
  }[]
}

export interface stateForProducts {
  data: {
    name: string,
    price: number,
    stock_quantity: number,
    category: string
  }[]
}

export interface stateForUsers {
  data: {
    username: string,
    full_name: string,
    email: string,
  }[]  
}

export default function Home() {
  const [orders, setOrders] = useState(defaultState as stateForOrders)
  const [products, setProducts] = useState(defaultState as stateForProducts)  
  const [users, setUsers] = useState(defaultState as stateForUsers)  

  const [orderSearch, setOrderSearch] = useState(defaultOrderSearch)
  const [productSearch, setProductSearch] = useState(defaultProductsSearch)
  const [userSearch, setUserSearch] = useState(defaultUserSearch)

  useEffect(()=>{
    fetch('/api/orders', {
      method: "POST",
      body: JSON.stringify(orderSearch)
    })
    .then(res=>res.json())
    .then(data=> setOrders({data: data.results}))
    .catch((error) => console.log(error))
  },[orderSearch.search])

  useEffect(()=>{
    fetch('/api/products', {
      method: "POST",
      body: JSON.stringify(productSearch)
    })
    .then(res=>res.json())
    .then(data=> setProducts({data: data.results}))
    .catch((error) => console.log(error))
  },[productSearch.search])

  useEffect(()=>{
    fetch('/api/users', {
      method: "POST",
      body: JSON.stringify(userSearch)
    })
    .then(res=>res.json())
    .then(data=> setUsers({data: data.results}))
    .catch((error) => console.log(error))
  },[userSearch.search])  

  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Orders</h2>
      <div className={styles.dataContainer}>
        <form onSubmit={(e)=>e.preventDefault()} className={styles.searchContainer}>
          <input name="numberOfRecords" required={true} value={orderSearch.numberOfRecords} min={1}
            onChange={event => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, [event.target.name]: event.target.value}))}></input>
          <input name="name" value={orderSearch.name} placeholder="Name" onDoubleClick={()=>sortData(orders, setOrders, "username")}
            onChange={event => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, [event.target.name]: event.target.value}))}></input>
          <input name="state"  value={orderSearch.state} placeholder="State of the order" onDoubleClick={()=>sortData(orders, setOrders, "status")}
            onChange={event => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, [event.target.name]: event.target.value}))}></input>
          <input name="min" value={orderSearch.min} min="1" onDoubleClick={()=>sortData(orders, setOrders, "total_amount","min")}
            onChange={event => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, [event.target.name]: event.target.value}))}></input>          
          <input name="max"  value={orderSearch.max} max="9999" onDoubleClick={()=>sortData(orders, setOrders, "total_amount","max")}
            onChange={event => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, [event.target.name]: event.target.value}))}></input>           
          <input type="submit" value="Submit" onClick={() => setOrderSearch(prevOrderSearch => ({...prevOrderSearch, search: !prevOrderSearch.search}))}></input>
        </form>
        <div className={styles.tableContainer}>
          <div className={styles.titleRow}>
            <div>Username</div>
            <div>Product</div>
            <div>Order status</div>
            <div>Total amount</div>
          </div>
          {orders.data.map((order,num)=>{
            return (
                    <div key={num} className={styles.row}>                
                      <div>{order.username}</div>
                      <div>{order.product_name}</div>
                      <div>{order.status}</div>
                      <div>{order.total_amount}</div>
                    </div>)
          })}
        </div>
      </div>

      <h2 className={styles.title}>Products</h2>
      <div className={styles.dataContainer}>
        <form onSubmit={(e)=>e.preventDefault()} className={styles.searchContainer}>
          <input name="numberOfRecords" required={true} value={productSearch.numberOfRecords} min={1}
            onChange={event => setProductSearch(prevProductSearch => ({...prevProductSearch, [event.target.name]: event.target.value}))}></input>
          <input name="name" value={productSearch.name} placeholder="Name" onDoubleClick={()=>sortData(products, setProducts, "name")}
            onChange={event => setProductSearch(prevProductSearch => ({...prevProductSearch, [event.target.name]: event.target.value}))}></input>
          <input name="category"  value={productSearch.category} placeholder="Category" onDoubleClick={()=>sortData(products, setProducts, "category")}
            onChange={event => setProductSearch(prevProductSearch => ({...prevProductSearch, [event.target.name]: event.target.value}))}></input>
          <input name="min" value={productSearch.min} min="1" onDoubleClick={()=>sortData(products, setProducts, "price", "min")}
            onChange={event => setProductSearch(prevProductSearch => ({...prevProductSearch, [event.target.name]: event.target.value}))}></input>          
          <input name="max"  value={productSearch.max} max="9999" onDoubleClick={()=>sortData(products, setProducts, "price", "max")}
            onChange={event => setProductSearch(prevProductSearch => ({...prevProductSearch, [event.target.name]: event.target.value}))}></input>           
          <input type="submit" value="Submit" onClick={() => setProductSearch(prevProductSearch => ({...prevProductSearch, search: !prevProductSearch.search}))}></input>
        </form>
        <div className={styles.tableContainer}>
          <div className={styles.titleRow}>
            <div>Product Name</div>
            <div>Product Category</div>
            <div>Price</div>
            <div>Available amount</div>
          </div>
          {products.data.map((product,num)=>{
            return (
                    <div key={num} className={styles.row}>                
                      <div>{product.name}</div>
                      <div>{product.category}</div>
                      <div>{product.price}</div>
                      <div>{product.stock_quantity}</div>
                    </div>)
          })}
        </div>
      </div>

      <h2 className={styles.title}>Users</h2>
      <div className={styles.dataContainer}>
        <form onSubmit={(e)=>e.preventDefault()} className={styles.searchContainer}>
          <input name="numberOfRecords" required={true} value={userSearch.numberOfRecords} min={1}
            onChange={event => setUserSearch(prevUserSearch => ({...prevUserSearch, [event.target.name]: event.target.value}))}></input>
          <input name="username" value={userSearch.username} placeholder="Username" onDoubleClick={()=>sortData(users, setUsers, "username")}
            onChange={event => setUserSearch(prevUserSearch => ({...prevUserSearch, [event.target.name]: event.target.value}))}></input>
          <input name="full_name"  value={userSearch.full_name} placeholder="Full name" onDoubleClick={()=>sortData(users, setUsers, "full_name")}
            onChange={event => setUserSearch(prevUserSearch => ({...prevUserSearch, [event.target.name]: event.target.value}))}></input>
          <input name="email" value={userSearch.email} placeholder="Email" onDoubleClick={()=>sortData(users, setUsers, "email")}
            onChange={event => setUserSearch(prevUserSearch => ({...prevUserSearch, [event.target.name]: event.target.value}))}></input>           
          <input type="submit" value="Submit" onClick={() => setUserSearch(prevUserSearch => ({...prevUserSearch, search: !prevUserSearch.search}))}></input>
        </form>
        <div className={styles.tableContainer}>
          <div className={styles.titleRow}>
            <div>Username</div>
            <div>Full name</div>
            <div>Email</div>
          </div>
          {users.data.map((user,num)=>{
            return (
                    <div key={num} className={styles.row}>                
                      <div>{user.username}</div>
                      <div>{user.full_name}</div>
                      <div>{user.email}</div>
                    </div>)
          })}
        </div>
      </div>
    </main>
  );
}

// @ts-ignore
function sortData(values, setter, name, minmax?){
  const temp = [...values.data]

  if(minmax == "min"){
    temp.sort((a,b)=>{
      if (Number(a[name]) < Number(b[name])) {
        return -1;
      }
      if (Number(a[name]) > Number(b[name])) {
        return 1;
      }
      return 0;    
    })
  }else if(minmax == "max"){
    temp.sort((a,b)=>{
      if (Number(a[name]) > Number(b[name])) {
        return -1;
      }
      if (Number(a[name]) < Number(b[name])) {
        return 1;
      }
      return 0;    
    })
  }else {
    temp.sort((a,b)=>{
      if (a[name] < b[name]) {
        return -1;
      }
      if (a[name] > b[name]) {
        return 1;
      }
      return 0;    
    })    
  }

  setter({data: temp})
}