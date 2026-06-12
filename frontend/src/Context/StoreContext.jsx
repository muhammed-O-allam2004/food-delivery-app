import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"; 
    const [token, setToken] = useState("");
    const [food_list, setFood_list] = useState([]);
    const [fitness_list, setFitness_list] = useState([]); 
    
    // ✅ 1. تعريف قائمة الوصفات عشان السلة تشوفها
    const [recipe_list, setRecipe_list] = useState([]);

    const [promoDiscount, setPromoDiscount] = useState(0); 
    const [search, setSearch] = useState("");

    const currency = "EGP"; 
    const deliveryCharge = 20; 

    const addToCart = async (itemId, variant) => {
        if (!variant) variant = "Standard";
        const itemKey = `${itemId}_${variant}`;

        if (!cartItems[itemKey]) {
            setCartItems((prev) => ({ ...prev, [itemKey]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemKey]: prev[itemKey] + 1 }));
        }

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId, variant }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId, variant) => {
        if (!variant) variant = "Standard";
        const itemKey = `${itemId}_${variant}`;
        
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[itemKey] > 1) {
                updatedCart[itemKey] -= 1;
            } else {
                delete updatedCart[itemKey];
            }
            return updatedCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId, variant }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemKey in cartItems) {
            if (cartItems[itemKey] > 0) {
                const [itemId, variant] = itemKey.split('_'); 
                
                // ✅ 2. البحث في الـ 3 قوائم (أكل، فيتنس، وصفات)
                let itemInfo = food_list.find((product) => product._id === itemId);
                if (!itemInfo) itemInfo = fitness_list.find((product) => product._id === itemId);
                if (!itemInfo) itemInfo = recipe_list.find((product) => product._id === itemId); // ✅ هنا الحل

                if (itemInfo) {
                    let basePrice = itemInfo.discount 
                        ? itemInfo.price - (itemInfo.price * itemInfo.discount / 100) 
                        : (itemInfo.offer 
                            ? itemInfo.price - (itemInfo.price * itemInfo.discount / 100)
                            : itemInfo.price);
                    
                    let multiplier = 1;
                    const s = String(variant).toLowerCase();

                    if (s.includes("ثمن") || s.includes("1/8")) multiplier = 0.15;
                    else if (s.includes("ربع") || s.includes("1/4")) multiplier = 0.28;
                    else if (s.includes("نص") || s.includes("1/2")) multiplier = 0.55;
                    else if (s.includes("s") || s.includes("صغير")) multiplier = 0.60;
                    else if (s.includes("m") || s.includes("وسط")) multiplier = 0.80;
                    else if (s.includes("xl") || s.includes("جامبو")) multiplier = 1.25;
                    else if (s.includes("family") || s.includes("عائلي")) multiplier = 1.5;
                    else if (s.includes("double")) multiplier = 1.8;
                    else if (s.includes("2 قطعة")) multiplier = 2;
                    else if (s.includes("3 قطع")) multiplier = 3;
                    else if (s.includes("5 قطع")) multiplier = 5;

                    totalAmount += Math.round(basePrice * multiplier) * cartItems[itemKey];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFood_list(response.data.data);
    };

    const fetchFitnessList = async () => {
        try {
            const response = await axios.get(url + "/api/fitness/list");
            if (response.data.success) {
                setFitness_list(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching fitness list");
        }
    }

    // ✅ 3. دالة جلب الوصفات من السيرفر
    const fetchRecipeList = async () => {
        try {
            const response = await axios.get(url + "/api/recipe/list");
            if (response.data.success) {
                setRecipe_list(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching recipe list");
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await fetchFitnessList(); 
            await fetchRecipeList(); // ✅ تشغيل الدالة
            
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        fitness_list, 
        recipe_list, // ✅ 4. تصدير القائمة للسلة (ده اللي كان ناقص)
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        currency,
        deliveryCharge, 
        promoDiscount,   
        setPromoDiscount,
        search,
        setSearch
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;