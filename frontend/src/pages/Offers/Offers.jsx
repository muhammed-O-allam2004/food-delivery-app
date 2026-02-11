import React, { useContext } from 'react'
import './Offers.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

const Offers = () => {

  const { food_list } = useContext(StoreContext);

  // التعديل هنا: بنقبل العرض سواء كان true (منطقي) أو "true" (نص)
  const offersList = food_list.filter((item) => item.offer === true || item.offer === "true");

  return (
    <div className='offers-page'>
      <div className="offers-header">
        <h1>عروض وتخفيضات نااار 🔥</h1>
        <p>استمتع بأقوى الخصومات الحقيقية على وجباتك المفضلة!</p>
      </div>

      <div className="offers-list">
        {offersList.length > 0 ? (
          offersList.map((item, index) => {
            return <FoodItem 
                key={index} 
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
          })
        ) : (
          <div className="no-offers">
            <h2>⏳ انتظروا عروضنا قريباً!</h2>
            <p>بنجهزلك مفاجآت مش هتتوقعها..</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Offers