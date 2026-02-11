import React, { useContext, useState, useEffect } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ({ id, name, price, description, image, variants, offer, discount, includes }) => {

  const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

  // ✅ دالة التحقق من الفيديو
  const isVideo = (fileName) => {
      return fileName?.toLowerCase().endsWith('.mp4') || 
             fileName?.toLowerCase().endsWith('.webm') || 
             fileName?.toLowerCase().endsWith('.ogg');
  }

  const parseVariants = (data) => {
      if (!data) return ["Standard"];
      try {
          let stringData = Array.isArray(data) ? JSON.stringify(data) : String(data);
          const cleaned = stringData.replace(/[\[\]"'\\]/g, ''); 
          const result = cleaned.split(',').map(item => item.trim()).filter(item => item !== "");
          return result.length > 0 ? result : ["Standard"];
      } catch (e) {
          return ["Standard"];
      }
  };

  let availableVariants = parseVariants(variants);
  const isOffer = offer === true || offer === "true";
  const [size, setSize] = useState(availableVariants[0]);

  useEffect(() => {
    if(availableVariants.length > 0) {
        setSize(availableVariants[0]);
    }
  }, [variants]);

  const currentCartKey = `${id}_${size}`;
  const currentQuantity = cartItems[currentCartKey] || 0;

  // -------------------------------------------------------------
  // ✅ دالة حساب السعر ( بالنسب الجديدة والترتيب الصحيح)
  // -------------------------------------------------------------
  const getPriceForSize = (baseValue) => {
    const s = String(size).toLowerCase(); 
    const itemName = String(name).toLowerCase(); 

    // 1. تحويل النصوص لأرقام (للأوزان)
    const getUnitFactor = (text) => {
        if (text.includes("ثمن") || text.includes("1/8")) return 0.125;
        if (text.includes("ربع") || text.includes("1/4") || text.includes("quarter") || text.includes("صدر") || text.includes("ورك")) return 0.25;
        if (text.includes("نص") || text.includes("1/2") || text.includes("half")) return 0.5;
        if (text.includes("كامل") || text.includes("فرخة") || text.includes("تيس") || text.includes("whole") || text.includes("kilo") || text.includes("كيلو")) return 1.0;
        return null;
    };

    const baseUnit = getUnitFactor(itemName) || 1.0; 
    const targetUnit = getUnitFactor(s);

    if (targetUnit !== null) {
        return Math.round((baseValue / baseUnit) * targetUnit);
    }

    // 2. حساب الأحجام (S, M, L, XL)
    
    // ✅ أولاً: الأحجام الكبيرة جداً (قبل الـ Large)
    if (s.includes("xl") || s.includes("جامبو")) return Math.round(baseValue * 1.20); // زيادة 20%
    if (s.includes("family") || s.includes("عائلي")) return Math.round(baseValue * 1.50);
    if (s.includes("double") || s.includes("دبل")) return Math.round(baseValue * 2.00);

    // ✅ ثانياً: الحجم الكبير (Large) هو الأساس
    if (s.includes("l") || s.includes("كبير") || s === "standard") return Math.round(baseValue * 1.0); 

    // ✅ ثالثاً: الأحجام الأصغر
    if (s.includes("m") || s.includes("وسط")) return Math.round(baseValue * 0.80); // خصم 20%
    if ((s.includes("s") && s !== "standard") || s.includes("صغير")) return Math.round(baseValue * 0.60); // خصم 40%
    
    // 3. حساب عدد القطع
    if (s.includes("2 قطعة")) return Math.round(baseValue * 2);
    if (s.includes("3 قطع")) return Math.round(baseValue * 3);
    if (s.includes("5 قطع")) return Math.round(baseValue * 5);
    if (s.includes("6 قطع")) return Math.round(baseValue * 6);
    
    return Math.round(baseValue);
  };

  // الأسعار النهائية
  const originalPrice = price; 
  const discountedPrice = isOffer ? (price - (price * discount / 100)) : price; 

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            
            {/* 🛠️ هنا التعديل: لو فيديو شغله، لو صورة اعرضها */}
            {isVideo(image) ? (
                <video 
                    className='food-item-image' 
                    src={url + "/images/" + image} 
                    controls 
                    muted 
                    loop 
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                >
                    المتصفح لا يدعم الفيديو.
                </video>
            ) : (
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
            )}

            {isOffer && <span className="food-item-badge">خصم {discount}%</span>}
            
            {!currentQuantity
                ? <img className='add' onClick={() => addToCart(id, size)} src={assets.add_icon_white} alt="" />
                : <div className='food-item-counter'>
                    <img onClick={() => removeFromCart(id, size)} src={assets.remove_icon_red} alt="" />
                    <p>{currentQuantity}</p>
                    <img onClick={() => addToCart(id, size)} src={assets.add_icon_green} alt="" />
                </div>
            }
        </div>
        
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            
            {includes && includes !== "undefined" && includes.trim() !== "" && (
                <p className="food-item-includes">➕ {includes}</p>
            )}
            
            <p className="food-item-desc">{description}</p>

            {availableVariants.length > 1 && (
                <div className="food-item-sizes">
                    {availableVariants.map((variant, index) => (
                        <span 
                            key={index} 
                            onClick={() => setSize(variant)} 
                            className={size === variant ? "active" : ""}
                        >
                            {variant}
                        </span>
                    ))}
                </div>
            )}

            <div className="food-item-price-row">
                <div className="price-box">
                    <p className="food-item-price">{currency}{getPriceForSize(discountedPrice)}</p>
                    {isOffer && <p className="food-item-old-price">{currency}{getPriceForSize(originalPrice)}</p>}
                </div>
                {availableVariants.length > 1 && <span className="selected-size-label">{size}</span>}
            </div>
        </div>
    </div>
  )
}

export default FoodItem