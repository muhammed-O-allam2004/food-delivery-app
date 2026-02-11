import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  // ✅ 1. استدعاء setSearch عشان نحدث قيمة البحث
  const { getTotalCartAmount, token, setToken, setSearch } = useContext(StoreContext);
  
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const handleScrollToSection = (sectionId, menuName) => {
    setMenu(menuName);
    
    if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
  }

  return (
    <div className='navbar'>
      <Link to='/' onClick={()=>setMenu("home")}><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>الرئيسية</Link>
        <a href='#explore-menu' onClick={(e)=> { e.preventDefault(); handleScrollToSection('explore-menu', 'menu');}} className={menu==="menu"?"active":""}>المنيو</a>
        <a href='#app-download' onClick={(e)=> { e.preventDefault(); handleScrollToSection('app-download', 'mobile-app');}} className={menu==="mobile-app"?"active":""}>التطبيق</a>
        <a href='#footer' onClick={(e)=> { e.preventDefault(); handleScrollToSection('footer', 'contact-us');}} className={menu==="contact-us"?"active":""}>تواصل معنا</a>
      </ul>
      <div className="navbar-right">
        
        {/* ✅ 2. خانة البحث: بتحدث القيمة فوراً عند الكتابة */}
        <div className="navbar-search-box" style={{position:'relative', display:'flex', alignItems:'center'}}>
            <input 
                type="text" 
                placeholder='ابحث عن أكلة...' 
                onChange={(e)=>setSearch(e.target.value)} 
                style={{padding:'5px 10px', borderRadius:'20px', border:'1px solid #ccc', outline:'none', width:'150px'}}
            />
            <img src={assets.search_icon} alt="" style={{marginLeft:'-30px', cursor:'pointer'}} />
        </div>

        <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token ? <button onClick={()=>setShowLogin(true)}>sign in</button>
        : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>طلباتي</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>تسجيل خروج</p></li>
            </ul>
          </div>}
      </div>
    </div>
  )
}

export default Navbar