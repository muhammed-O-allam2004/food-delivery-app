import React, { useState, useContext, useRef, useEffect } from 'react';
import './AIChat.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'أهلاً بك في Yummy! 🍔 اسألني عن أي حاجة: الكود، الدايت، أو الوصفات!' }
    ]);
    const [loading, setLoading] = useState(false);
    const { url } = useContext(StoreContext);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(url + "/api/ai/ask", { prompt: input });
            if (response.data.success) {
                let aiReply = response.data.data;
                
                // دالة مساعدة للتعامل مع التوجيه
                const handleRedirect = (keyword, path) => {
                    // ✅ 1. بنشيل كلمة التوجيه من النص عشان نعرض الرد النظيف
                    const cleanText = aiReply.replace(keyword, "").trim();
                    // ✅ 2. لو فيه رد (زي اسم الكود) بنعرضه، لو مفيش بنحط رسالة افتراضية
                    const finalText = cleanText || "تمام، بحولك للصفحة حالاً... 🚀";
                    
                    setMessages(prev => [...prev, { role: 'ai', text: finalText }]);
                    
                    // ✅ 3. ننتظر ثانيتين عشان العميل يقرأ الرد، وبعدين نحول
                    setTimeout(() => { 
                        navigate(path); 
                        if(path !== '/offers') setIsOpen(false); // نسيب الشات مفتوح في العروض بس، ونقفله في الباقي
                    }, 2000);
                };

                if (aiReply.includes("REDIRECT_TO_OFFERS")) handleRedirect("REDIRECT_TO_OFFERS", "/offers");
                else if (aiReply.includes("REDIRECT_TO_FITNESS")) handleRedirect("REDIRECT_TO_FITNESS", "/fitness-food");
                else if (aiReply.includes("REDIRECT_TO_DIY")) handleRedirect("REDIRECT_TO_DIY", "/diy-recipes");
                else if (aiReply.includes("REDIRECT_TO_MENU")) handleRedirect("REDIRECT_TO_MENU", "/");
                else {
                    // رد عادي مفيهوش توجيه (زي لما يجاوب بالكود بس)
                    setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
                }

            } else {
                setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حصلت مشكلة تقنية.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'تأكد من تشغيل السيرفر!' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ai-chat-container'>
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <span>🤖 مساعد Yummy الذكي</span>
                        <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>✖</button>
                    </div>
                    <div className="ai-chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="message ai">بيفكر... 🤔</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="ai-chat-input">
                        <input 
                            type="text" 
                            placeholder="اسأل عن الكود، أكلة دايت..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>إرسال</button>
                    </div>
                </div>
            )}
            <button className="ai-chat-button" onClick={() => setIsOpen(!isOpen)}>
                <span>{isOpen ? '❌' : '💬'}</span>
            </button>
        </div>
    );
};

export default AIChat;