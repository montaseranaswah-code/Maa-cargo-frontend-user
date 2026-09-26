import React, { useState } from 'react';
import axios from 'axios';

export default function LoginScreen({ onLoginSuccess, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lang, setLang] = useState('ar');
    const [error, setError] = useState('');

    const t = {
        ar: {
            brand: "MAA-CARGO",
            subtitle: "تسجيل دخول المستخدم",
            title: "تسجيل الدخول إلى MAA-CARGO",
            desc: "إدارة الشحنات والطلبات من لوحة تحكم واحدة.",
            emailLabel: "البريد الإلكتروني",
            passLabel: "كلمة المرور",
            loginBtn: "دخول",
            noAccount: "ليس لديك حساب؟ انشئ حساب جديد"
        },
        en: {
            brand: "MAA-CARGO",
            subtitle: "USER ACCESS",
            title: "Sign in to MAA-CARGO",
            desc: "Manage shipments, invoices and tracking from one console.",
            emailLabel: "Email Address",
            passLabel: "Password",
            loginBtn: "Sign In",
            noAccount: "New to MAA-CARGO? Create your own account."
        }
    };

    const currentText = t[lang];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password
            });
            
            // استخراج التوكن من استجابة لاراول (قد يكون response.data.token أو response.data.access_token)
            const token = response.data.token || response.data.access_token;

            if (token) {
                // تخزين التوكن مباشرة كنص (حتى لا يحدث خطأ undefined)
                localStorage.setItem('authToken', token);
                onLoginSuccess(token);
            } else {
                setError(lang === 'ar' ? 'لم يتم العثور على رمز التوكن في استجابة السيرفر.' : 'Token not found in server response.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            const msg = err.response?.data?.message || err.message;
            setError(lang === 'ar' ? `فشل تسجيل الدخول: ${msg}` : `Login failed: ${msg}`);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            backgroundColor: '#070b12', 
            backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            color: '#0f172a', 
            fontFamily: 'sans-serif', 
            direction: lang === 'ar' ? 'rtl' : 'ltr' 
        }}>
            
            <div style={{ height: '70px', background: '#0b0f19', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', border: '1px solid #d4af37', transform: 'rotate(45deg)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', background: '#d4af37', transform: 'rotate(-45deg)' }}></div>
                    </div>
                    <h2 style={{ color: '#ffffff', fontSize: '18px', margin: 0, letterSpacing: '0.5px', fontWeight: 'bold' }}>{currentText.brand}</h2>
                </div>

                <div>
                    <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ padding: '6px 14px', background: 'transparent', color: '#d4af37', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        {lang === 'ar' ? 'EN' : 'AR'}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '440px', 
                    backgroundColor: '#fbf9f5', 
                    padding: '40px 35px', 
                    borderRadius: '4px', 
                    border: '1px solid #e2d9ce', 
                    boxShadow: '0 20px 30px rgba(0,0,0,0.5)' 
                }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', fontWeight: 'bold' }}>{currentText.subtitle}</span>
                        <h2 style={{ color: '#0f172a', fontSize: '22px', margin: '8px 0 6px 0', fontWeight: 'bold' }}>{currentText.title}</h2>
                        <p style={{ color: '#475569', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>{currentText.desc}</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px', textAlign: 'center', border: '1px solid #f87171' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.emailLabel}</label>
                            <input 
                                type="email" 
                                placeholder="name@cargo.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', outline: 'none' }} 
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.passLabel}</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', outline: 'none' }} 
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={{ width: '100%', padding: '11px', background: '#0b0f19', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
                            {currentText.loginBtn}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <span 
                            onClick={onSwitchToRegister} 
                            style={{ color: '#2563eb', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}>
                            {currentText.noAccount}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
}