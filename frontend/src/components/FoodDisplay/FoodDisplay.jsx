import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { menu_list } from '../../assets/assets'

const FoodDisplay = ({ category }) => {

  // ✅ 1. استدعاء search عشان نعرف العميل بيبحث عن إيه
  const { food_list, search } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      
      {menu_list.map((menuItem, index) => {
        
        if (category === "All" || category === menuItem.menu_name) {
            
            // ✅ 2. الفلترة: بنشوف هل فيه أكلات في القسم ده اسمها بيحتوي على كلمة البحث؟
            const hasItems = food_list.some(item => 
                item.category === menuItem.menu_name && 
                !item.offer && 
                item.name.toLowerCase().includes(search.toLowerCase())
            );

            // لو لقينا أكل مطابق للبحث، نعرض القسم
            if (hasItems) {
                return (
                    <div key={index} className="category-section">
                        <h2>منيو {menuItem.menu_name}</h2>
                        
                        <div className="food-display-list">
                            {food_list.map((item, i) => {
                                // ✅ 3. وهنا بنعرض الأكلة نفسها لو اسمها مطابق للبحث
                                if (item.category === menuItem.menu_name && !item.offer && item.name.toLowerCase().includes(search.toLowerCase())) {
                                    return <FoodItem 
                                        key={i} 
                                        id={item._id} 
                                        name={item.name} 
                                        description={item.description} 
                                        price={item.price} 
                                        image={item.image} 
                                        category={item.category}
                                        offer={item.offer}
                                        discount={item.discount}
                                        variants={item.variants} 
                                        includes={item.includes}
                                    />
                                }
                                return null;
                            })}
                        </div>
                        <hr style={{margin: '30px 0', border: 'none', borderBottom: '1px solid #e2e2e2'}} />
                    </div>
                )
            }
        }
        return null;
      })}
    </div>
  )
}

export default FoodDisplay