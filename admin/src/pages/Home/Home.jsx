import React, { useEffect, useState } from 'react'
import './Home.css'
import axios from 'axios'
import { assets } from '../../assets/assets' // تأكد إن المسار صح

const Home = ({ url }) => {

  const [stats, setStats] = useState({
    ordersCount: 0,
    foodCount: 0,
    usersCount: 0,
    totalSales: 0
  });

  const fetchStats = async () => {
    try {
        const response = await axios.get(url + "/api/order/dashboard");
        if (response.data.success) {
            setStats(response.data.data);
        }
    } catch (error) {
        console.log("Error fetching stats");
    }
  }

  useEffect(() => {
    fetchStats();
  }, [])

  return (
    <div className='home-panel'>
        <h1>لوحة التحكم الرئيسية 📊</h1>
        <div className="dashboard-cards">
            
            <div className="card">
                <div className="card-icon" style={{background: '#e3f2fd', color: '#1565c0'}}>📦</div>
                <div className="card-info">
                    <h3>إجمالي الطلبات</h3>
                    <p>{stats.ordersCount}</p>
                </div>
            </div>

            <div className="card">
                <div className="card-icon" style={{background: '#e8f5e9', color: '#2e7d32'}}>🍔</div>
                <div className="card-info">
                    <h3>عدد الوجبات</h3>
                    <p>{stats.foodCount}</p>
                </div>
            </div>

            <div className="card">
                <div className="card-icon" style={{background: '#fff3e0', color: '#ef6c00'}}>👥</div>
                <div className="card-info">
                    <h3>المستخدمين</h3>
                    <p>{stats.usersCount}</p>
                </div>
            </div>

            <div className="card">
                <div className="card-icon" style={{background: '#fce4ec', color: '#c2185b'}}>💰</div>
                <div className="card-info">
                    <h3>إجمالي المبيعات</h3>
                    <p>{stats.totalSales} EGP</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Home