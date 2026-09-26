import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrackingScreen from './TrackingScreen';

export default function UserDashboard({ token, onLogout }) {
    const [activeTab, setActiveTab] = useState('services');
    const [shipments, setShipments] = useState([]);
    const [lang, setLang] = useState('ar');
    
    // حقول الشحن التفصيلية
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('الإمارات - مطار دبي الدولي (DXB)');
    const [packagesCount, setPackagesCount] = useState(1);
    const [weight, setWeight] = useState('');
    const [cargoType, setCargoType] = useState('ملابس وأقمشة');
    const [packageType, setPackageType] = useState('صندوق');
    const [units, setUnits] = useState('');
    const [notes, setNotes] = useState('');

    const destinationsList = {
        ar: [
            "الإمارات - مطار دبي الدولي (DXB)",
            "الإمارات - مطار أبوظبي الدولي (AUH)",
            "قطر - مطار حمد الدولي (DOH)",
            "السعودية - مطار الملك خالد الدولي - الرياض (RUH)",
            "السعودية - مطار الملك عبد العزيز الدولي - جدة (JED)",
            "أمريكا - مطار جون إف كينيدي - نيويورك (JFK)",
            "أمريكا - مطار لوس أنجلوس الدولي (LAX)",
            "بريطانيا - مطار هيثرو - لندن (LHR)",
            "ألمانيا - مطار فرانكفورت (FRA)",
            "النرويج - مطار أوسلو غاردرموين (OSL)"
        ],
        en: [
            "UAE - Dubai International Airport (DXB)",
            "UAE - Abu Dhabi International Airport (AUH)",
            "Qatar - Hamad International Airport (DOH)",
            "Saudi Arabia - King Khalid International Airport - Riyadh (RUH)",
            "Saudi Arabia - King Abdulaziz International Airport - Jeddah (JED)",
            "USA - John F. Kennedy International Airport - New York (JFK)",
            "USA - Los Angeles International Airport (LAX)",
            "UK - Heathrow Airport - London (LHR)",
            "Germany - Frankfurt Airport (FRA)",
            "Norway - Oslo Gardermoen Airport (OSL)"
        ]
    };

    const t = {
        ar: {
            brand: "MAA-CARGO",
            subtitle: "بوابة الشحن الجوي",
            services: "الخدمات",
            addShipment: "+ طلب شحن جديد",
            myShipments: `شحناتي (${shipments.length})`,
            tracking: "تتبع شحنة",
            logout: "تسجيل خروج",
            servicesTitle: "خدمات الشحن الجوي المتاحة",
            servicesDesc: "اختر خدمة الشحن المناسبة لطلبك أو ابدأ بطلب شحنة جديدة مباشرة.",
            expressTitle: "شحن جوي سريع (Express)",
            expressDesc: "خدمة نقل وشحن جوي سريعة جداً للطرود والطرود التجارية المستعجلة.",
            tempTitle: "شحن بدرجة حرارة مراقبة",
            tempDesc: "نقل جوي مخصص للأدوية، المواد الغذائية، والمواد الحساسة للحرارة.",
            customsTitle: "التخليص الجمركي",
            customsDesc: "خدمات متكاملة لتخليص الشحنات ومستندات المطارات في بلد المصدر والمقصد.",
            bookNow: "اطلب الآن",
            newShipmentTitle: "✈ طلب شحن جوي جديد",
            sourceLabel: "اسم المصدر:",
            sourcePh: "أدخل اسم المصدر",
            destLabel: "بلد المقصد والمطار:",
            pkgCountLabel: "عدد الطرود:",
            weightLabel: "الوزن (كغ):",
            cargoTypeLabel: "نوع البضاعة:",
            pkgTypeLabel: "نوع الطرود:",
            unitsLabel: "الوحدات الإحصائية:",
            unitsPh: "قطعة، متر، لتر...",
            notesLabel: "تفاصيل إضافية:",
            notesPh: "ملاحظات أخرى...",
            submitBtn: "إرسال الشحنة",
            cancelBtn: "إلغاء",
            prevShipments: `✈ شحناتك السابقة (${shipments.length})`,
            noShipments: "لا توجد شحنات مسجلة في حسابك حتى الآن.",
            trackingNum: "رقم التتبع:",
            dest: "الوجهة:",
            weightText: "الوزن:",
            detailsText: "التفاصيل:",
            footerDesc: "منصة رائدة للشحن الجوي والخدمات اللوجستية وإدارة الطرود بكل احترافية.",
            quickLinks: "روابط سريعة",
            supportContact: "الدعم والاتصال",
            systemStatus: "حالة النظام",
            systemActive: "● النظام يعمل بكفاءة",
            rights: "© 2026 MAA-CARGO All Rights Reserved."
        },
        en: {
            brand: "MAA-CARGO",
            subtitle: "Air Freight Portal",
            services: "Services",
            addShipment: "+ New Shipment",
            myShipments: `My Shipments (${shipments.length})`,
            tracking: "Track Shipment",
            logout: "Logout",
            servicesTitle: "Available Air Freight Services",
            servicesDesc: "Choose the appropriate shipping service or start a new booking directly.",
            expressTitle: "Express Air Freight",
            expressDesc: "Extremely fast air transport and freight service for urgent commercial packages.",
            tempTitle: "Temperature Controlled",
            tempDesc: "Specialized air transport for pharmaceuticals, foodstuffs, and temperature-sensitive goods.",
            customsTitle: "Customs Clearance",
            customsDesc: "Comprehensive services for clearing shipments and airport documents at origin and destination.",
            bookNow: "Book Now",
            newShipmentTitle: "✈ Book New Air Waybill",
            sourceLabel: "Source Name:",
            sourcePh: "Enter source name",
            destLabel: "Destination Country & Airport:",
            pkgCountLabel: "Packages Count:",
            weightLabel: "Weight (KG):",
            cargoTypeLabel: "Cargo Type:",
            pkgTypeLabel: "Package Type:",
            unitsLabel: "Statistical Units:",
            unitsPh: "pcs, meters, liters...",
            notesLabel: "Additional Details:",
            notesPh: "Other notes...",
            submitBtn: "Submit Shipment",
            cancelBtn: "Cancel",
            prevShipments: `✈ Previous Shipments (${shipments.length})`,
            noShipments: "No shipments registered in your account yet.",
            trackingNum: "Tracking No:",
            dest: "Destination:",
            weightText: "Weight:",
            detailsText: "Details:",
            footerDesc: "A leading platform for air freight, logistics, and professional cargo management.",
            quickLinks: "Quick Links",
            supportContact: "Support & Contact",
            systemStatus: "System Status",
            systemActive: "● System Operational",
            rights: "© 2026 MAA-CARGO All Rights Reserved."
        }
    };

    const currentText = t[lang];
    const currentDestinations = destinationsList[lang];

    useEffect(() => {
        if (token) {
            fetchShipments();
        }
    }, [token]);

    const fetchShipments = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/shipments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShipments(res.data);
        } catch (err) {
            console.error('خطأ في جلب الشحنات', err);
        }
    };

    const handleAddShipment = async (e) => {
        e.preventDefault();
        try {
            const fullDescription = `المصدر: ${source} | الطرود: ${packagesCount} (${packageType}) | وحدات: ${units} | نوع البضاعة: ${cargoType} | ملاحظات: ${notes}`;
            await axios.post('http://localhost:8000/api/shipments', {
                destination: destination,
                weight: weight || 0,
                description: fullDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSource('');
            setPackagesCount(1);
            setWeight('');
            setUnits('');
            setNotes('');
            fetchShipments();
            alert(lang === 'ar' ? 'تم إرسال طلب الشحن الجوي بنجاح!' : 'Air freight shipment request sent successfully!');
            setActiveTab('shipments');
        } catch (err) {
            alert('Error adding shipment');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#fff', fontFamily: 'sans-serif', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            
            {/* الشريط العلوي */}
            <div style={{ height: '70px', background: '#131b2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h2 style={{ color: '#d4af37', fontSize: '20px', margin: 0, letterSpacing: '1px' }}>{currentText.brand}</h2>
                    <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>{currentText.subtitle}</span>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => setActiveTab('services')} style={{ padding: '8px 16px', background: activeTab === 'services' ? '#1e293b' : 'transparent', color: activeTab === 'services' ? '#d4af37' : '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.services}</button>
                    <button onClick={() => setActiveTab('add-shipment')} style={{ padding: '8px 16px', background: activeTab === 'add-shipment' ? '#d4af37' : '#1e293b', color: activeTab === 'add-shipment' ? '#0b0f19' : '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.addShipment}</button>
                    <button onClick={() => setActiveTab('shipments')} style={{ padding: '8px 16px', background: activeTab === 'shipments' ? '#1e293b' : 'transparent', color: activeTab === 'shipments' ? '#d4af37' : '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.myShipments}</button>
                    <button onClick={() => setActiveTab('tracking')} style={{ padding: '8px 16px', background: activeTab === 'tracking' ? '#1e293b' : 'transparent', color: activeTab === 'tracking' ? '#d4af37' : '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.tracking}</button>
                    
                    <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ padding: '8px 14px', background: '#334155', color: '#d4af37', border: '1px solid #475569', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {lang === 'ar' ? 'EN 🇬🇧' : 'AR 🇸🇦'}
                    </button>
                    
                    <button onClick={onLogout} style={{ padding: '8px 16px', background: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', [lang === 'ar' ? 'marginRight' : 'marginLeft']: '15px' }}>{currentText.logout}</button>
                </div>
            </div>

            {/* المحتوى الرئيسي */}
            <div style={{ padding: '40px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                
                {activeTab === 'services' && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ color: '#d4af37', fontSize: '28px', marginBottom: '10px' }}>{currentText.servicesTitle}</h2>
                            <p style={{ color: '#cbd5e1', fontSize: '15px' }}>{currentText.servicesDesc}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                            
                            {/* الخدمة الأولى: شحن جوي سريع (صورة طائرة شحن موثوقة ومضمونة 100%) */}
                            <div style={{ background: '#131b2e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#000' }}>
                                    <img src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Express Air Cargo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{lang === 'ar' ? 'أولوية عالية' : 'High Priority'}</div>
                                        <h3 style={{ marginBottom: '10px', color: '#ffffff', fontSize: '18px' }}>{currentText.expressTitle}</h3>
                                        <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>{currentText.expressDesc}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('add-shipment')} style={{ width: '100%', padding: '10px', background: '#d4af37', color: '#0b0f19', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.bookNow}</button>
                                </div>
                            </div>

                            {/* الخدمة الثانية: شحن مبرد */}
                            <div style={{ background: '#131b2e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#000' }}>
                                    <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" alt="Temperature Controlled" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{lang === 'ar' ? 'بضائع خاصة' : 'Special Cargo'}</div>
                                        <h3 style={{ marginBottom: '10px', color: '#ffffff', fontSize: '18px' }}>{currentText.tempTitle}</h3>
                                        <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>{currentText.tempDesc}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('add-shipment')} style={{ width: '100%', padding: '10px', background: '#d4af37', color: '#0b0f19', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.bookNow}</button>
                                </div>
                            </div>

                            {/* الخدمة الثالثة: التخليص الجمركي */}
                            <div style={{ background: '#131b2e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#000' }}>
                                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" alt="Customs Clearance" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ color: '#d4af37', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>{lang === 'ar' ? 'دعم لوجستي' : 'Logistics Support'}</div>
                                        <h3 style={{ marginBottom: '10px', color: '#ffffff', fontSize: '18px' }}>{currentText.customsTitle}</h3>
                                        <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>{currentText.customsDesc}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('add-shipment')} style={{ width: '100%', padding: '10px', background: '#d4af37', color: '#0b0f19', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{currentText.bookNow}</button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'add-shipment' && (
                    <div style={{ maxWidth: '700px', margin: '0 auto', background: '#131b2e', padding: '30px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                        <h3 style={{ marginBottom: '20px', color: '#d4af37', textAlign: 'center', fontSize: '22px' }}>{currentText.newShipmentTitle}</h3>
                        <form onSubmit={handleAddShipment} style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.sourceLabel}</label>
                                <input type="text" placeholder={currentText.sourcePh} value={source} onChange={(e) => setSource(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.destLabel}</label>
                                <select value={destination} onChange={(e) => setDestination(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', fontSize: '14px' }}>
                                    {currentDestinations.map((dest, idx) => (
                                        <option key={idx} value={dest} style={{ background: '#0b0f19', color: '#ffffff' }}>{dest}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.pkgCountLabel}</label>
                                    <input type="number" min="1" value={packagesCount} onChange={(e) => setPackagesCount(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.weightLabel}</label>
                                    <input type="number" step="0.1" placeholder="0.0" value={weight} onChange={(e) => setWeight(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.cargoTypeLabel}</label>
                                    <select value={cargoType} onChange={(e) => setCargoType(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', fontSize: '14px' }}>
                                        <option value="ملابس وأقمشة">{lang === 'ar' ? 'ملابس وأقمشة' : 'Apparel & Fabrics'}</option>
                                        <option value="إلكترونيات">{lang === 'ar' ? 'إلكترونيات' : 'Electronics'}</option>
                                        <option value="مواد غذائية">{lang === 'ar' ? 'مواد غذائية' : 'Foodstuffs'}</option>
                                        <option value="أدوية ومستلزمات طبية">{lang === 'ar' ? 'أدوية ومستلزمات طبية' : 'Pharmaceuticals'}</option>
                                        <option value="بضائع عامة">{lang === 'ar' ? 'بضائع عامة' : 'General Cargo'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.pkgTypeLabel}</label>
                                    <select value={packageType} onChange={(e) => setPackageType(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', fontSize: '14px' }}>
                                        <option value="صندوق">{lang === 'ar' ? 'صندوق' : 'Box'}</option>
                                        <option value="بلت (Pallet)">{lang === 'ar' ? 'بلت (Pallet)' : 'Pallet'}</option>
                                        <option value="حقيبة">{lang === 'ar' ? 'حقيبة' : 'Bag'}</option>
                                        <option value="برميل">{lang === 'ar' ? 'برميل' : 'Drum'}</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.unitsLabel}</label>
                                <input type="text" placeholder={currentText.unitsPh} value={units} onChange={(e) => setUnits(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', color: '#e2e8f0', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{currentText.notesLabel}</label>
                                <input type="text" placeholder={currentText.notesPh} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0b0f19', border: '1px solid #334155', color: '#ffffff', borderRadius: '6px', boxSizing: 'border-box', fontSize: '14px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', background: '#d4af37', color: '#0b0f19', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>{currentText.submitBtn}</button>
                                <button type="button" onClick={() => setActiveTab('services')} style={{ padding: '12px 20px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' }}>{currentText.cancelBtn}</button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'shipments' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ color: '#d4af37', margin: 0, fontSize: '20px' }}>{currentText.prevShipments}</h3>
                            <button onClick={() => setActiveTab('add-shipment')} style={{ padding: '8px 16px', background: '#d4af37', color: '#0b0f19', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{currentText.addShipment}</button>
                        </div>
                        {shipments.length === 0 ? (
                            <div style={{ background: '#131b2e', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#cbd5e1', border: '1px solid #1e293b' }}>
                                <p>{currentText.noShipments}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {shipments.map((item) => (
                                    <div key={item.id} style={{ background: '#131b2e', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{currentText.trackingNum} {item.tracking_number}</span>
                                            <span style={{ color: '#d4af37', fontSize: '12px', background: '#0b0f19', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #334155' }}>{item.status}</span>
                                        </div>
                                        <div style={{ color: '#ffffff', marginBottom: '4px' }}><strong>{currentText.dest}</strong> {item.destination}</div>
                                        <div style={{ color: '#ffffff', marginBottom: '4px' }}><strong>{currentText.weightText}</strong> {item.weight} KG</div>
                                        <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}><strong>{currentText.detailsText}</strong> {item.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tracking' && (
                    <TrackingScreen token={token} onBack={() => setActiveTab('services')} />
                )}

            </div>

            {/* الفوتر الرسمي */}
            <footer style={{ borderTop: '1px solid #1e293b', padding: '30px 40px', background: '#070b12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontSize: '13px', color: '#94a3b8', marginTop: 'auto' }}>
                <div>
                    <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '15px' }}>{currentText.brand}</div>
                    <p style={{ lineHeight: '1.4', margin: 0, color: '#cbd5e1' }}>{currentText.footerDesc}</p>
                </div>
                <div>
                    <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px' }}>{currentText.quickLinks}</div>
                    <div onClick={() => setActiveTab('services')} style={{ cursor: 'pointer', marginBottom: '6px', transition: '0.3s' }} onMouseEnter={(e) => { e.target.style.color = '#d4af37'; }} onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}>{currentText.services}</div>
                    <div onClick={() => setActiveTab('shipments')} style={{ cursor: 'pointer', marginBottom: '6px', transition: '0.3s' }} onMouseEnter={(e) => { e.target.style.color = '#d4af37'; }} onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}>{currentText.myShipments}</div>
                    <div onClick={() => setActiveTab('tracking')} style={{ cursor: 'pointer', marginBottom: '6px', transition: '0.3s' }} onMouseEnter={(e) => { e.target.style.color = '#d4af37'; }} onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; }}>{currentText.tracking}</div>
                </div>
                <div>
                    <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px' }}>{currentText.supportContact}</div>
                    <div style={{ marginBottom: '4px', color: '#cbd5e1' }}>support@maacargo.com</div>
                    <div style={{ marginBottom: '4px', color: '#cbd5e1' }}>+962 6 000 0000</div>
                    <div style={{ color: '#cbd5e1' }}>{lang === 'ar' ? 'عمان - دبي - إسطنبول' : 'Amman - Dubai - Istanbul'}</div>
                </div>
                <div>
                    <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px' }}>{currentText.systemStatus}</div>
                    <div style={{ color: '#10b981', marginBottom: '4px', fontWeight: 'bold' }}>{currentText.systemActive}</div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{currentText.rights}</div>
                </div>
            </footer>

        </div>
    );
}