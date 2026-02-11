import foodModel from "../models/foodModel.js";
import fitnessModel from "../models/fitnessModel.js"; 
import recipeModel from "../models/recipeModel.js";   

const askAI = async (req, res) => {
    const { prompt } = req.body;
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        // 1. اختيار الموديل
        const modelsListResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const modelsData = await modelsListResponse.json();
        
        let validModel = "models/gemini-pro"; 
        if (modelsData.models) {
            const foundModel = modelsData.models.find(m => 
                m.supportedGenerationMethods?.includes("generateContent") &&
                (m.name.includes("flash") || m.name.includes("pro"))
            );
            if (foundModel) validModel = foundModel.name;
        }

        // 2. تجميع البيانات
        const foods = await foodModel.find({});
        const fitnessFoods = await fitnessModel.find({}); 
        const recipes = await recipeModel.find({});       

        // تجهيز النصوص
        const menuContext = foods.filter(f => !f.offer).map(f => `${f.name} (${f.price} EGP)`).join(", ");
        
        // حساب السعر بعد الخصم للفيتنس
        const fitnessContext = fitnessFoods.map(f => {
            let priceText = `${f.price} EGP`;
            if (f.discount > 0) {
                const newPrice = f.price - (f.price * f.discount / 100);
                priceText = `(سعر لقطة! ${newPrice} EGP بدلاً من ${f.price} EGP - خصم ${f.discount}%)`;
            }
            // ✅ التصنيف ده [تخسيس] أو [عضلات] هو اللي الـ AI هيستخدمه للفلترة
            return `${f.name} [تصنيف: ${f.category === 'Diet' ? 'تخسيس' : 'عضلات'}] ${priceText}`;
        }).join(", ");

        const recipeContext = recipes.map(r => 
            `${r.name} [بوكس تحضير منزلي] (${r.price} EGP)`
        ).join(", ");

        const promoInfo = "كود الخصم الحالي هو 'BIG20'. بيخصم 20% للطلبات فوق 1000 جنيه (متاح مرة كل 6 شهور).";

        // 3. التعليمات الذكية (تم تحديث قواعد الاقتراح)
        const systemInstruction = `
        أنت مساعد ذكي لمطعم Yummy.
        
        البيانات المتاحة:
        - المنيو العادي: ${menuContext}
        - منيو اللياقة (Fitness): ${fitnessContext}
        - الوصفات: ${recipeContext}
        - العروض: ${promoInfo}

        قواعد الرد (هام جداً):
        1. 🎯 **قاعدة التخصص:** - لو العميل طلب "بروتين" أو "عضلات" أو "جيم" -> اقترح عليه **فقط** الوجبات المصنفة [تصنيف: عضلات].
           - لو العميل طلب "دايت" أو "تخسيس" أو "سعرات قليلة" -> اقترح عليه **فقط** الوجبات المصنفة [تصنيف: تخسيس].
           - لو طلب "أكل صحي" بشكل عام -> اقترح الاثنين.
           
        2. اذكر السعر والخصم (لو موجود) دايماً.
        
        3. التوجيهات (REDIRECT):
           - للعروض -> REDIRECT_TO_OFFERS
           - للدايت/الجيم -> REDIRECT_TO_FITNESS
           - للوصفات -> REDIRECT_TO_DIY
           - للمنيو -> REDIRECT_TO_MENU

        جاوب بلهجة مصرية.
        سؤال العميل: ${prompt}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/${validModel}:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemInstruction }] }] })
        });

        const data = await response.json();
        if (!response.ok) return res.json({ success: false, message: "جوجل زعلان مننا" });

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ success: true, data: reply });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "خطأ في السيرفر" });
    }
}

export { askAI };