import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home' // ✅ 1. استدعاء الصفحة الجديدة
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import AddRecipe from './pages/AddRecipe/AddRecipe' 
import ListRecipe from './pages/ListRecipe/ListRecipe'
import AddFitness from './pages/AddFitness/AddFitness' 
import ListFitness from './pages/ListFitness/ListFitness' 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const url = "http://localhost:4000"; 

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          {/* ✅ 2. الراوت الرئيسي للوحة التحكم (عشان تفتح أول حاجة) */}
          <Route path="/" element={<Home url={url}/>} /> 
          
          <Route path="/add" element={<Add url={url}/>} />
          <Route path="/list" element={<List url={url}/>} />
          <Route path="/orders" element={<Orders url={url}/>} />
          
          <Route path="/add-recipe" element={<AddRecipe url={url} />} />
          <Route path="/listrecipe" element={<ListRecipe url={url} />} />

          <Route path="/add-fitness" element={<AddFitness url={url} />} />
          <Route path="/list-fitness" element={<ListFitness url={url} />} />

        </Routes>
      </div>
    </div>
  )
}

export default App