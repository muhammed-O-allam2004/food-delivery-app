import React, { useContext } from 'react'
import './FitnessFood.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem' 
// ممكن نستخدم FoodItem أو نعمل كارت مخصوص، بس FoodItem شغال ممتاز

const FitnessFood = () => {

  const { fitness_list, addToCart, url } = useContext(StoreContext);

  // ✅ فلترة القوائم
  const dietFoods = fitness_list.filter(item => item.category === "Diet");
  const muscleFoods = fitness_list.filter(item => item.category === "Protein");

  return (
    <div className='fitness-page'>
        
        {/* الجزء العلوي: الوصف */}
        <div className="fitness-header">
            <h1>أكل صحي.. بس طعمه حكاية! 😋🥗</h1>
            <p>سواء هدفك تنزل في الوزن وتحافظ على رشاقتك، أو بتبني عضلات ومحتاج بروتين عالي.. احنا جهزنالك منيو مدروس بالسعرات عشان توصل لهدفك وانت مستمتع.</p>
        </div>

        {/* قسم التخسيس */}
        <div className="fitness-section">
            <h2 className="section-title diet-title">🌱 وجبات التخسيس (Low Calories)</h2>
            <div className="fitness-grid">
                {dietFoods.map((item, index) => {
                    return (
                        <div key={index} className="fitness-card fade-in">
                            <div className="fitness-img-container">
                                <img src={url+"/images/"+item.image} alt="" />
                                {item.discount > 0 && <span className='discount-badge'>{item.discount}% OFF</span>}
                            </div>
                            <div className="fitness-info">
                                <div className="fitness-name-rating">
                                    <p>{item.name}</p>
                                </div>
                                <p className="fitness-desc">{item.description}</p>
                                <p className="fitness-price">
                                    {item.discount > 0 ? (
                                        <>
                                            <span className="old-price">{item.price} EGP</span>
                                            <span className="new-price">{item.price - (item.price * item.discount / 100)} EGP</span>
                                        </>
                                    ) : (
                                        <span>{item.price} EGP</span>
                                    )}
                                </p>
                            </div>
                            <button onClick={()=>addToCart(item._id)} className='add-to-cart-btn'>أضف للسلة 🛒</button>
                        </div>
                    )
                })}
            </div>
        </div>

        <hr className="section-divider" />

        {/* قسم العضلات */}
        <div className="fitness-section">
            <h2 className="section-title muscle-title">💪 وجبات الطاقة والبروتين (Muscle Gain)</h2>
            <div className="fitness-grid">
                {muscleFoods.map((item, index) => {
                    return (
                        <div key={index} className="fitness-card fade-in">
                            <div className="fitness-img-container">
                                <img src={url+"/images/"+item.image} alt="" />
                                {item.discount > 0 && <span className='discount-badge'>{item.discount}% OFF</span>}
                            </div>
                            <div className="fitness-info">
                                <div className="fitness-name-rating">
                                    <p>{item.name}</p>
                                </div>
                                <p className="fitness-desc">{item.description}</p>
                                <p className="fitness-price">
                                    {item.discount > 0 ? (
                                        <>
                                            <span className="old-price">{item.price} EGP</span>
                                            <span className="new-price">{item.price - (item.price * item.discount / 100)} EGP</span>
                                        </>
                                    ) : (
                                        <span>{item.price} EGP</span>
                                    )}
                                </p>
                            </div>
                            <button onClick={()=>addToCart(item._id)} className='add-to-cart-btn'>أضف للسلة 🛒</button>
                        </div>
                    )
                })}
            </div>
        </div>

    </div>
  )
}

export default FitnessFood