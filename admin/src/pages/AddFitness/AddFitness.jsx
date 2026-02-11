import React, { useState } from 'react'
import './AddFitness.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddFitness = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
      name: "",
      description: "",
      price: "",
      category: "Diet", // القيمة الافتراضية
      discount: "0"     // ✅ خانة الخصم الجديدة
  });

  const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({...data, [name]: value}));
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("discount", Number(data.discount)); // إرسال الخصم
      formData.append("image", image);

      // ⚠️ تأكد إنك هتعمل المسار ده في الباك إند
      const response = await axios.post(`${url}/api/fitness/add`, formData);
      if (response.data.success) {
          setData({
              name: "",
              description: "",
              price: "",
              category: "Diet",
              discount: "0"
          })
          setImage(false);
          toast.success("تم إضافة الوجبة بنجاح 💪");
      } else {
          toast.error("حدث خطأ");
      }
  }

  return (
    <div className='add-fitness'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>صورة الوجبة</p>
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
            </div>
            
            <div className="add-product-name flex-col">
                <p>اسم الوجبة</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='مثال: سلطة تونة' required />
            </div>
            
            <div className="add-product-description flex-col">
                <p>وصف الوجبة (مكونات وسعرات)</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='اكتب هنا المكونات والسعرات الحرارية...' required></textarea>
            </div>

            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>القسم</p>
                    <select onChange={onChangeHandler} name="category" >
                        <option value="Diet">تخسيس (Diet)</option>
                        <option value="Protein">بناء عضلات (High Protein)</option>
                    </select>
                </div>
                
                <div className="add-price flex-col">
                    <p>السعر (EGP)</p>
                    <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='200' required />
                </div>

                {/* ✅ خانة الخصم */}
                <div className="add-discount flex-col">
                    <p>خصم % (اختياري)</p>
                    <input onChange={onChangeHandler} value={data.discount} type="Number" name='discount' placeholder='0' />
                </div>
            </div>

            <button type='submit' className='add-btn'>إضافة للقائمة</button>
        </form>
    </div>
  )
}

export default AddFitness