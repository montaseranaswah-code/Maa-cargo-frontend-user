import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterScreen({ onRegisterSuccess, onSwitchToLogin, onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [lang, setLang] = useState('ar');
    const [error, setError] = useState('');

    const t = {
        ar: {
            brand: "MAA-CARGO",
            subtitle: "إنشاء حساب جديد",
            title: "إنشاء حساب في MAA-CARGO",
            desc: "سجل حسابك الآن لإدارة وتتبع شحناتك بكل سهولة.",
            nameLabel: "الاسم الكامل",
            emailLabel: "البريد الإلكتروني",
            passLabel: "كلمة المرور",
            confirmPassLabel: "تأكيد كلمة المرور",
            registerBtn: "تسجيل حساب",
            hasAccount: "لديك حساب بالفعل؟ سجل دخول"
        },
        en: {
            brand: "MAA-CARGO",
            subtitle: "NEW ACCOUNT",
            title: "Create an Account",
            desc: "Register now to easily manage and track your shipments.",
            nameLabel: "Full Name",
            emailLabel: "Email Address",
            passLabel: "Password",
            confirmPassLabel: "Confirm Password",
            registerBtn: "Register Account",
            hasAccount: "Already have an account? Sign in"
        }
    };

    const currentText = t[lang];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== passwordConfirmation) {
            setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            
            // تم تسجيل الحساب بنجاح
            const token = response.data.token;
            
            // نحاول استخدام أي دالة نجاح تم تمريرها من المكون الأب
            if (typeof onRegisterSuccess === 'function') {
                onRegisterSuccess(token);
            } else if (typeof onSuccess === 'function') {
                onSuccess(token);
            } else {
                // إذا لم يتم تمرير أي دالة، نقوم بتحويل المستخدم لتسجيل الدخول يدوياً
                onSwitchToLogin();
            }
        } catch (err) {
            console.error("Register Error Details:", err.response);
            const serverMsg = err.response?.data?.message || err.response?.data?.error || JSON.stringify(err.response?.data) || err.message;
            setError(lang === 'ar' ? `فشل إنشاء الحساب: ${serverMsg}` : `Registration failed: ${serverMsg}`);
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
            
            {/* الشريط العلوي */}
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

            {/* محتوى نموذج إنشاء الحساب */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px 20px' }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '440px', 
                    backgroundColor: '#fbf9f5', 
                    padding: '35px 35px', 
                    borderRadius: '4px', 
                    border: '1px solid #e2d9ce', 
                    boxShadow: '0 20px 30px rgba(0,0,0,0.5)' 
                }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', fontWeight: 'bold' }}>{currentText.subtitle}</span>
                        <h2 style={{ color: '#0f172a', fontSize: '20px', margin: '6px 0 4px 0', fontWeight: 'bold' }}>{currentText.title}</h2>
                        <p style={{ color: '#475569', fontSize: '12px', margin: 0, lineHeight: '1.4' }}>{currentText.desc}</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px', textAlign: 'center', border: '1px solid #f87171', wordBreak: 'break-word' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} style={{ display: 'grid', gap: '14px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{currentText.nameLabel}</label>
                            <input 
                                type="text" 
                                placeholder="Montaser Anaswah" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', outline: 'none' }} 
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{currentText.emailLabel}</label>
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
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{currentText.passLabel}</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', outline: 'none' }} 
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: '#0f172a', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{currentText.confirmPassLabel}</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={passwordConfirmation} 
                                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                                required 
                                style={{ width: '100%', padding: '10px 12px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px', outline: 'none' }} 
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={{ width: '100%', padding: '11px', background: '#0b0f19', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
                            {currentText.registerBtn}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <span 
                            onClick={onSwitchToLogin} 
                            style={{ color: '#2563eb', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}>
                            {currentText.hasAccount}
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
}