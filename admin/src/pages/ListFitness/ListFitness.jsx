import React, { useEffect, useState } from 'react'
import './ListFitness.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListFitness = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    // ⚠️ تأكد من مسار الباك إند
    const response = await axios.get(`${url}/api/fitness/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  }

  const removeFitnessItem = async(fitnessId) => {
    const response = await axios.post(`${url}/api/fitness/remove`, {id:fitnessId});
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>قائمة وجبات الفيتنس (Diet & Muscle)</p>
      <div className="list-table">
        <div className="list-table-format title">
            <b>صورة</b>
            <b>الاسم</b>
            <b>القسم</b>
            <b>السعر</b>
            <b>الخصم</b>
            <b>مسح</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p style={{color: item.category === 'Diet' ? 'green' : 'blue', fontWeight:'bold'}}>
                  {item.category === 'Diet' ? 'تخسيس 🥗' : 'عضلات 💪'}
              </p>
              <p>{item.price} EGP</p>
              <p>{item.discount > 0 ? item.discount + "%" : "-"}</p>
              <p onClick={() => removeFitnessItem(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListFitness