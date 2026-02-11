import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ 1. ضفنا useLocation
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState({
        firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "00000", country: "", phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge, promoDiscount } = useContext(StoreContext);

    const deliveryPrice = deliveryCharge || 20;
    const navigate = useNavigate();
    
    // ✅ 2. استقبال بيانات الوصفة
    const location = useLocation();
    const isRecipeOrder = location.state?.isRecipe;
    const recipeData = location.state?.recipe;

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    // ✅ 3. حساب المبلغ الإجمالي (إما الوصفة أو السلة)
    const currentSubTotal = isRecipeOrder ? recipeData.price : getTotalCartAmount();
    // (لو طلب وصفة هنلغي الخصم مؤقتاً عشان ميبقاش بالسالب، أو ممكن تطبق الخصم عادي لو حابب)
    const finalAmount = isRecipeOrder 
                        ? (currentSubTotal + deliveryPrice) 
                        : (currentSubTotal - promoDiscount + deliveryPrice);

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        
        if (isRecipeOrder) {
            // ✅ 4. لو طلب وصفة: بنعمل عنصر واحد بس
            orderItems.push({
                _id: recipeData._id,
                name: `Box: ${recipeData.name}`, // عشان يظهر في الأدمن مميز
                price: recipeData.price,
                quantity: 1,
                image: recipeData.image
            });
        } else {
            // ✅ 5. لو طلب عادي: الكود القديم بتاعك زي ما هو
            for (const key in cartItems) {
                if (cartItems[key] > 0) {
                    const [itemId, variant] = key.split('_');
                    const itemInfo = food_list.find((i) => i._id === itemId);
                    
                    if (itemInfo) {
                        let itemData = { ...itemInfo };
                        itemData.quantity = cartItems[key];
                        itemData.variant = variant || "L";
                        orderItems.push(itemData);
                    }
                }
            }
        }

        let orderData = {
            address: data,
            items: orderItems,
            amount: finalAmount, // السعر المحسوب
        }

        try {
            if (payment === "stripe") {
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                if (response.data.success) {
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                }
                else {
                    toast.error("حدث خطأ ما")
                }
            }
            else {
                let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data.success) {
                    navigate("/myorders")
                    toast.success("تم طلب الأوردر بنجاح")
                    if (!isRecipeOrder) {
                        setCartItems({}); // نفضي السلة بس لو كان طلب عادي
                    }
                }
                else {
                    toast.error("حدث خطأ ما")
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("خطأ في الاتصال");
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("يجب تسجيل الدخول أولاً")
            navigate('/cart')
        }
        else if (currentSubTotal === 0) { // ✅ 6. منع الدخول لو مفيش فاتورة (سواء سلة أو وصفة)
            navigate('/cart')
        }
    }, [token, currentSubTotal])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>بيانات التوصيل</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='الاسم الأول' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='اسم العائلة' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='البريد الإلكتروني' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='الشارع / رقم المبنى' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='المدينة' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='المحافظة' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='الدولة' required />
                    <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='رقم الهاتف' required />
                </div>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>ملخص الطلب</h2>
                    
                    {/* ✅ 7. عرض اسم البوكس للتأكيد */}
                    {isRecipeOrder && <p style={{color:'tomato', fontWeight:'bold', marginBottom:'10px'}}>Buying: {recipeData.name}</p>}

                    <div>
                        <div className="cart-total-details"><p>المجموع</p><p>{currency}{currentSubTotal}</p></div>
                        <hr />
                        {!isRecipeOrder && promoDiscount > 0 && (
                            <>
                                <div className="cart-total-details"><p>الخصم</p><p>- {currency}{promoDiscount}</p></div>
                                <hr />
                            </>
                        )}
                        <div className="cart-total-details"><p>رسوم التوصيل</p><p>{currency}{currentSubTotal === 0 ? 0 : deliveryPrice}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>الإجمالي</b><b>{currency}{finalAmount}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>طريقة الدفع</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>الدفع عند الاستلام (كاش)</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>بطاقة بنكية (Stripe)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment==="cod" ? "تأكيد الطلب" : "الذهاب للدفع"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder