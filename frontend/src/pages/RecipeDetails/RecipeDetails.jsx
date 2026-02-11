import React, { useContext, useEffect, useState } from 'react'
import './RecipeDetails.css'
import { StoreContext } from '../../Context/StoreContext'
import { useParams, useNavigate } from 'react-router-dom' 
import axios from 'axios'

const RecipeDetails = () => {

  const { id } = useParams();
  // ✅ 1. ضفنا addToCart هنا عشان نستخدمها
  const { url, addToCart } = useContext(StoreContext);
  const navigate = useNavigate(); 
  
  const [recipe, setRecipe] = useState(null);

  const fetchRecipeData = async () => {
    try {
        const response = await axios.get(`${url}/api/recipe/list`);
        if (response.data.success) {
            const foundRecipe = response.data.data.find(item => item._id === id);
            setRecipe(foundRecipe);
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchRecipeData();
  }, [id])

  // ✅ 2. التعديل هنا: إضافة للسلة ثم الذهاب لصفحة السلة
  const handleBuyBox = () => {
      addToCart(recipe._id);
      navigate('/cart');
  }

  if (!recipe) return <div className='recipe-details'>جاري التحميل...</div>

  return (
    <div className='recipe-details'>
        <div className="recipe-left">
            <img src={`${url}/images/${recipe.image}`} alt="" className="recipe-img" />
            
            <div className="video-wrapper">
                <video controls className='recipe-video' poster={`${url}/images/${recipe.image}`}>
                    <source src={`${url}/images/${recipe.video}`} type="video/mp4" />
                    متصفحك لا يدعم الفيديو.
                </video>
            </div>
        </div>

        <div className="recipe-right">
            <h1 className="recipe-name">{recipe.name}</h1>
            <p className="recipe-desc">{recipe.description}</p>

            <div className="ingredients-box">
                <h3>🛒 مكونات البوكس:</h3>
                <ul className="ingredients-list">
                    {recipe.ingredients.map((ing, index) => (
                        <li key={index}>
                            <span>{ing.name}</span>
                            <span>{ing.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="steps-box">
                <h3>👨‍🍳 طريقة التحضير:</h3>
                <div className="steps-content">
                    {recipe.steps && recipe.steps.split('\n').map((step, i) => (
                        step.trim() !== "" && <p key={i}>✅ {step}</p>
                    ))}
                </div>
            </div>

            <div className="action-buttons">
                {/* تم تعديل النص ليتناسب مع الوظيفة الجديدة */}
                <button onClick={handleBuyBox} className="buy-box-btn">
                    إضافة البوكس للسلة ({recipe.price} EGP) 🛒
                </button>
            </div>
        </div>
    </div>
  )
}

export default RecipeDetails