import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import Offers from './pages/Offers/Offers'
import AIChat from './components/AIChat/AIChat'
import DiyRecipes from './pages/DIY/DiyRecipes' 
import RecipeDetails from './pages/RecipeDetails/RecipeDetails' 
import FitnessFood from './pages/FitnessFood/FitnessFood' // ✅ 1. استدعاء الصفحة الجديدة

const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer />
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <AIChat />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/offers' element={<Offers />} />
          
          <Route path='/diy-recipes' element={<DiyRecipes />} />
          <Route path='/recipe/:id' element={<RecipeDetails />} />

          {/* ✅ 2. المسار الجديد لصفحة الأكل الصحي */}
          <Route path='/fitness-food' element={<FitnessFood />} />

        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App