import React, { useState, useEffect } from 'react';
import axios from 'axios';

// رابط السيرفر الديناميكي (يعتمد على ملف .env أو السيرفر المحلي للاختبار)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [userName, setUserName] = useState(() => {
        const savedName = localStorage.getItem('user_name');
        if (savedName && savedName !== 'undefined' && savedName !== 'null') return savedName;
        const savedEmail = localStorage.getItem('user_email');
        return savedEmail ? savedEmail.split('@')[0] : '';
    });
    
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'home');
    const [lang, setLang] = useState('ar');
    const [isAnimating, setIsAnimating] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const [shipperName, setShipperName] = useState('');
    const [destination, setDestination] = useState('');
    const [packagesCount, setPackagesCount] = useState(1);
    const [weight, setWeight] = useState('');
    const [cargoType, setCargoType] = useState('ملابس وأقمشة');
    const [packageType, setPackageType] = useState('صندوق');
    const [deliveryTerm, setDeliveryTerm] = useState('من الباب للباب (Door-to-Door)');
    
    const [consigneePhone, setConsigneePhone] = useState('');
    const [consigneeNationalId, setConsigneeNationalId] = useState('');
    const [consigneeAddress, setConsigneeAddress] = useState('');
    
    const [declaredValue, setDeclaredValue] = useState('');
    const [notes, setNotes] = useState('');
    
    const [trackQuery, setTrackQuery] = useState('');
    const [trackResult, setTrackResult] = useState(null);
    const [myShipments, setMyShipments] = useState([]);

    const [selectedShipmentForPayment, setSelectedShipmentForPayment] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [showApplePayModal, setShowApplePayModal] = useState(false);

    const t = {
        ar: {
            brand: "MAA-CARGO",
            console: "بوابة الشحن الجوي الدولي",
            home: "الرئيسية",
            dashboard: "شحناتي الجوية",
            newOrderTab: "حجز شحنة جوية",
            trackTab: "تتبع الطيران والرادار",
            logout: "تسجيل خروج",
            signIn: "تسجيل دخول",
            welcomeMsg: "ابتسامة طيران، أهلاً بك,",
            heroTitle: "الشبكة الذكية الأولى للشحن الجوي واللوجستيات",
            heroDesc: "إدارة متكاملة لبوليصات الشحن الجوي العابرة للقارات، تتبع لحظي لطائرات الشحن عبر نظام الـ GPS والـ Radar، واحتساب آلي للرسوم الجمركية بدقة مطلقة.",
            getStartedBtn: "حجز شحنة جوية الآن",
            trackNowBtn: "تتبع رحلة الشحنة بالرادار",
            servicesTitle: "خدمات الطيران والشحن الجوي",
            servicesSubtitle: "حلول نقل جوي سريعة وآمنة عبر أسطول طيران عالمي ومطارات محورية",
            featuresTitle: "لماذا تختار MAA-CARGO؟",
            feature1Title: "ممر جوي سريع",
            feature1Desc: "رحلات منتظمة ومباشرة لأكبر المطارات الدولية في العالم.",
            feature2Title: "مراقبة رادارية GPS",
            feature2Desc: "تتبع دقيق لخط سير الطرود والبضائع الحساسة عبر الخرائط الذكية.",
            feature3Title: "تخليص جمركي فوري",
            feature3Desc: "إنهاء الإجراءات القانونية والضريبية فور هبوط الطائرة.",
            servicesList: [
                {
                    title: "شحن من الباب للباب الجوي (Door-to-Door)",
                    desc: "نستلم شحنتك من مقر إقامتك ونسلمها مباشرة لعتبة المستلم في بلد المقصد مع التخليص الكامل.",
                    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "شحن جوي سريع الطوارئ (Express Cargo)",
                    desc: "الخيار الأسرع للوثائق الدبلوماسية، العينات الطبية، والقطع الصناعية الحرجة.",
                    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "شحن التجارة الإلكترونية العابرة",
                    desc: "ربط تقني متقدم للمتاجر الإلكترونية لتسيير الطلبات البريدية والجوية فورياً.",
                    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "سلسلة التبريد والأدوية الحيوية",
                    desc: "حاويات جوية مبردة ومخصصة لنقل اللقاحات والأدوية الحساسة للحرارة.",
                    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                }
            ],
            newOrderTitle: "إصدار بوليصة شحن جوي جديدة",
            shipperNameLabel: "اسم المُرسِل (الشركة / الشخص):",
            shipperNamePlaceholder: "أدخل اسم الشاحن",
            destinationLabel: "مطار الوصول ومحطة المقصد:",
            packagesCountLabel: "عدد الطرود:",
            weightLabel: "الوزن الإجمالي (KG):",
            cargoTypeLabel: "صنف البضاعة الجوية:",
            packageTypeLabel: "نوع التغليف:",
            deliveryTermLabel: "شروط التسليم الجوي (Incoterms):",
            consigneePhoneLabel: "هاتف المستلم في بلد الوصول:",
            consigneePhonePlaceholder: "+962...",
            consigneeNationalIdLabel: "الرقم الوطني / الهوية الضريبية للمستلم:",
            consigneeNationalIdPlaceholder: "مطلوبة للتخليص الجمركي الفوري",
            consigneeAddressLabel: "العنوان التفصيلي للمستلم:",
            consigneeAddressPlaceholder: "المدينة، الحي، الشارع، رقم المبنى",
            declaredValueLabel: "القيمة المعلنة للشحنة ($):",
            declaredValuePlaceholder: "القيمة بالدولار الأمريكي للتأمين",
            notesLabel: "تعليمات خاصة لطاقم الشحن:",
            notesPlaceholder: "ملاحظات تتعلق بالتعامل مع البضاعة...",
            submitOrderBtn: "اعتماد وحجز البوليصة الجوية",
            myShipmentsTitle: "سجل بوليصات الشحن الجوي الخاصة بك",
            trackingTitle: "محطة التتبع الراداري الفوري (GPS Air Tracking)",
            trackingPlaceholder: "أدخل رقم البوليصة (مثال: AIR-XXXXXX)",
            searchBtn: "بحث راداري",
            status: "حالة الرحلة:",
            weightHeader: "الوزن:",
            feesHeader: "رسوم الجمارك والشحن:",
            destinationHeader: "وجهة المطار:",
            refreshBtn: "تحديث بيانات الأسطول",
            payNowBtn: "سداد رسوم الشحنة 💳",
            paymentPageTitle: "بوابة السداد المالي الآمن للبوليصة",
            paymentForWaybill: "سداد مستحقات الشحنة رقم:",
            selectPaymentMethod: "اختر وسيلة الدفع المعتمدة:",
            cardNumberLabel: "رقم البطاقة الائتمانية",
            cardHolderLabel: "اسم حامل البطاقة",
            cardExpiryLabel: "تاريخ الانتهاء (MM/YY)",
            cardCvcLabel: "رمز الأمان (CVC)",
            paySubmitBtn: "تأكيد الدفع الإلكتروني الآمن",
            selectDestination: "اختر مطار وجهة الشحن الجوي",
            destinations: [
                { value: "الإمارات - (DXB) مطار دبي الدولي", label: "الإمارات - (DXB) مطار دبي الدولي" },
                { value: "الإمارات - (AUH) مطار أبوظبي الدولي", label: "الإمارات - (AUH) مطار أبوظبي الدولي" },
                { value: "قطر - (DOH) مطار حمد الدولي", label: "قطر - (DOH) مطار حمد الدولي" },
                { value: "السعودية - (RUH) مطار الملك خالد - الرياض", label: "السعودية - (RUH) مطار الملك خالد - الرياض" },
                { value: "السعودية - (JED) مطار الملك عبد العزيز - جدة", label: "السعودية - (JED) مطار الملك عبد العزيز - جدة" },
                { value: "أمريكا - (JFK) مطار جون إف كينيدي - نيويورك", label: "أمريكا - (JFK) مطار جون إف كينيدي - نيويورك" },
                { value: "أمريكا - (LAX) مطار لوس أنجلوس الدولي", label: "أمريكا - (LAX) مطار لوس أنجلوس الدولي" },
                { value: "بريطانيا - (LHR) مطار هيثرو - لندن", label: "بريطانيا - (LHR) مطار هيثرو - لندن" },
                { value: "ألمانيا - (FRA) مطار فرانكفورت", label: "ألمانيا - (FRA) مطار فرانكفورت" },
                { value: "تركيا - (IST) مطار إسطنبول", label: "تركيا - (IST) مطار إسطنبول" }
            ],
            footerDesc: "الريادة في قطاع الشحن الجوي والخدمات اللوجستية العابرة للقارات بأحدث تقنيات تتبع الرادار والتخليص الفوري.",
            quickLinks: "روابط سريعة",
            airHubs: "أبرز المحطات والمطارات",
            contactUs: "اتصل بعمليات الطيران",
            rights: "© 2026 MAA-CARGO. جميع الحقوق محفوظة."
        },
        en: {
            brand: "MAA-CARGO",
            console: "GLOBAL AIR FREIGHT PORTAL",
            home: "Home",
            dashboard: "My Air Shipments",
            newOrderTab: "Book Air Cargo",
            trackTab: "Flight GPS Radar",
            logout: "Logout",
            signIn: "Sign In",
            welcomeMsg: "Welcome aboard,",
            heroTitle: "The Premier Smart Network for International Air Freight",
            heroDesc: "End-to-end control of cross-border air waybills, real-time GPS aircraft cargo tracking, and precise automated customs calculations.",
            getStartedBtn: "Book Air Cargo Now",
            trackNowBtn: "Track Flight GPS",
            servicesTitle: "Aviation & Air Freight Services",
            servicesSubtitle: "Fast and secure air transport solutions across a global aircraft fleet and hub airports",
            featuresTitle: "Why Choose MAA-CARGO?",
            feature1Title: "Express Sky Corridor",
            feature1Desc: "Regular and direct flights to major international airports worldwide.",
            feature2Title: "GPS Radar Monitoring",
            feature2Desc: "Precise interactive mapping and flight route tracking for cargo safety.",
            feature3Title: "Instant Customs Clearance",
            feature3Desc: "Immediate resolution of legal and tax procedures upon aircraft touchdown.",
            servicesList: [
                {
                    title: "Door-to-Door Air Delivery",
                    desc: "We pick up your cargo from your location and deliver it directly to the recipient's doorstep with full clearance.",
                    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "Express Emergency Cargo",
                    desc: "The fastest option for diplomatic documents, medical samples, and critical industrial parts.",
                    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "Cross-Border E-Commerce Freight",
                    desc: "Advanced API integration for e-commerce stores to dispatch postal and air orders instantly.",
                    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80"
                },
                {
                    title: "Cold Chain & Vital Pharmaceuticals",
                    desc: "Refrigerated and specialized air containers for vaccines and temperature-sensitive drugs.",
                    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                }
            ],
            newOrderTitle: "Issue New Air Waybill",
            shipperNameLabel: "Shipper Name (Company / Person):",
            shipperNamePlaceholder: "Enter shipper name",
            destinationLabel: "Arrival Airport & Destination:",
            packagesCountLabel: "Packages Count:",
            weightLabel: "Total Gross Weight (KG):",
            cargoTypeLabel: "Air Cargo Commodity:",
            packageTypeLabel: "Package Type:",
            deliveryTermLabel: "Incoterms Delivery Terms:",
            consigneePhoneLabel: "Recipient Phone at Destination:",
            consigneePhonePlaceholder: "+962...",
            consigneeNationalIdLabel: "Recipient National ID / Tax ID:",
            consigneeNationalIdPlaceholder: "Required for instant customs clearance",
            consigneeAddressLabel: "Detailed Recipient Address:",
            consigneeAddressPlaceholder: "City, District, Street, Building No",
            declaredValueLabel: "Declared Cargo Value ($):",
            declaredValuePlaceholder: "Value in USD for insurance",
            notesLabel: "Special Handling Instructions:",
            notesPlaceholder: "Instructions regarding cargo handling...",
            submitOrderBtn: "Approve & Book Air Waybill",
            myShipmentsTitle: "Your Air Waybills Ledger",
            trackingTitle: "GPS Air Cargo Tracking Radar",
            trackingPlaceholder: "Enter Waybill No (e.g. AIR-XXXXXX)",
            searchBtn: "GPS Search",
            status: "Flight Status:",
            weightHeader: "Weight:",
            feesHeader: "Customs & Freight Fees:",
            destinationHeader: "Airport Destination:",
            refreshBtn: "Refresh Fleet Data",
            payNowBtn: "Pay Shipment Fees 💳",
            paymentPageTitle: "Secure Financial Payment Gateway",
            paymentForWaybill: "Payment dues for Waybill No:",
            selectPaymentMethod: "Select Approved Payment Method:",
            cardNumberLabel: "Credit Card Number",
            cardHolderLabel: "Cardholder Name",
            cardExpiryLabel: "Expiry Date (MM/YY)",
            cardCvcLabel: "Security Code (CVC)",
            paySubmitBtn: "Confirm Secure Electronic Payment",
            selectDestination: "Select Air Cargo Airport Destination",
            destinations: [
                { value: "UAE - Dubai International Airport (DXB)", label: "UAE - Dubai International Airport (DXB)" },
                { value: "UAE - Abu Dhabi International Airport (AUH)", label: "UAE - Abu Dhabi International Airport (AUH)" },
                { value: "Qatar - Hamad International Airport (DOH)", label: "Qatar - Hamad International Airport (DOH)" },
                { value: "Saudi Arabia - King Khalid International Airport, Riyadh (RUH)", label: "Saudi Arabia - King Khalid International Airport, Riyadh (RUH)" },
                { value: "Saudi Arabia - King Abdulaziz International Airport, Jeddah (JED)", label: "Saudi Arabia - King Abdulaziz International Airport, Jeddah (JED)" },
                { value: "USA - John F. Kennedy International Airport, New York (JFK)", label: "USA - John F. Kennedy International Airport, New York (JFK)" },
                { value: "USA - Los Angeles International Airport (LAX)", label: "USA - Los Angeles International Airport (LAX)" },
                { value: "UK - Heathrow Airport, London (LHR)", label: "UK - Heathrow Airport, London (LHR)" },
                { value: "Germany - Frankfurt Airport (FRA)", label: "Germany - Frankfurt Airport (FRA)" },
                { value: "Turkey - Istanbul Airport (IST)", label: "Turkey - Istanbul Airport (IST)" }
            ],
            footerDesc: "Leadership in cross-border air freight and logistics with cutting-edge GPS radar tracking and instant customs clearance.",
            quickLinks: "Quick Links",
            airHubs: "Major Airport Hubs",
            contactUs: "Operations Support",
            rights: "© 2026 MAA-CARGO. All rights reserved."
        }
    };

    const currentText = t[lang];

    const handleTabChange = (tab) => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveTab(tab);
            localStorage.setItem('activeTab', tab);
            window.scrollTo(0, 0);
            setIsAnimating(false);
        }, 250);
    };

    useEffect(() => {
        if (token) {
            fetchMyShipments();
        }
    }, [token]);

    const fetchMyShipments = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/shipments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyShipments(res.data);
        } catch (err) {
            console.error('Error fetching shipments', err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/login`, { email, password });
            const accessToken = res.data.access_token;
            const fetchedName = res.data.user_name || email.split('@')[0];

            setToken(accessToken);
            setUserName(fetchedName);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_name', fetchedName);
            localStorage.setItem('is_admin', '0');
            
            handleTabChange('dashboard');
        } catch (err) {
            alert(lang === 'ar' ? 'فشل تسجيل الدخول، تأكد من البيانات' : 'Login failed, check your credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/register`, { name, email, password });
            const accessToken = res.data.access_token;

            setToken(accessToken);
            setUserName(name);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_name', name);
            localStorage.setItem('is_admin', '0');
            
            handleTabChange('dashboard');
        } catch (err) {
            alert(lang === 'ar' ? 'فشل إنشاء الحساب، تأكد من البريد الإلكتروني' : 'Registration failed');
        }
    };

    const getFinalFees = (item) => {
        if (item.customs_fees && parseFloat(item.customs_fees) > 0) {
            return parseFloat(item.customs_fees).toFixed(2);
        }

        let decVal = 150;
        if (item.description && item.description.includes('القيمة المعلنة:')) {
            const match = item.description.match(/القيمة المعلنة:\s*\$([0-9.]+)/);
            if (match && match[1]) {
                decVal = parseFloat(match[1]) || 150;
            }
        }

        let tariffRate = 0.10;
        if (item.description && (item.description.includes('أدوية') || item.description.includes('Medical'))) {
            tariffRate = 0.05;
        } else if (item.description && (item.description.includes('ملابس') || item.description.includes('Apparel'))) {
            tariffRate = 0.20;
        } else if (item.description && (item.description.includes('إلكترونيات') || item.description.includes('Electronics'))) {
            tariffRate = 0.25;
        }

        let customsDuty = decVal * tariffRate;
        if (customsDuty < 10) customsDuty = 10;

        const syndicateFees = 15.00;
        const handlingFees = 12.00;
        const salesTax = (decVal + customsDuty) * 0.16;
        const airFreightBase = (parseFloat(item.weight) || 5) * 4.5;

        return (customsDuty + syndicateFees + handlingFees + salesTax + airFreightBase).toFixed(2);
    };

    const calculateCustomsWithDelivery = (w, cargo, count, term, decVal) => {
        const parsedWeight = parseFloat(w) || 1;
        let tariffRate = 0.10;
        let baseVal = parseFloat(decVal) || (parsedWeight * 15);

        if (cargo.includes('أدوية') || cargo.includes('Medical')) {
            tariffRate = 0.05;
        } else if (cargo.includes('ملابس') || cargo.includes('Apparel')) {
            tariffRate = 0.20;
        } else if (cargo.includes('إلكترونيات') || cargo.includes('Electronics')) {
            tariffRate = 0.25;
        }

        let customsDuty = baseVal * tariffRate;
        if (customsDuty < 10) customsDuty = 10;

        const clearanceSyndicateFees = 15.00;
        const handlingFees = (parseInt(count) || 1) * 3.50;
        const salesTax = (baseVal + customsDuty) * 0.16;

        let deliveryTermCost = 0;
        if (term.includes('من الباب للباب')) deliveryTermCost = 45;
        else if (term.includes('شامل التخليص')) deliveryTermCost = 100;
        else if (term.includes('شحن سريع')) deliveryTermCost = 75;

        return (customsDuty + clearanceSyndicateFees + handlingFees + salesTax + deliveryTermCost).toFixed(2);
    };

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(value);
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const finalCustoms = calculateCustomsWithDelivery(weight, cargoType, packagesCount, deliveryTerm, declaredValue);
            const fullDescription = `المصدر: ${shipperName || 'غير محدد'} | الطرود: ${packagesCount} (${packageType}) | التسليم: ${deliveryTerm} | هاتف المستلم: ${consigneePhone} | الرقم الوطني: ${consigneeNationalId} | عنوان المستلم: ${consigneeAddress} | القيمة المعلنة: $${declaredValue || '0'} | ملاحظات: ${notes || 'لا يوجد'}`;

            await axios.post(`${API_URL}/api/shipments`, {
                destination: destination || currentText.destinations[0].value,
                weight: parseFloat(weight) || 1,
                description: fullDescription,
                customs_fees: parseFloat(finalCustoms)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(lang === 'ar' ? 'تم إنشاء بوليصة الشحن الجوي بنجاح!' : 'Air freight order created successfully!');
            setShipperName('');
            setWeight('');
            setConsigneePhone('');
            setConsigneeNationalId('');
            setConsigneeAddress('');
            setDeclaredValue('');
            setNotes('');
            fetchMyShipments();
            handleTabChange('dashboard');
        } catch (err) {
            alert(lang === 'ar' ? 'فشل إنشاء البوليصة' : 'Failed to create order');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/shipments/${selectedShipmentForPayment.id}`, {
                payment_status: 'Paid',
                payment_method: paymentMethod
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(lang === 'ar' ? 'تم إتمام السداد بنجاح! طائرتنا جاهزة للإقلاع بشحنتك.' : 'Payment completed successfully!');
            setSelectedShipmentForPayment(null);
            fetchMyShipments();
            handleTabChange('dashboard');
        } catch (err) {
            alert(lang === 'ar' ? 'فشل إتمام الدفع، حاول مرة أخرى' : 'Payment failed, please try again');
        }
    };

    const handleApplePayComplete = async () => {
        try {
            await axios.put(`${API_URL}/api/shipments/${selectedShipmentForPayment.id}`, {
                payment_status: 'Paid',
                payment_method: 'Apple Pay'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowApplePayModal(false);
            alert(lang === 'ar' ? 'تم الدفع بنجاح عبر Apple Pay!' : 'Apple Pay payment successful!');
            setSelectedShipmentForPayment(null);
            fetchMyShipments();
            handleTabChange('dashboard');
        } catch (err) {
            alert(lang === 'ar' ? 'فشل إتمام الدفع عبر Apple Pay' : 'Apple Pay payment failed');
        }
    };

    const handleTrackSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${API_URL}/api/shipments/track/${trackQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrackResult(res.data);
        } catch (err) {
            alert(lang === 'ar' ? 'لم يتم العثور على البوليصة برادار الطيران' : 'Shipment not found');
            setTrackResult(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setToken('');
        setUserName('');
        handleTabChange('home');
    };

    const getStatusColor = (status) => {
        if (!status) return '#38bdf8';
        if (status.includes('Delivered') || status.includes('التوصيل')) return '#10b981';
        if (status.includes('Pending') || status.includes('المعالجة')) return '#fbbf24';
        if (status.includes('Transit') || status.includes('الشحن')) return '#38bdf8';
        return '#38bdf8';
    };

    const parseDescription = (desc) => {
        if (!desc) return {};
        const parts = desc.split('|').map(p => p.trim());
        const data = {};
        parts.forEach(part => {
            const [key, ...valParts] = part.split(':');
            if (key && valParts.length > 0) {
                data[key.trim()] = valParts.join(':').trim();
            }
        });
        return data;
    };

    const bgStyle = {
        minHeight: '100vh',
        backgroundColor: '#040b16',
        backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(14, 39, 77, 0.4) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 50px 50px, 50px 50px',
        color: '#f8fafc',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left',
        perspective: '1200px',
        overflowX: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    };

    const transitionWrapperStyle = {
        transform: isAnimating ? 'translateZ(-120px) rotateX(10deg) scale(0.97)' : 'translateZ(0px) rotateX(0deg) scale(1)',
        opacity: isAnimating ? 0 : 1,
        transition: 'transform 0.35s cubic-bezier(0.15, 0.85, 0.35, 1), opacity 0.3s ease',
        transformStyle: 'preserve-3d',
        position: 'relative',
        zIndex: 2,
        flex: 1
    };

    const card3DStyle = {
        backgroundColor: 'rgba(11, 20, 38, 0.92)',
        backdropFilter: 'blur(16px)',
        color: '#f8fafc',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.7), 0 0 25px rgba(56,189,248,0.15)',
        width: '440px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        transform: 'translateZ(30px)',
        transition: 'transform 0.4s ease'
    };

    return (
        <div style={bgStyle}>
            {/* شريط التنقل الجوي العلوي */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '18px 50px', 
                borderBottom: '1px solid rgba(56, 189, 248, 0.2)', 
                flexDirection: lang === 'ar' ? 'row-reverse' : 'row', 
                flexWrap: 'wrap', 
                gap: '15px', 
                backgroundColor: 'rgba(4, 11, 22, 0.95)', 
                backdropFilter: 'blur(15px)', 
                position: 'sticky', 
                top: 0, 
                zIndex: 1000 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }} onClick={() => handleTabChange('home')}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        background: 'linear-gradient(135deg, #38bdf8, #0284c7, #d4af37)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#040b16', 
                        fontWeight: 'bold', 
                        fontSize: '22px', 
                        borderRadius: '10px', 
                        boxShadow: '0 4px 15px rgba(56,189,248,0.4)' 
                    }}>✈</div>
                    <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <div style={{ fontWeight: '800', letterSpacing: '2px', fontSize: '20px', color: '#f8fafc' }}>{currentText.brand}</div>
                        <div style={{ fontSize: '10px', color: '#38bdf8', letterSpacing: '3px', fontWeight: '600' }}>AIR CARGO & FLIGHTS</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '14px', fontWeight: '600', flexDirection: lang === 'ar' ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                    <span onClick={() => handleTabChange('home')} style={{ cursor: 'pointer', color: activeTab === 'home' ? '#38bdf8' : '#94a3b8', transition: 'color 0.2s' }}>{currentText.home}</span>
                    
                    {token && (
                        <>
                            <span onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer', color: activeTab === 'dashboard' ? '#38bdf8' : '#94a3b8', transition: 'color 0.2s' }}>{currentText.dashboard}</span>
                            <span onClick={() => handleTabChange('newOrder')} style={{ cursor: 'pointer', color: activeTab === 'newOrder' ? '#38bdf8' : '#94a3b8', transition: 'color 0.2s' }}>{currentText.newOrderTab}</span>
                            <span onClick={() => handleTabChange('track')} style={{ cursor: 'pointer', color: activeTab === 'track' ? '#38bdf8' : '#94a3b8', transition: 'color 0.2s' }}>{currentText.trackTab}</span>
                        </>
                    )}
                    
                    {token ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', direction: 'ltr' }}>
                            <div style={{ background: 'rgba(14, 39, 77, 0.6)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', display: 'flex', gap: '6px', alignItems: 'center', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                                <span style={{ color: '#94a3b8' }}>{currentText.welcomeMsg}</span>
                                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{userName}</span>
                            </div>
                            <button onClick={handleLogout} style={{ padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>{currentText.logout}</button>
                        </div>
                    ) : (
                        <button onClick={() => handleTabChange('login')} style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>{currentText.signIn}</button>
                    )}
                    
                    <button 
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} 
                        style={{ padding: '6px 14px', background: 'transparent', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', borderRadius: '6px' }}>
                        {lang === 'ar' ? 'EN' : 'عربي'}
                    </button>
                </div>
            </nav>

            <div style={{ padding: '40px 50px', ...transitionWrapperStyle }}>
                
                {activeTab === 'home' && (
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Hero Section بتصميم الكبسولة وصورة الطائرة الصافية بدون نصوص داخلها */}
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px 20px 80px 20px', 
                            background: 'linear-gradient(180deg, rgba(14, 39, 77, 0.5) 0%, rgba(4, 11, 22, 0.3) 100%)', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(56, 189, 248, 0.2)', 
                            marginBottom: '70px',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#38bdf8', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase' }}>✦ GLOBAL GPS AVIATION NETWORK ✦</div>
                            <h1 style={{ fontSize: '44px', color: '#fff', marginBottom: '20px', lineHeight: '1.2', fontWeight: '800' }}>{currentText.heroTitle}</h1>
                            <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.7' }}>{currentText.heroDesc}</p>
                            
                            {/* عنصر الكبسولة وصورة الطائرة بدون كتابة داخلها */}
                            <div style={{ 
                                width: '100%', 
                                maxWidth: '950px', 
                                height: '280px', 
                                margin: '0 auto 40px auto', 
                                background: 'linear-gradient(135deg, rgba(14, 39, 77, 0.85) 0%, rgba(56, 189, 248, 0.25) 100%)', 
                                borderRadius: '150px', 
                                border: '1px solid rgba(56, 189, 248, 0.4)', 
                                position: 'relative', 
                                overflow: 'hidden',
                                boxShadow: 'inset 0 0 30px rgba(56, 189, 248, 0.2), 0 15px 35px rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* صورة الطائرة الواضحة بالكامل */}
                                <img 
                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=85" 
                                    alt="Airplane in Sky" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover', 
                                        position: 'relative', 
                                        zIndex: 2, 
                                        filter: 'contrast(1.05) brightness(0.95)'
                                    }} 
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button onClick={() => handleTabChange(token ? 'newOrder' : 'login')} style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 8px 25px rgba(56,189,248,0.4)', transition: 'transform 0.2s' }}>
                                    {currentText.getStartedBtn} ✈
                                </button>
                                {token && (
                                    <button onClick={() => handleTabChange('track')} style={{ padding: '16px 36px', background: 'rgba(11, 20, 38, 0.8)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(56,189,248,0.3)', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderRadius: '8px' }}>
                                        {currentText.trackNowBtn} 🛰️
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '70px' }}>
                            <div style={{ background: 'rgba(11, 20, 38, 0.85)', backdropFilter: 'blur(12px)', padding: '35px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', borderTop: '4px solid #38bdf8' }}>
                                <div style={{ fontSize: '32px', marginBottom: '15px' }}>🛫</div>
                                <h3 style={{ color: '#38bdf8', marginBottom: '12px', fontSize: '20px', fontWeight: '700' }}>{currentText.feature1Title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7' }}>{currentText.feature1Desc}</p>
                            </div>
                            <div style={{ background: 'rgba(11, 20, 38, 0.85)', backdropFilter: 'blur(12px)', padding: '35px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', borderTop: '4px solid #d4af37' }}>
                                <div style={{ fontSize: '32px', marginBottom: '15px' }}>📡</div>
                                <h3 style={{ color: '#d4af37', marginBottom: '12px', fontSize: '20px', fontWeight: '700' }}>{currentText.feature2Title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7' }}>{currentText.feature2Desc}</p>
                            </div>
                            <div style={{ background: 'rgba(11, 20, 38, 0.85)', backdropFilter: 'blur(12px)', padding: '35px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', borderTop: '4px solid #10b981' }}>
                                <div style={{ fontSize: '32px', marginBottom: '15px' }}>🛃</div>
                                <h3 style={{ color: '#10b981', marginBottom: '12px', fontSize: '20px', fontWeight: '700' }}>{currentText.feature3Title}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7' }}>{currentText.feature3Desc}</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '36px', color: '#fff', marginBottom: '12px', fontWeight: '800' }}>{currentText.servicesTitle}</h2>
                            <p style={{ color: '#94a3b8', fontSize: '16px' }}>{currentText.servicesSubtitle}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', paddingBottom: '60px' }}>
                            {currentText.servicesList.map((srv, idx) => (
                                <div key={idx} style={{ background: 'rgba(11, 20, 38, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(56,189,248,0.2)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transition: 'transform 0.3s' }}>
                                    <div style={{ height: '180px', overflow: 'hidden' }}>
                                        <img src={srv.image} alt={srv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                        <div>
                                            <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '12px', fontWeight: '700' }}>{srv.title}</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px' }}>{srv.desc}</p>
                                        </div>
                                        <button onClick={() => handleTabChange(token ? 'newOrder' : 'login')} style={{ padding: '11px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', fontSize: '13px' }}>
                                            {currentText.getStartedBtn}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'login' && !token && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <div style={card3DStyle}>
                            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#f8fafc', fontWeight: '800' }}>{isRegistering ? 'إنشاء حساب جديد في أسطولنا' : currentText.signIn}</h2>
                            {isRegistering ? (
                                <form onSubmit={handleRegister} style={{ display: 'grid', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', color: '#94a3b8' }}>الاسم الكامل</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', boxSizing: 'border-box', borderRadius: '6px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', color: '#94a3b8' }}>البريد الإلكتروني</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', boxSizing: 'border-box', borderRadius: '6px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', color: '#94a3b8' }}>كلمة المرور</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', boxSizing: 'border-box', borderRadius: '6px' }} />
                                    </div>
                                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>تسجيل</button>
                                </form>
                            ) : (
                                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', color: '#94a3b8' }}>البريد الإلكتروني</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', boxSizing: 'border-box', borderRadius: '6px' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px', color: '#94a3b8' }}>كلمة المرور</label>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', boxSizing: 'border-box', borderRadius: '6px' }} />
                                    </div>
                                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>دخول</button>
                                </form>
                            )}
                            <p onClick={() => setIsRegistering(!isRegistering)} style={{ textAlign: 'center', marginTop: '20px', color: '#38bdf8', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                                {isRegistering ? 'لديك حساب بالفعل؟ سجل دخولك' : 'مستخدم جديد؟ أنشئ حساب'}
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'newOrder' && token && (
                    <div style={{ maxWidth: '750px', margin: '0 auto', background: 'rgba(11, 20, 38, 0.9)', backdropFilter: 'blur(15px)', padding: '40px', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
                        <h2 style={{ color: '#38bdf8', textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>{currentText.newOrderTitle} ✈</h2>
                        <form onSubmit={handleCreateOrder} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.shipperNameLabel}</label>
                                <input 
                                    type="text" 
                                    value={shipperName} 
                                    onChange={(e) => setShipperName(e.target.value)} 
                                    placeholder={currentText.shipperNamePlaceholder} 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.destinationLabel}</label>
                                <select 
                                    value={destination} 
                                    onChange={(e) => setDestination(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }}>
                                    <option value="">{currentText.selectDestination}</option>
                                    {currentText.destinations.map((dest, idx) => (
                                        <option key={idx} value={dest.value}>{dest.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.packagesCountLabel}</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={packagesCount} 
                                        onChange={(e) => setPackagesCount(e.target.value)} 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.weightLabel}</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        min="0.1" 
                                        value={weight} 
                                        onChange={(e) => setWeight(e.target.value)} 
                                        placeholder="0.0" 
                                        required 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.cargoTypeLabel}</label>
                                    <select 
                                        value={cargoType} 
                                        onChange={(e) => setCargoType(e.target.value)} 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }}>
                                        <option value="ملابس وأقمشة">ملابس وأقمشة (جمارك 20%)</option>
                                        <option value="إلكترونيات وأجهزة">إلكترونيات وأجهزة (جمارك 25%)</option>
                                        <option value="أدوية ومستلزمات طبية">أدوية ومستلزمات طبية (جمارك 5%)</option>
                                        <option value="بضائع عامة">بضائع عامة (جمارك 10%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.packageTypeLabel}</label>
                                    <select 
                                        value={packageType} 
                                        onChange={(e) => setPackageType(e.target.value)} 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }}>
                                        <option value="صندوق">صندوق (Box)</option>
                                        <option value="حقيبة">حقيبة (Bag)</option>
                                        <option value="طرد خشبي">طرد خشبي (Wooden Pallet)</option>
                                        <option value="ظرف مستندات">ظرف مستندات (Document Envelope)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.consigneePhoneLabel}</label>
                                    <input 
                                        type="text" 
                                        value={consigneePhone} 
                                        onChange={(e) => setConsigneePhone(e.target.value)} 
                                        placeholder={currentText.consigneePhonePlaceholder} 
                                        required 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.declaredValueLabel}</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="1" 
                                        value={declaredValue} 
                                        onChange={(e) => setDeclaredValue(e.target.value)} 
                                        placeholder={currentText.declaredValuePlaceholder} 
                                        required 
                                        style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.consigneeNationalIdLabel}</label>
                                <input 
                                    type="text" 
                                    value={consigneeNationalId} 
                                    onChange={(e) => setConsigneeNationalId(e.target.value)} 
                                    placeholder={currentText.consigneeNationalIdPlaceholder} 
                                    required 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.consigneeAddressLabel}</label>
                                <input 
                                    type="text" 
                                    value={consigneeAddress} 
                                    onChange={(e) => setConsigneeAddress(e.target.value)} 
                                    placeholder={currentText.consigneeAddressPlaceholder} 
                                    required 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#38bdf8', fontWeight: 'bold' }}>{currentText.deliveryTermLabel}</label>
                                <select 
                                    value={deliveryTerm} 
                                    onChange={(e) => setDeliveryTerm(e.target.value)} 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid #38bdf8', color: '#fff', borderRadius: '6px' }}>
                                    <option value="من الباب للباب (Door-to-Door)">من الباب للباب (Door-to-Door)</option>
                                    <option value="على باب المصنع (Ex Works / Factory Gate)">على باب المصنع (Ex Works / Factory Gate)</option>
                                    <option value="تسليم المطار (Airport-to-Airport)">تسليم المطار (Airport-to-Airport)</option>
                                    <option value="شحن جوي سريع مبرمج (Express Air Cargo)">شحن جوي سريع مبرمج (Express Air Cargo)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.notesLabel}</label>
                                <textarea 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)} 
                                    placeholder={currentText.notesPlaceholder} 
                                    rows="3" 
                                    style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                ></textarea>
                            </div>

                            <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', borderRadius: '6px', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>
                                {currentText.submitOrderBtn}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'dashboard' && token && !selectedShipmentForPayment && (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ color: '#38bdf8', margin: 0, fontWeight: '800' }}>{currentText.myShipmentsTitle} ({myShipments.length})</h2>
                            <button onClick={fetchMyShipments} style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px' }}>
                                🔄 {currentText.refreshBtn}
                            </button>
                        </div>
                        {myShipments.length === 0 ? <p style={{ color: '#888' }}>لا توجد شحنات جوية مسجلة حالياً.</p> : (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {myShipments.map((item) => {
                                    const details = parseDescription(item.description);
                                    const calculatedFees = getFinalFees(item);
                                    const isPaid = item.payment_status === 'Paid';
                                    return (
                                        <div key={item.id} style={{ background: 'rgba(11, 20, 38, 0.9)', backdropFilter: 'blur(12px)', padding: '25px', border: '1px solid rgba(56,189,248,0.2)', borderRight: `4px solid ${getStatusColor(item.status)}`, borderRadius: '10px', boxShadow: '0 15px 30px rgba(0,0,0,0.4)' }}>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(56,189,248,0.15)', flexWrap: 'wrap', gap: '10px' }}>
                                                <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '16px', letterSpacing: '1.5px' }}>WAYBILL: {item.tracking_number}</span>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <span style={{ padding: '4px 14px', background: getStatusColor(item.status), color: '#040b16', fontWeight: 'bold', fontSize: '13px', borderRadius: '6px' }}>
                                                        {item.status}
                                                    </span>
                                                    {!isPaid ? (
                                                        <button 
                                                            onClick={() => setSelectedShipmentForPayment(item)}
                                                            style={{ padding: '6px 16px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                                                            {currentText.payNowBtn}
                                                        </button>
                                                    ) : (
                                                        <span style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid #10b981', fontWeight: 'bold', fontSize: '12px', borderRadius: '6px' }}>
                                                            مدفوعة 🟢
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px', background: '#040b16', padding: '15px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.15)' }}>
                                                <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>{currentText.destinationHeader}</span> <strong style={{ color: '#fff', display: 'block', marginTop: '3px' }}>{item.destination}</strong></div>
                                                <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>{currentText.weightHeader}</span> <strong style={{ color: '#fff', display: 'block', marginTop: '3px' }}>{item.weight} KG</strong></div>
                                                <div><span style={{ color: '#94a3b8', fontSize: '12px' }}>{currentText.feesHeader}</span> <strong style={{ color: '#38bdf8', display: 'block', marginTop: '3px' }}>${calculatedFees}</strong></div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13px' }}>
                                                {Object.entries(details).map(([key, val], idx) => (
                                                    <div key={idx} style={{ background: 'rgba(14, 39, 77, 0.4)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.15)' }}>
                                                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', marginBottom: '2px' }}>{key}</span>
                                                        <span style={{ color: '#f8fafc', fontWeight: '500' }}>{val}</span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'dashboard' && token && selectedShipmentForPayment && (
                    <div style={{ maxWidth: '650px', margin: '0 auto', background: 'rgba(11, 20, 38, 0.95)', backdropFilter: 'blur(15px)', padding: '35px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.7)', position: 'relative' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '15px' }}>
                            <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px', fontWeight: '800' }}>{currentText.paymentPageTitle}</h2>
                            <button onClick={() => setSelectedShipmentForPayment(null)} style={{ background: 'transparent', color: '#aaa', border: '1px solid #334155', padding: '5px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px' }}>✕ إلغاء</button>
                        </div>

                        <div style={{ background: '#040b16', padding: '22px', borderRadius: '8px', border: '1px solid #38bdf8', marginBottom: '25px', textAlign: 'center' }}>
                            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>{currentText.paymentForWaybill}</div>
                            <div style={{ fontSize: '22px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '15px' }}>{selectedShipmentForPayment.tracking_number}</div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(56,189,248,0.15)', paddingTop: '15px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{currentText.destinationHeader}</div>
                                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{selectedShipmentForPayment.destination}</div>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>إجمالي الرسوم المستحقة</div>
                                    <div style={{ fontSize: '22px', color: '#10b981', fontWeight: 'bold' }}>${getFinalFees(selectedShipmentForPayment)}</div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>{currentText.selectPaymentMethod}</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    <button type="button" onClick={() => setPaymentMethod('credit_card')} style={{ padding: '12px', background: paymentMethod === 'credit_card' ? '#38bdf8' : '#040b16', color: paymentMethod === 'credit_card' ? '#040b16' : '#fff', border: '1px solid rgba(56,189,248,0.3)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', fontSize: '13px' }}>بطاقة ائتمان</button>
                                    <button type="button" onClick={() => setPaymentMethod('apple_pay')} style={{ padding: '12px', background: paymentMethod === 'apple_pay' ? '#38bdf8' : '#040b16', color: paymentMethod === 'apple_pay' ? '#040b16' : '#fff', border: '1px solid rgba(56,189,248,0.3)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', fontSize: '13px' }}>Apple Pay</button>
                                    <button type="button" onClick={() => setPaymentMethod('bank_transfer')} style={{ padding: '12px', background: paymentMethod === 'bank_transfer' ? '#38bdf8' : '#040b16', color: paymentMethod === 'bank_transfer' ? '#040b16' : '#fff', border: '1px solid rgba(56,189,248,0.3)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '6px', fontSize: '13px' }}>تحويل بنكي</button>
                                </div>
                            </div>

                            {paymentMethod === 'credit_card' && (
                                <>
                                    <div style={{ width: '100%', maxWidth: '360px', height: '210px', margin: '10px auto 20px auto', perspective: '1000px' }}>
                                        <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)', transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                            
                                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #0e274d 0%, #040b16 50%, #0284c7 100%)', borderRadius: '16px', padding: '24px', boxSizing: 'border-box', border: '1px solid rgba(56,189,248,0.4)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ width: '45px', height: '34px', background: 'linear-gradient(135deg, #38bdf8, #fef08a)', borderRadius: '6px' }}></div>
                                                    <div style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '2px', color: '#38bdf8' }}>MAA-PAY</div>
                                                </div>
                                                <div style={{ fontSize: '18px', letterSpacing: '3px', fontFamily: 'monospace', fontWeight: 'bold', color: cardNumber ? '#fff' : '#64748b' }}>
                                                    {cardNumber || '•••• •••• •••• ••••'}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                                                    <div>
                                                        <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>Card Holder</div>
                                                        <div style={{ fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {cardHolder || 'FULL NAME'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>Expires</div>
                                                        <div style={{ fontWeight: '500', fontFamily: 'monospace' }}>{cardExpiry || 'MM/YY'}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #040b16 0%, #0e274d 100%)', borderRadius: '16px', padding: '24px 0', boxSizing: 'border-box', border: '1px solid rgba(56,189,248,0.4)', color: '#fff', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div style={{ width: '100%', height: '40px', background: '#000', marginTop: '10px' }}></div>
                                                <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ flex: 1, height: '35px', background: '#cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '15px', color: '#000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '16px', letterSpacing: '2px' }}>
                                                        {cardCvc || '•••'}
                                                    </div>
                                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>CVC</span>
                                                </div>
                                                <div style={{ padding: '0 24px', fontSize: '9px', color: '#64748b', textAlign: 'center' }}>Authorized signature - Secure Air Pay</div>
                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.cardNumberLabel}</label>
                                        <input 
                                            type="text" 
                                            placeholder="0000 0000 0000 0000" 
                                            value={cardNumber} 
                                            onChange={handleCardNumberChange} 
                                            onFocus={() => setIsCardFlipped(false)}
                                            maxLength="19"
                                            required 
                                            style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.cardHolderLabel}</label>
                                        <input 
                                            type="text" 
                                            placeholder="Full Name on Card" 
                                            value={cardHolder} 
                                            onChange={(e) => setCardHolder(e.target.value)} 
                                            onFocus={() => setIsCardFlipped(false)}
                                            required 
                                            style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.cardExpiryLabel}</label>
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                maxLength="5" 
                                                value={cardExpiry} 
                                                onChange={(e) => setCardExpiry(e.target.value)} 
                                                onFocus={() => setIsCardFlipped(false)}
                                                required 
                                                style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#94a3b8', fontWeight: '600' }}>{currentText.cardCvcLabel}</label>
                                            <input 
                                                type="password" 
                                                placeholder="CVC" 
                                                maxLength="4" 
                                                value={cardCvc} 
                                                onChange={(e) => setCardCvc(e.target.value)} 
                                                onFocus={() => setIsCardFlipped(true)}
                                                onBlur={() => setIsCardFlipped(false)}
                                                required 
                                                style={{ width: '100%', padding: '12px', background: '#040b16', border: '1px solid rgba(56,189,248,0.3)', color: '#fff', borderRadius: '6px' }} 
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {paymentMethod === 'apple_pay' && (
                                <div style={{ textAlign: 'center', padding: '30px', background: '#040b16', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)' }}>
                                    <div style={{ marginBottom: '15px', color: '#94a3b8', fontSize: '13px' }}>انقر أدناه لإتمام الدفع السريع باستخدام Apple Pay</div>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowApplePayModal(true)}
                                        style={{
                                            width: '100%',
                                            maxWidth: '280px',
                                            height: '45px',
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            fontSize: '20px',
                                            fontWeight: '500',
                                            margin: '0 auto',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                                        }}>
                                        <span>Pay</span> <span style={{ fontWeight: '600' }}>Pay</span>
                                    </button>
                                </div>
                            )}

                            {paymentMethod === 'bank_transfer' && (
                                <div style={{ background: '#040b16', padding: '20px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)', fontSize: '13px', color: '#aaa', lineHeight: '1.8', textAlign: 'center' }}>
                                    <strong style={{ color: '#38bdf8', fontSize: '14px', display: 'block', marginBottom: '8px' }}>معلومات الحساب البنكي للتحويل:</strong>
                                    اسم البنك: بنك دبي الإسلامي / الشحن الجوي<br />
                                    رقم الحساب (IBAN): <span style={{ color: '#fff', letterSpacing: '1px' }}>AE070330000001234567890</span><br />
                                    <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '6px', color: '#10b981' }}>
                                        يرجى إرسال إيصال التحويل عبر واتساب العمليات الجوية:<br />
                                        <a 
                                            href={`https://wa.me/962790000000?text=${encodeURIComponent(`مرحباً، إيصال تحويل الشحنة رقم: ${selectedShipmentForPayment.tracking_number} بمبلغ $${getFinalFees(selectedShipmentForPayment)}`)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ color: '#34d399', fontWeight: 'bold', fontSize: '15px', display: 'inline-block', marginTop: '6px', textDecoration: 'underline' }}>
                                            💬 962790000000+ (اضغط للإرسال)
                                        </a>
                                    </div>
                                </div>
                            )}

                            {paymentMethod !== 'bank_transfer' && paymentMethod !== 'apple_pay' && (
                                <button type="submit" style={{ padding: '15px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', marginTop: '10px', boxShadow: '0 4px 15px rgba(16,185,129,0.4)' }}>
                                    {currentText.paySubmitBtn} (${getFinalFees(selectedShipmentForPayment)})
                                </button>
                            )}
                        </form>

                        {showApplePayModal && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(4, 11, 22, 0.9)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 9999,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '100%',
                                    backgroundColor: '#0b1426',
                                    borderTopLeftRadius: '20px',
                                    borderTopRightRadius: '20px',
                                    padding: '25px',
                                    color: '#fff',
                                    borderTop: '1px solid rgba(56,189,248,0.4)',
                                    boxShadow: '0 -15px 40px rgba(0,0,0,0.8)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '12px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Pay</div>
                                        <button onClick={() => setShowApplePayModal(false)} style={{ background: '#1e293b', border: 'none', color: '#aaa', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
                                    </div>
                                    <div style={{ background: '#040b16', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(56,189,248,0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                                            <span>MAA-CARGO (Air Freight)</span>
                                            <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>${getFinalFees(selectedShipmentForPayment)}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={handleApplePayComplete}
                                            style={{
                                                width: '100%',
                                                padding: '14px',
                                                backgroundColor: '#10b981',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(16,185,129,0.4)'
                                            }}>
                                            إتمام الدفع (${getFinalFees(selectedShipmentForPayment)})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'track' && token && (
                    <div style={{ maxWidth: '850px', margin: '0 auto', background: 'rgba(11, 20, 38, 0.95)', backdropFilter: 'blur(15px)', padding: '40px', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '14px', boxShadow: '0 25px 50px rgba(0,0,0,0.7)' }}>
                        <h2 style={{ color: '#38bdf8', marginBottom: '10px', fontWeight: '800', textAlign: 'center' }}>{currentText.trackingTitle} 🛰️</h2>
                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginBottom: '30px' }}>نظام تتبع إحداثيات خط السير الراداري وحالة الطائرة الجوية اللحظية</p>
                        
                        <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '10px', marginBottom: '35px' }}>
                            <input 
                                type="text" 
                                placeholder={currentText.trackingPlaceholder} 
                                value={trackQuery} 
                                onChange={(e) => setTrackQuery(e.target.value)} 
                                required 
                                style={{ flex: 1, padding: '14px', background: '#040b16', border: '1px solid rgba(56,189,248,0.4)', color: '#fff', borderRadius: '8px', fontSize: '15px' }} 
                            />
                            <button type="submit" style={{ padding: '14px 30px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#040b16', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', fontSize: '15px', boxShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>
                                {currentText.searchBtn}
                            </button>
                        </form>

                        {trackResult && (
                            <div style={{ background: '#040b16', padding: '30px', border: '1px solid #38bdf8', borderRadius: '12px', boxShadow: '0 10px 30px rgba(56,189,248,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56,189,248,0.2)', paddingBottom: '15px', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Waybill Code</div>
                                        <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>{trackResult.tracking_number}</div>
                                    </div>
                                    <div>
                                        <span style={{ padding: '6px 16px', background: getStatusColor(trackResult.status), color: '#040b16', fontWeight: 'bold', fontSize: '14px', borderRadius: '6px' }}>
                                            {trackResult.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ margin: '30px 0 35px 0', padding: '20px', background: 'rgba(14, 39, 77, 0.4)', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)' }}>
                                    <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>🗺️ رادار مسار الطيران والوجهة الميدانية (GPS Track)</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
                                        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '3px', background: '#334155', zIndex: 1, transform: 'translateY(-50%)' }}></div>
                                        
                                        <div style={{ textAlign: 'center', zIndex: 2 }}>
                                            <div style={{ width: '36px', height: '36px', background: '#10b981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: 'bold', boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}>✓</div>
                                            <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>مطار الإقلاع</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>المحطة الرئيسية</div>
                                        </div>

                                        <div style={{ textAlign: 'center', zIndex: 2 }}>
                                            <div style={{ width: '42px', height: '42px', background: '#38bdf8', color: '#040b16', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontSize: '20px', boxShadow: '0 0 20px rgba(56,189,248,0.8)', animation: 'pulse 2s infinite' }}>✈</div>
                                            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>في الأجواء (GPS)</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>مراقبة الرادار</div>
                                        </div>

                                        <div style={{ textAlign: 'center', zIndex: 2 }}>
                                            <div style={{ width: '36px', height: '36px', background: trackResult.status.includes('Delivered') ? '#10b981' : '#334155', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: 'bold' }}>📍</div>
                                            <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>مطار الوصول</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>{trackResult.destination}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', background: 'rgba(14,39,77,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(56,189,248,0.15)' }}>
                                    <div><span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>{currentText.destinationHeader}</span> <strong style={{ color: '#fff' }}>{trackResult.destination}</strong></div>
                                    <div><span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>{currentText.weightHeader}</span> <strong style={{ color: '#fff' }}>{trackResult.weight} KG</strong></div>
                                </div>

                                {(() => {
                                    const details = parseDescription(trackResult.description);
                                    return (
                                        <div>
                                            <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>📋 تفاصيل البوليصة والبيانات اللوجستية:</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13px' }}>
                                                {Object.entries(details).map(([key, val], idx) => (
                                                    <div key={idx} style={{ background: 'rgba(14, 39, 77, 0.4)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)' }}>
                                                        <span style={{ color: '#94a3b8', display: 'block', fontSize: '11px', marginBottom: '3px' }}>{key}</span>
                                                        <span style={{ color: '#f8fafc', fontWeight: '600' }}>{val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* الفوتر الاحترافي (Footer) */}
            <footer style={{
                backgroundColor: 'rgba(2, 6, 15, 0.98)',
                borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '50px 50px 20px 50px',
                marginTop: '60px',
                color: '#94a3b8',
                fontSize: '14px',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040b16', fontWeight: 'bold', fontSize: '18px', borderRadius: '8px' }}>✈</div>
                            <span style={{ fontWeight: '800', fontSize: '18px', color: '#fff', letterSpacing: '1px' }}>{currentText.brand}</span>
                        </div>
                        <p style={{ lineHeight: '1.7', fontSize: '13px', color: '#94a3b8' }}>
                            {currentText.footerDesc}
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>{currentText.quickLinks}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                            <li><span onClick={() => handleTabChange('home')} style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}>{currentText.home}</span></li>
                            {token && (
                                <>
                                    <li><span onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}>{currentText.dashboard}</span></li>
                                    <li><span onClick={() => handleTabChange('newOrder')} style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}>{currentText.newOrderTab}</span></li>
                                    <li><span onClick={() => handleTabChange('track')} style={{ cursor: 'pointer', color: '#cbd5e1', transition: 'color 0.2s' }}>{currentText.trackTab}</span></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>{currentText.airHubs}</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                            <li>🇦🇪 مطار دبي الدولي (DXB)</li>
                            <li>🇶🇦 مطار حمد الدولي (DOH)</li>
                            <li>🇸🇦 مطار الملك خالد - الرياض (RUH)</li>
                            <li>🇬🇧 مطار هيثرو - لندن (LHR)</li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>{currentText.contactUs}</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.7', marginBottom: '12px' }}>
                            الدعم الفني وعمليات الشحن متاحة على مدار الساعة 24/7.
                        </p>
                        <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px' }}>
                            📞 +962 79 000 0000
                        </div>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    borderTop: '1px solid rgba(56, 189, 248, 0.1)',
                    paddingTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    fontSize: '13px',
                    color: '#64748b'
                }}>
                    <div>{currentText.rights}</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Incoterms 2026</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}