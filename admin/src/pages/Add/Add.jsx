import React, { useState, useEffect } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "مشويات", // ✅ القيمة الافتراضية
        offer: false,
        discount: "",
        includes: "" 
    });

    const [servingType, setServingType] = useState("Chicken");
    const [variants, setVariants] = useState([]);
    const [finalPrice, setFinalPrice] = useState(0);

    const sizeOptions = ["S", "M", "L", "XL", "Family", "Double"];
    const chickenOptions = ["فرخة كاملة", "نص فرخة (1/2)", "ربع صدر", "ربع ورك", "ثمن فرخة (1/8)"];
    const weightOptions = ["كيلو", "نص كيلو", "ربع كيلو", "ثمن كيلو"];
    const pieceOptions = ["قطعة", "2 قطعة", "3 قطع", "5 قطع", "بوكس", "ساندوتش", "كومبو"];

    useEffect(() => {
        if (data.price && data.offer && data.discount) {
            const discounted = Number(data.price) - (Number(data.price) * Number(data.discount) / 100);
            setFinalPrice(discounted.toFixed(0));
        } else {
            setFinalPrice(data.price);
        }
    }, [data.price, data.discount, data.offer]);

    const handleVariantChange = (option) => {
        setVariants(prev => {
            if (prev.includes(option)) {
                return prev.filter(item => item !== option);
            } else {
                return [...prev, option];
            }
        });
    }

    const handleServingTypeChange = (e) => {
        setServingType(e.target.value);
        setVariants([]); 
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setData(data => ({ ...data, [name]: value }))

        if (name === 'category') {
            // ✅ تم ضبط الشروط على الـ 8 أقسام فقط
            if (["مشويات", "شاورما"].includes(value)) {
                setServingType("Chicken"); 
                setVariants([]); 
            } else if (["محاشي"].includes(value)) {
                setServingType("Weights");
                setVariants([]);
            } else {
                // (بيتزا، كشري، مكرونات، كريب، حلويات) بياخدوا أحجام
                setServingType("Sizes");
                setVariants([]);
            }
        }
    }

    const getOptionsArray = () => {
        switch (servingType) {
            case "Sizes": return sizeOptions;
            case "Chicken": return chickenOptions;
            case "Weights": return weightOptions;
            case "Pieces": return pieceOptions;
            default: return [];
        }
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);
        formData.append("offer", data.offer); 
        formData.append("discount", Number(data.discount));
        formData.append("servingType", servingType);
        formData.append("variants", JSON.stringify(variants));
        formData.append("includes", data.includes);

        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                description: "",
                price: "",
                category: "مشويات", // ✅ Reset
                offer: false,
                discount: "",
                includes: ""
            })
            setImage(false);
            setVariants([]);
            setFinalPrice(0);
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>صورة المنتج (Upload Image)</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>

                <div className='add-product-name flex-col'>
                    <p>اسم المنتج (Product Name)</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='مثال: وجبة ميكس جريل' required />
                </div>

                <div className='add-product-description flex-col'>
                    <p>وصف المنتج (Description)</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={4} placeholder='اكتب مكونات الوجبة هنا...' required />
                </div>
                
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>القسم (Category)</p>
                        
                        {/* ✅ القائمة الـ 8 أقسام فقط (بدون زيادات) */}
                        <select name='category' onChange={onChangeHandler} value={data.category}>
                            <option value="مشويات">مشويات</option>
                            <option value="شاورما">شاورما</option>
                            <option value="كشري وطواجن">كشري وطواجن</option>
                            <option value="بيتزا وفطاير">بيتزا وفطاير</option>
                            <option value="محاشي">محاشي</option>
                            <option value="مكرونات">مكرونات</option>
                            <option value="كريب">كريب</option>
                            <option value="حلويات">حلويات</option>
                        </select>

                    </div>
                    <div className='add-price flex-col'>
                        <p>السعر الأساسي (Price)</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='100' required />
                    </div>
                </div>

                <div className='add-includes flex-col'>
                    <p>مشتملات الوجبة (Includes)</p>
                    <input 
                        name='includes' 
                        onChange={onChangeHandler} 
                        value={data.includes} 
                        type="text" 
                        placeholder='مثال: أرز بسمتي، سلطة طحينة، عيش، مخلل' 
                        style={{padding: "10px", border: "1px solid #c5c5c5", borderRadius: "4px"}}
                    />
                </div>

                <div className="add-serving-section">
                    <p className="section-title">إعدادات الأحجام والأنواع</p>
                    
                    <div className="add-serving-type flex-col">
                        <p>نوع التقسيم (Serving Type)</p>
                        <select onChange={handleServingTypeChange} value={servingType} className="serving-select">
                            <option value="Chicken">🍗 فراخ (كاملة، نص، ربع...)</option>
                            <option value="Weights">⚖️ أوزان (كيلو، نص كيلو...)</option>
                            <option value="Sizes">📐 أحجام (S, M, L...)</option>
                            <option value="Pieces">📦 قطع/عدد (قطعة، بوكس...)</option>
                        </select>
                    </div>

                    <div className="add-variants flex-col">
                        <p>حدد الخيارات المتاحة (Available Options):</p>
                        <div className="variants-container">
                            {getOptionsArray().map((opt, index) => (
                                <div key={index} 
                                     onClick={() => handleVariantChange(opt)}
                                     className={`variant-item ${variants.includes(opt) ? 'active' : ''}`}>
                                    {opt}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="add-offer-section">
                    <div className="offer-checkbox">
                        <input 
                            type="checkbox" 
                            id="offer" 
                            name="offer" 
                            onChange={onChangeHandler} 
                            checked={data.offer} 
                        />
                        <label htmlFor="offer">تفعيل عرض خاص (Special Offer)</label>
                    </div>

                    {data.offer && (
                        <div className="offer-details fade-in">
                            <div className='add-price flex-col'>
                                <p>نسبة الخصم (%)</p>
                                <input 
                                    type="Number" 
                                    name='discount' 
                                    onChange={onChangeHandler} 
                                    value={data.discount} 
                                    placeholder='20' 
                                />
                            </div>
                            <div className="final-price-display">
                                <p>السعر بعد الخصم:</p>
                                <h3>{finalPrice} EGP</h3>
                            </div>
                        </div>
                    )}
                </div>

                <button type='submit' className='add-btn' >إضافة المنتج</button>
            </form>
        </div>
    )
}

export default Add