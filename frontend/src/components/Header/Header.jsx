import React, { useState, useEffect } from 'react'
import './Header.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            image: assets.header_img,
            title: "اطلب طعامك المفضل الأن!!",
            paragraph: "اختر من قائمة متنوعة تضم مجموعة شهية من الأطباق المصنوعة بأفضل المكونات والمهارة الطهوية.",
            btnText: "تصفح المنيو !",
            type: "scroll",
            path: null 
        },
        {
            image: assets.header_img2,
            title: "عروض وتخفيضات نااار 🔥",
            paragraph: "متفوتش الفرصة! خصومات حصرية على المشويات والحلويات لفترة محدودة. اطلب دلوقتي ووفر فلوسك.",
            btnText: "اذهب للعروض 🏃‍♂️",
            type: "navigate",
            path: "/offers" 
        },
        {
            image: assets.header_img3, 
            title: "المطعم بعيد؟.. جبنا لك المطبخ كله لحد باب البيت!",
            paragraph: "المسافة مش هتمنعك تستمتع بأكلنا! اطلب 'بوكس التحضير' يوصلك فيه كل المكونات طازجة لحد عندك، مع فيديو حصري للشيف بيشرحلك الطريقة خطوة بخطوة.",
            btnText: "اطلب بوكس التحضير",
            type: "navigate",
            path: "/diy-recipes" 
        },
        {
            // ✅ الشريحة الرابعة الجديدة (Fitness)
            image: assets.header_img4, 
            title: "عايز تخس ولا تبني عضلات؟ 💪🥗",
            paragraph: "سواء بتدور على أكل صحي سعراته قليلة، أو وجبات مليانة بروتين للتمرين.. عندنا اللي يظبط جسمك!",
            btnText: "شوف أكل الجيم والدايت",
            type: "navigate",
            path: "/fitness-food" // ✅ المسار الجديد
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length);
        }, 20000); 
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleBtnClick = (slide) => {
        if (slide.type === 'scroll') {
            const menuElement = document.getElementById('explore-menu');
            if (menuElement) {
                menuElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(slide.path);
        }
    }

    const nextSlide = () => {
        setIndex(prev => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

  return (
    <div className='header'>
        
        {slides.map((slide, i) => (
            <img 
                key={i}
                src={slide.image} 
                alt="" 
                className={`header-img-slider ${i === index ? 'active' : 'hidden'}`} 
            />
        ))}

        <div className="header-contents" key={index}>
            <h2>{slides[index].title}</h2>
            <p>{slides[index].paragraph}</p>
            <button onClick={() => handleBtnClick(slides[index])}>
                {slides[index].btnText}
            </button>
        </div>

        <div className="header-arrows">
            <button className="arrow-btn right" onClick={nextSlide}>&#10094;</button>
            <button className="arrow-btn left" onClick={prevSlide}>&#10095;</button>
        </div>

        <div className="slider-dots">
            {slides.map((_, idx) => (
                <span 
                    key={idx} 
                    className={`dot ${index === idx ? 'active' : ''}`}
                    onClick={() => setIndex(idx)}
                ></span>
            ))}
        </div>
    </div>
  )
}

export default Header