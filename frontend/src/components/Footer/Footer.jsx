import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" className="logo"/>
            <p>يا هلا بيك في مطعم Yummy! 🍴 إحنا مطبخ كبير بيجمع لك كل الأطباق اللي نفسك فيها بجودة عالية ونفس بيتي. شرقي، غربي، حلو وحادق.. كله بيتحضر طازة مخصوص عشانك ويجيلك سخن لحد عندك.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>روابط سريعة</h2>
            <ul>
                <li><Link to="/">الرئيسية</Link></li>
                <li><a href="#explore-menu">المنيو</a></li>
                <li><a href="#app-download">عن المطعم</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>تواصل معنا</h2>
            <ul>
                <li>+20 100 981 0479</li>
                <li>contact@yummy.com</li>
                <li>القاهرة، مصر</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">جميع الحقوق محفوظة © 2026 لمطعم Yummy - تم التطوير بحب ❤️</p>
    </div>
  )
}

export default Footer