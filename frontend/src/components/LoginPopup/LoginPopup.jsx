import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    // 1. شيلنا loadCartData مؤقتاً من هنا عشان لو مش موجودة في الكونتكست متعملش مشكلة
    const { setToken, url } = useContext(StoreContext) 
    const [currState, setCurrState] = useState("تسجيل الدخول");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    // دالة الترجمة زي ما هي (ممتازة)
    const translateErrorMessage = (message) => {
        if (!message) return "حدث خطأ غير معروف";
        if (message.includes("strong password")) {
            return "كلمة المرور ضعيفة! يرجى استخدام 8 أحرف وأرقام ورموز";
        } else if (message.includes("exists")) {
            return "هذا البريد الإلكتروني مسجل بالفعل";
        } else if (message.includes("match") || message.includes("valid") || message.includes("credentials")) {
            return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (message.includes("user")) {
            return "المستخدم غير موجود";
        } else {
            return message;
        }
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "تسجيل الدخول") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        
        try {
            const response = await axios.post(new_url, data);
            
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                
                // 🛑 وقفت السطر ده مؤقتاً لأنه هو اللي بيعمل المشكلة وبيوقع الكود
                // loadCartData({token:response.data.token}) 
                
                setShowLogin(false)
                toast.success(currState === "تسجيل الدخول" ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح");
            }
            else {
                toast.error(translateErrorMessage(response.data.message));
            }
        } catch (error) {
            console.error(error); // عشان نشوف الخطأ الحقيقي في الكونسول
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(translateErrorMessage(error.response.data.message));
            } else {
                toast.error("حدث خطأ في الاتصال بالسيرفر، تأكد من تشغيل الـ Backend");
            }
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> 
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "تسجيل الدخول" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='الاسم بالكامل' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='البريد الإلكتروني' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='كلمة المرور' required />
                </div>
                <button type="submit">{currState === "إنشاء حساب" ? "إنشاء الحساب" : "تسجيل الدخول"}</button>
                <div className="login-popup-condition">
                    <input 
                        type="checkbox" 
                        required 
                        onInvalid={(e) => e.target.setCustomValidity('يرجى الموافقة على الشروط للمتابعة')}
                        onInput={(e) => e.target.setCustomValidity('')}
                    />
                    <p>بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية.</p>
                </div>
                {currState === "تسجيل الدخول"
                    ? <p>ليس لديك حساب؟ <span onClick={() => setCurrState('إنشاء حساب')}>إنشاء حساب جديد</span></p>
                    : <p>لديك حساب بالفعل؟ <span onClick={() => setCurrState('تسجيل الدخول')}>تسجيل الدخول</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup