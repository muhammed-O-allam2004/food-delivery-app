import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data)
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

  return (
    <div className='my-orders'>
      <h2>My Orders / طلباتي</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className='my-orders-order'>
                {/* 1. أيقونة الصندوق */}
                <div className="order-icon">
                    <img src={assets.parcel_icon} alt="" />
                </div>
                
                {/* 2. تفاصيل الأكل */}
                <p className='order-items-names'>{order.items.map((item,index)=>{
                  if (index === order.items.length-1) {
                    return item.name+" x "+item.quantity
                  }
                  else{
                    return item.name+" x "+item.quantity+", "
                  }
                })}</p>

                {/* 3. السعر */}
                <p className='order-price'>{currency}{order.amount}.00</p>

                {/* 4. عدد العناصر */}
                <p className='order-count'>Items: {order.items.length}</p>

                {/* 5. حالة الطلب */}
                <p className='order-status'><span>&#x25cf;</span> <b>{order.status}</b></p>
                
                {/* 6. زر التتبع */}
                <button onClick={fetchOrders} className='track-btn'>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders