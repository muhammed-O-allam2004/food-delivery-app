import React, { useEffect, useState } from 'react'
import './ListRecipe.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListRecipe = ({url}) => {

  const [list, setList] = useState([]);

  // دالة لجلب قائمة الوصفات من السيرفر
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/recipe/list`);
    if (response.data.success) {
      setList(response.data.data);
      console.log(response.data.data); // عشان نتأكد في الكونسول
    } else {
      toast.error("حدث خطأ أثناء جلب البيانات");
    }
  }

  // دالة مسح الوصفة
  const removeRecipe = async(recipeId) => {
    const response = await axios.post(`${url}/api/recipe/remove`, {id:recipeId});
    await fetchList(); // تحديث القائمة بعد المسح
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("فشل الحذف");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>قائمة وصفات البوكس (Recipes List)</p>
      <div className="list-table">
        <div className="list-table-format title">
            <b>صورة</b>
            <b>الاسم</b>
            <b>القسم</b>
            <b>السعر</b>
            <b>مسح</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price} EGP</p>
              <p onClick={() => removeRecipe(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListRecipe