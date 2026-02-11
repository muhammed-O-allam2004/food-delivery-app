import React, { useState } from 'react'
import './AddRecipe.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddRecipe = ({ url }) => { 

    const [image, setImage] = useState(false);
    const [video, setVideo] = useState(false);
    
    // بيانات الوصفة (تم إزالة videoPrice)
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",       // سعر البوكس بس
        steps: "",
        category: "DIY"
    });

    const [currentIng, setCurrentIng] = useState({ name: "", price: "", quantity: "" });
    const [ingredientsList, setIngredientsList] = useState([]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onIngChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setCurrentIng(prev => ({ ...prev, [name]: value }));
    }

    const addIngredient = () => {
        if(!currentIng.name || !currentIng.price) {
            toast.error("اكتب اسم المكون وسعره الأول!");
            return;
        }
        setIngredientsList([...ingredientsList, currentIng]);
        setCurrentIng({ name: "", price: "", quantity: "" }); 
    }

    const removeIngredient = (index) => {
        const list = [...ingredientsList];
        list.splice(index, 1);
        setIngredientsList(list);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        // ⚠️ تم إزالة videoPrice من هنا
        formData.append("steps", data.steps);
        formData.append("category", data.category);
        formData.append("image", image);
        formData.append("video", video);
        
        formData.append("ingredients", JSON.stringify(ingredientsList));

        try {
            const response = await axios.post(`${url}/api/recipe/add`, formData);
            
            if (response.data.success) {
                setData({
                    name: "", description: "", price: "", steps: "", category: "DIY"
                });
                setImage(false);
                setVideo(false);
                setIngredientsList([]);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("حدث خطأ في الاتصال");
        }
    }

    return (
        <div className='add-recipe'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                
                {/* رفع الصورة */}
                <div className='flex-col'>
                    <p>صورة الوصفة النهائية</p>
                    <label htmlFor="image">
                        <img className='upload-area' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                {/* رفع الفيديو */}
                <div className='flex-col'>
                    <p>فيديو الشيف (Upload Video)</p>
                    <input onChange={(e) => setVideo(e.target.files[0])} type="file" accept="video/*" required />
                    {video && <p style={{color:'green', fontSize:'14px'}}>تم اختيار الفيديو: {video.name}</p>}
                </div>

                <div className='flex-col'>
                    <p>اسم الوصفة</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='مثال: مكرونة بشاميل بيتي' required />
                </div>

                <div className='flex-col'>
                    <p>وصف قصير</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="3" placeholder='وصف يظهر تحت الصورة...' required></textarea>
                </div>

                {/* قسم المكونات */}
                <div className='flex-col ingredients-section'>
                    <p>مكونات البوكس (Ingredients)</p>
                    <div className="ingredient-inputs">
                        <input name='name' value={currentIng.name} onChange={onIngChangeHandler} type="text" placeholder='اسم المكون (مثال: لحمة)' />
                        <input name='quantity' value={currentIng.quantity} onChange={onIngChangeHandler} type="text" placeholder='الكمية (مثال: 500 جم)' />
                        <input name='price' value={currentIng.price} onChange={onIngChangeHandler} type="number" placeholder='السعر' />
                    </div>
                    <button type='button' className='add-ing-btn' onClick={addIngredient}>+ إضافة مكون</button>

                    <div className="ingredients-list">
                        {ingredientsList.map((ing, index) => (
                            <div key={index} className="ing-item">
                                <span>{ing.name} - {ing.quantity} ({ing.price} EGP)</span>
                                <span onClick={() => removeIngredient(index)} className="remove-ing">X</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='flex-col'>
                    <p>طريقة التحضير (خطوات مكتوبة)</p>
                    <textarea onChange={onChangeHandler} value={data.steps} name="steps" rows="6" placeholder='اكتب الخطوات بالتفصيل هنا...' required></textarea>
                </div>

                <div className='flex-col'>
                    <p>سعر البوكس (شامل المكونات)</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='200' required />
                </div>
                {/* ⚠️ تم إزالة خانة سعر الفيديو من هنا */}

                <button type='submit' className='add-btn'>رفع الوصفة</button>
            </form>
        </div>
    )
}

export default AddRecipe