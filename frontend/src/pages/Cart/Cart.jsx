import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {

  // ✅ 1. ضفنا recipe_list هنا عشان السلة تشوف الوصفات
  const { cartItems, food_list, fitness_list, recipe_list, removeFromCart, getTotalCartAmount, url, currency, setPromoDiscount, promoDiscount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [isCodeApplied, setIsCodeApplied] = useState(promoDiscount > 0);

  const applyPromoCode = () => {
      if (isCodeApplied || promoDiscount > 0) {
          toast.info("الكود مستخدم بالفعل");
          return;
      }
      
      const totalAmount = getTotalCartAmount();

      if (promoCode === 'BIG20') {
          if (totalAmount < 1000) { 
              toast.error("هذا الكود يعمل فقط للطلبات فوق 1000 جنية");
              return;
          }

          const lastUseDate = localStorage.getItem('promo_big20_last_use');
          if (lastUseDate) {
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
              
              if (new Date(lastUseDate) > sixMonthsAgo) {
                  toast.error("عفواً! هذا الكود متاح مرة واحدة كل 6 أشهر ⏳");
                  return;
              }
          }

          const discount = totalAmount * 0.20;
          setPromoDiscount(Math.round(discount));
          setIsCodeApplied(true);

          localStorage.setItem('promo_big20_last_use', new Date().toISOString());

          toast.success("مبروك! تم تفعيل خصم 20% للعظماء 🎉");
      } else {
          toast.error("كود الخصم غير صحيح");
      }
  }

  const getVariantLabel = (variant) => {
      const s = String(variant).toLowerCase();
      if (s === "standard") return "حجم عادي";
      if (s.includes("s")) return "صغير (Small)";
      if (s.includes("m")) return "وسط (Medium)";
      if (s.includes("l")) return "كبير (Large)";
      if (s.includes("xl")) return "جامبو (XL)";
      if (s.includes("family")) return "عائلي";
      if (s.includes("double")) return "دبل";
      return variant;
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>صورة</p>
          <p>اسم الوجبة</p>
          <p>السعر</p>
          <p>العدد</p>
          <p>الإجمالي</p>
          <p>حذف</p>
        </div>
        <br />
        <hr />
        {Object.keys(cartItems).map((key, index) => {
          const [itemId, variant] = key.split('_'); 
          
          // ✅ 2. التعديل هنا: البحث في القوائم الثلاثة (أكل - فيتنس - وصفات)
          let item = food_list.find(product => product._id === itemId);
          if (!item) {
             item = fitness_list.find(product => product._id === itemId);
          }
          if (!item) {
             item = recipe_list.find(product => product._id === itemId);
          }

          const quantity = cartItems[key];
          const currentVariant = variant || "Standard";

          if (item && quantity > 0) {
             let basePrice = item.discount 
                ? item.price - (item.price * item.discount / 100) 
                : (item.offer 
                    ? item.price - (item.price * item.discount / 100) 
                    : item.price);
             
             let multiplier = 1;
             const s = String(currentVariant).toLowerCase();

             if (s === "standard") {
                multiplier = 1;
             }
             else if (s.includes("ثمن") || s.includes("1/8")) multiplier = 0.15;
             else if (s.includes("ربع") || s.includes("1/4")) multiplier = 0.28;
             else if (s.includes("نص") || s.includes("1/2")) multiplier = 0.55;
             else if ((s.includes("s") && s !== "standard") || s.includes("صغير")) multiplier = 0.60;
             else if (s.includes("m") || s.includes("وسط")) multiplier = 0.80;
             else if (s.includes("xl") || s.includes("جامبو")) multiplier = 1.25;
             else if (s.includes("family") || s.includes("عائلي")) multiplier = 1.5;
             else if (s.includes("double") || s.includes("دبل")) multiplier = 1.8;
             else if (s.includes("2 قطعة")) multiplier = 2;
             else if (s.includes("3 قطع")) multiplier = 3;
             else if (s.includes("5 قطع")) multiplier = 5;
             
             const finalPrice = Math.round(basePrice * multiplier);

            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + "/images/" + item.image} alt="" />
                  <div>
                      <p>{item.name}</p>
                      <span className="cart-variant-badge">{getVariantLabel(currentVariant)}</span>
                  </div>
                  <p>{currency}{finalPrice}</p>
                  <p>{quantity}</p>
                  <p>{currency}{finalPrice * quantity}</p>
                  <p onClick={() => removeFromCart(itemId, currentVariant)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>
      
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>إجمالي الفاتورة 🧾</h2>
          <div>
            <div className="cart-total-details">
              <p>سعر الوجبات</p>
              <p>{currency}{getTotalCartAmount()}</p>
            </div>
            <hr />
            
            {promoDiscount > 0 && (
                <>
                    <div className="cart-total-details discount-row">
                    <p>خصم خاص (20%)</p>
                    <p>- {currency}{promoDiscount}</p>
                    </div>
                    <hr />
                </>
            )}

            <div className="cart-total-details">
              <p>رسوم التوصيل</p>
              <p>{currency}{getTotalCartAmount() === 0 ? 0 : 20}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>الإجمالي الكلي</b>
              <b>{currency}{getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() - promoDiscount + 20)}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>تأكيد الطلب والدفع 🚀</button>
        </div>
        
        <div className="cart-promocode">
          <div>
            <p>عندك كود خصم؟</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='اكتب الكود هنا' 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromoCode}>تفعيل</button>
            </div>

            <div className="promo-note" style={{marginTop: '15px', fontSize: '13px', color: '#666', lineHeight: '1.6'}}>
                <p style={{color: '#ff4c24', fontWeight: 'bold'}}>🔥 كود العظماء (BIG20)</p>
                <ul style={{listStyleType: 'disc', paddingRight: '20px'}}>
                    <li>احصل على خصم 20% للطلبات فوق 1000 جنية.</li>
                    <li>هذا العرض متاح مرة واحدة كل 6 أشهر.</li>
                </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart