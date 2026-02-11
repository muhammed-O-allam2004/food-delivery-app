import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        
        {/* ✅ 1. زرار الرئيسية (Dashboard) */}
        <NavLink to='/' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Dashboard</p>
        </NavLink>

        {/* 2. قسم الطعام (Food) */}
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>

        {/* 3. قسم الوصفات (Recipes) */}
        <NavLink to='/add-recipe' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Recipe</p>
        </NavLink>
        <NavLink to='/listrecipe' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Recipes</p>
        </NavLink>

        {/* 4. قسم الفيتنس (Fitness) */}
        <NavLink to='/add-fitness' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Fitness</p>
        </NavLink>
        <NavLink to='/list-fitness' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Fitness</p>
        </NavLink>

        {/* 5. الطلبات (Orders) */}
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar