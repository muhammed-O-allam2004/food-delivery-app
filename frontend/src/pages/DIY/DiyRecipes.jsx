import React, { useContext, useEffect, useState } from 'react'
import './DiyRecipes.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DiyRecipes = () => {

  const { url } = useContext(StoreContext); // عشان نجيب رابط الباك إند
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // دالة لجلب الوصفات من السيرفر
  const fetchRecipes = async () => {
    try {
        const response = await axios.get(`${url}/api/recipe/list`);
        if (response.data.success) {
            setRecipes(response.data.data);
        }
    } catch (error) {
        console.log("Error fetching recipes");
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, [])

  return (
    <div className='diy-recipes'>
      <div className="diy-header">
        <h2>أطباق الشيف - حضرها بنفسك 👨‍🍳</h2>
        <p>اطلب بوكس المكونات الطازجة وحضر ألذ الوجبات في بيتك مع مساعدة الشيف خطوة بخطوة.</p>
      </div>

      <div className="diy-list">
        {recipes.map((item, index) => {
            return (
                <div key={index} className="diy-card" onClick={() => navigate(`/recipe/${item._id}`)}>
                    <img src={`${url}/images/${item.image}`} alt="" className="diy-card-img" />
                    <div className="diy-card-info">
                        <div>
                            <p className="diy-title">{item.name}</p>
                            <p className="diy-desc">{item.description}</p>
                        </div>
                        <div className="diy-price-row">
                            <p className="diy-price">{item.price} EGP</p>
                            <button className="diy-btn">عرض التفاصيل</button>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default DiyRecipes