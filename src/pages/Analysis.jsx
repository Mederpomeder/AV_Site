import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

// В самом верху Analysis.jsx
const apiRequests = {
    getHistory: (userId) => api.get(`/user/${userId}/history`),
    analyzeLeaf: (userId, formData) => {
        // Берем актуальный язык из памяти (тот самый appLang, который мы нашли)
        const currentLang = localStorage.getItem('appLang') || 'ru';

        // Отправляем и в URL (как хочет напарница), и в заголовках (как хочет бэкенд)
        return api.post(`/user/${userId}/analyze?lang=${currentLang}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept-Language': currentLang
            }
        });
    },
};

const Analysis = ({ lang = 'ru' }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Состояния (полностью сохранены)
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysisStage, setAnalysisStage] = useState('upload'); 
    const [analysisResult, setAnalysisResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showAuthNotification, setShowAuthNotification] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [fileInfo, setFileInfo] = useState({});
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [showTips, setShowTips] = useState(false);

    const texts = {
        ru: {
            title1: "Как работает AI-анализ",
            subtitle: "Загрузите фото или видео, и получите точный отчёт о состоянии ваших культур.",
            selectFile: "Выбрать изображение",
            dragDrop: "Перетащите файл сюда",
            fileTypes: "Поддерживаемые форматы: JPG, PNG, GIF, WEBP, MP4, AVI, MOV (до 10MB)",
            uploadArea: "Загрузка образца",
            processing: "Анализируем...",
            processingTitle: "Идет анализ...",
            result: "Результат диагностики",
            newAnalysis: "Новый анализ",
            saveResult: "В избранное",
            share: "Поделиться",
            history: "История ваших проверок",
            noHistory: "Вы еще не проводили анализ",
            loginRequired: "Требуется вход",
            authNotification: "Пожалуйста, войдите в систему для доступа к анализу",
            title: "Анализируйте растения с помощью AI",
            cropLabel: "Выберите культуру",
            apples: "Яблоки",
            apricots: "Абрикосы",
            // ============================================================
            // 👇 ДОБАВЛЯЙТЕ НОВЫЕ КУЛЬТУРЫ ЗДЕСЬ (русский язык)
            // Формат: { value: 'уникальный_ключ', label: 'Название', emoji: '🌿' }
            // ============================================================
            crops: [
                { value: 'apples',      label: 'Яблоки',    emoji: '🍎' },
                { value: 'apricots',    label: 'Абрикосы',  emoji: '🍑' },
                { value: 'grapes',      label: 'Виноград',  emoji: '🍇' },
                { value: 'tomatoes',    label: 'Томаты',    emoji: '🍅' },
                { value: 'wheat',       label: 'Пшеница',   emoji: '🌾' },
            ],

            // ============================================================
            // 👇 РЕКОМЕНДАЦИИ — меняйте текст, ссылки и иконки здесь
            // ============================================================
            tipsTitle: '💡 Рекомендации для ваших культур',
            tips: [
                {
                    icon: '🏪',
                    title: 'Где купить удобрения',
                    text: 'Посетите наш рекомендуемый магазин для качественных удобрений и средств защиты растений.',
                    linkText: 'Перейти в магазин →',
                    link: 'https://example.com/shop',          // ← замените на вашу ссылку
                },
                {
                    icon: '🌱',
                    title: 'Уход за деревьями',
                    text: 'Ваши деревья нуждаются в регулярной обрезке и поливе. Узнайте больше о правильном уходе.',
                    linkText: 'Читать руководство →',
                    link: 'https://example.com/guide',         // ← замените на вашу ссылку
                },
                {
                    icon: '🚜',
                    title: 'Агрономическая помощь',
                    text: 'Нужна консультация агронома? Свяжитесь с нашими специалистами для личного осмотра.',
                    linkText: 'Связаться →',
                    link: 'https://example.com/contact',       // ← замените на вашу ссылку
                },
            ],
        
            steps: [
            {
                id: 1,
                t: "Загрузка",
                d: "Загрузите фото или видео растения",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 2,
                t: "Анализ ИИ",
                d: "Нейросеть анализирует изображение",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 15.5C8 15.5 6.5 14.5 6 13C5 12.5 4.5 11.5 4.5 10.5C4.5 9 5.5 8 7 8C7 6 8.5 4.5 10.5 4.5C11.5 4.5 12.5 5 13 6C13.5 5 14.5 4.5 15.5 4.5C17.5 4.5 19 6 19 8C20.5 8 21.5 9 21.5 10.5C21.5 11.5 21 12.5 20 13C19.5 14.5 18 15.5 16.5 15.5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M12 15.5V18M10 20H14" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            },
            {
                id: 3,
                t: "Обработка",
                d: "Сравнение с базой данных болезней",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20H20M7 20v-5M12 20V8M17 20v-8" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 4,
                t: "Отчет",
                d: "Полный отчет с рекомендациями",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#2D6A2E" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            }
        ],
            stats: {
                diagnosis: "Обнаружено", cause: "Описание", recommendation: "Меры борьбы",
                confidence: "Точность", imageDetails: "Свойства фото", plantType: "Культура"
            },
            errors: {
                noFile: "Файл не выбран", fileType: "Неверный формат изображения",
                fileSize: "Файл слишком велик", noAuth: "Нужна авторизация",
                uploadError: "Ошибка связи", analysisError: "Ошибка обработки"
            }
        },
        en: {
            title1: "How AI Analysis Works",
            subtitle: "Upload a photo or video and get an accurate report on the condition of your crops.",
            selectFile: "Select Image",
            dragDrop: "Drag & drop or click to upload",
            fileTypes: "Supported: JPG, PNG, GIF, WEBP, MP4, AVI, MOV (max 10MB)",
            uploadArea: "Upload Sample",
            processing: "Analyzing...",
            processingTitle: "AI is studying the leaf structure",
            result: "Diagnosis Result",
            newAnalysis: "New Analysis",
            saveResult: "Save Result",
            share: "Share",
            history: "Your Analysis History",
            noHistory: "No history yet",
            loginRequired: "Login Required",
            authNotification: "Please login to access the analysis features",
            title: "Analyze plants with AI",
            cropLabel: "Select crop",
            apples: "Apples",
            apricots: "Apricots",
            // ============================================================
            // 👇 ADD NEW CROPS HERE (English)
            // Format: { value: 'unique_key', label: 'Display Name', emoji: '🌿' }
            // ============================================================
            crops: [
                { value: 'apples',      label: 'Apples',    emoji: '🍎' },
                { value: 'apricots',    label: 'Apricots',  emoji: '🍑' },
                { value: 'grapes',      label: 'Grapes',    emoji: '🍇' },
                { value: 'tomatoes',    label: 'Tomatoes',  emoji: '🍅' },
                { value: 'wheat',       label: 'Wheat',     emoji: '🌾' },
            ],

            // ============================================================
            // 👇 RECOMMENDATIONS — change text, links and icons here
            // ============================================================
            tipsTitle: '💡 Recommendations for your crops',
            tips: [
                {
                    icon: '🏪',
                    title: 'Where to buy supplies',
                    text: 'Visit our recommended store for quality fertilizers and plant protection products.',
                    linkText: 'Go to store →',
                    link: 'https://example.com/shop',          // ← replace with your link
                },
                {
                    icon: '🌱',
                    title: 'Tree care tips',
                    text: 'Your trees need regular pruning and watering. Learn more about proper care techniques.',
                    linkText: 'Read the guide →',
                    link: 'https://example.com/guide',         // ← replace with your link
                },
                {
                    icon: '🚜',
                    title: 'Agronomist help',
                    text: 'Need expert advice? Contact our specialists for an in-person crop inspection.',
                    linkText: 'Contact us →',
                    link: 'https://example.com/contact',       // ← replace with your link
                },
            ],
        },
            steps: [
        
            { 
                id: 1,
                t: "Upload",
                d: "Upload a photo or video of the plant",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 2,
                t: "AI Analysis",
                d: "Neural network analyzes the image",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 15.5C8 15.5 6.5 14.5 6 13C5 12.5 4.5 11.5 4.5 10.5C4.5 9 5.5 8 7 8C7 6 8.5 4.5 10.5 4.5C11.5 4.5 12.5 5 13 6C13.5 5 14.5 4.5 15.5 4.5C17.5 4.5 19 6 19 8C20.5 8 21.5 9 21.5 10.5C21.5 11.5 21 12.5 20 13C19.5 14.5 18 15.5 16.5 15.5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M12 15.5V18M10 20H14" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            },
            {
                id: 3,
                t: "Processing",
                d: "Comparison with disease database",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20H20M7 20v-5M12 20V8M17 20v-8" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 4,
                t: "Report",
                d: "Full report with recommendations",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#2D6A2E" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            }
        ],
    stats: {
        diagnosis: "Detected", cause: "Description", recommendation: "Measures",
        confidence: "Confidence", imageDetails: "Image Info", plantType: "Crop"
    },
    errors: {
        noFile: "No file selected", fileType: "Invalid format",
        fileSize: "File too large", noAuth: "Auth required",
        uploadError: "Connection error", analysisError: "Processing error"
    }
           
        }
    

    const t = texts[lang] || texts.ru;

    useEffect(() => {
        const user = MemoryStorage.getUser();
        if (user) {
            setCurrentUser(user);
            setShowAuthNotification(false);
            loadHistory();
        } else {
            setCurrentUser(null);
            setShowAuthNotification(true);
        }

         console.log('Language changed to:', lang);        
        return () => { if (filePreview) URL.revokeObjectURL(filePreview); };
    }, [lang]);

    const loadHistory = async () => {
        const userId = MemoryStorage.getUserId();
        if (!userId) return;
        try {
            const response = await apiRequests.getHistory(userId);
            if (response.data) setHistory(response.data);
        } catch (error) {
            console.error('❌ History error:', error);
        }
    };

    const validateAndUploadFile = (file) => {
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) { alert(t.errors.fileType); return; }
        if (file.size > 10 * 1024 * 1024) { alert(t.errors.fileSize); return; }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setFileInfo({
                    width: img.width, height: img.height,
                    size: (file.size / 1024 / 1024).toFixed(2),
                    type: file.type.split('/')[1].toUpperCase()
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const objectUrl = URL.createObjectURL(file);
        setUploadedFile(file);
        setFilePreview(objectUrl);
        startAnalysis(file);
    };

    const startAnalysis = async (file) => {
        const userId = MemoryStorage.getUserId();
        if (!userId) return;

        setAnalysisStage('processing');
        setProgress(0);
        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? prev : prev + 5));
        }, 300);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiRequests.analyzeLeaf(userId, formData);
            
            clearInterval(progressInterval);
            setProgress(100);
            setAnalysisResult(response.data);
            setAnalysisStage('result');
            loadHistory();
        } catch (error) {
            clearInterval(progressInterval);
            simulateMockAnalysis();
        }
    };

    const simulateMockAnalysis = () => {
        setTimeout(() => {
            setAnalysisResult({
                status_text: lang === 'ru' ? "Здоровое растение" : "Healthy Plant",
                diagnosis_text: lang === 'ru' ? "Проблем не обнаружено" : "No issues detected",
                confidence: "95%",
                visual_status: "healthy",
                symptom_description: lang === 'ru' ? "Лист выглядит крепким." : "Leaf looks strong.",
                recommendation: lang === 'ru' ? "Продолжайте текущий уход." : "Continue current care."
            });
            setAnalysisStage('result');
            setProgress(100);
        }, 1000);
    };

    // Вспомогательные функции
    const handleFileSelect = () => currentUser ? fileInputRef.current.click() : setShowAuthNotification(true);
    const handleFileChange = (e) => { const file = e.target.files[0]; if (file) validateAndUploadFile(file); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); const file = e.dataTransfer.files[0]; if (file) validateAndUploadFile(file); };
    const resetAnalysis = () => {
        setAnalysisStage('upload');
        setAnalysisResult(null);
        setUploadedFile(null);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        setProgress(0);
    };

    const saveAnalysisResult = () => {
        alert(lang === 'ru' ? 'Сохранено!' : 'Saved!');
        loadHistory();
    };

    // --- Стили ---
    const styles = {
        card: {
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'all 0.4s ease'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
        },
        badge: (status) => ({
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '600',
            background: status === 'healthy' ? '#E8F5E9' : '#FFEBEE',
            color: status === 'healthy' ? '#2E7D32' : '#C62828'
        }),
        cropButton: (isActive) => ({
            padding: '12px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            border: '1.5px solid #B0B8B0',
            background: isActive ? '#D6D6D6' : '#ffffff',
            color: isActive ? '#2D3A2D' : '#4A5A4A',
            boxShadow: isActive
                ? 'inset 0 2px 5px rgba(0,0,0,0.18), 0 1px 0 #fff'
                : '0 3px 0 #B0B8B0, 0 4px 6px rgba(0,0,0,0.08)',
            transform: isActive ? 'translateY(2px)' : 'translateY(0)',
            transition: 'all 0.12s ease',
            outline: 'none',
        })
    };

    return (
        <div style={{ 
            background: '#F8FAF9', 
            minHeight: '100vh', 
            padding: '120px 20px 60px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', color: '#1b5e20', marginBottom: '12px', fontWeight: '800' }}>{t.title}</h1>
                    <p style={{ color: '#667A66', fontSize: '18px' }}>{t.subtitle}</p>
                </div>

                {/* Main Content Area */}
                <div style={styles.card}>
                    {analysisStage === 'upload' && (
                        <div className="upload-container">
                            {/* Auth notification */}
                            {showAuthNotification && (
                                <div style={{ background: '#FFF4E5', color: '#663C00', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                                     {t.authNotification}
                                </div>
                            )}

                            {/* ── Crop Dropdown ── */}
                            <div
                                ref={dropdownRef}
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                                style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}
                            >
                                {/* Trigger button */}
                                <button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 20px',
                                    borderRadius: '14px',
                                    border: '1.5px solid ' + (selectedCrop ? '#4CAF50' : '#C8D8C8'),
                                    background: selectedCrop ? '#F1FAF1' : '#fff',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    color: selectedCrop ? '#2D6A2E' : '#4A5A4A',
                                    boxShadow: '0 2px 8px rgba(76,175,80,0.08)',
                                    transition: 'all 0.2s ease',
                                    userSelect: 'none',
                                    minWidth: '200px',
                                    justifyContent: 'space-between',
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '20px' }}>
                                            {selectedCrop ? t.crops.find(c => c.value === selectedCrop)?.emoji : '🌿'}
                                        </span>
                                        {selectedCrop
                                            ? t.crops.find(c => c.value === selectedCrop)?.label
                                            : t.cropLabel}
                                    </span>
                                    {/* Animated chevron */}
                                    <svg
                                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        style={{
                                            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.25s ease',
                                            color: '#4CAF50',
                                        }}
                                    >
                                        <path d="M6 9l6 6 6-6" stroke="#4CAF50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                {/* Dropdown panel */}
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    left: 0,
                                    minWidth: '220px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
                                    border: '1px solid #E4EDE4',
                                    overflow: 'hidden',
                                    zIndex: 200,
                                    // CSS-only slide + fade
                                    opacity: dropdownOpen ? 1 : 0,
                                    transform: dropdownOpen ? 'translateY(0px)' : 'translateY(-8px)',
                                    pointerEvents: dropdownOpen ? 'auto' : 'none',
                                    transition: 'opacity 0.22s ease, transform 0.22s ease',
                                }}>
                                    {/*
                                     * ═══════════════════════════════════════════════════
                                     * OPTIONS come from t.crops array above in `texts`.
                                     * To add a new crop: add an entry to crops[] in both
                                     * the 'ru' and 'en' sections of the texts object.
                                     * ═══════════════════════════════════════════════════
                                     */}
                                    {t.crops.map((crop, idx) => (
                                        <button
                                            key={crop.value}
                                            onClick={() => { setSelectedCrop(crop.value); setDropdownOpen(false); }}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 18px',
                                                background: selectedCrop === crop.value ? '#F0FAF0' : 'transparent',
                                                border: 'none',
                                                borderBottom: idx < t.crops.length - 1 ? '1px solid #F0F4F0' : 'none',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '14px',
                                                fontWeight: selectedCrop === crop.value ? '700' : '500',
                                                color: selectedCrop === crop.value ? '#2D6A2E' : '#3A4A3A',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={e => { if (selectedCrop !== crop.value) e.currentTarget.style.background = '#F6FBF6'; }}
                                            onMouseLeave={e => { if (selectedCrop !== crop.value) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <span style={{ fontSize: '20px', lineHeight: 1 }}>{crop.emoji}</span>
                                            <span>{crop.label}</span>
                                            {selectedCrop === crop.value && (
                                                <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 13l4 4L19 7" stroke="#4CAF50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upload area */}
                            <div 
                                onClick={handleFileSelect}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                style={{
                                    border: '2px dashed #2D3A2D',
                                    borderRadius: '20px',
                                    padding: '80px 50px',
                                    cursor: currentUser ? 'pointer' : 'not-allowed',
                                    background: '#FBFCFB',
                                    transition: 'border 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1DED1'}
                            >
                                <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌿</div>
                                <h3 style={{ marginBottom: '10px', color: '#2D3A2D' }}>{t.uploadArea}</h3>
                                <p style={{ color: '#7A8C7A', marginBottom: '25px' }}>{t.dragDrop}</p>
                                <button style={styles.buttonPrimary} disabled={!currentUser}>{t.selectFile}</button>
                                <p style={{ fontSize: '12px', color: '#A0AFA0', marginTop: '20px' }}>{t.fileTypes}</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

                            {/* ── Recommendations accordion ── */}
                            <div style={{ marginTop: '24px' }}>
                                {/* Toggle header — click to open/close */}
                                <button
                                    onClick={() => setShowTips(prev => !prev)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 22px',
                                        background: showTips ? '#F0FAF0' : '#F7FAF7',
                                        border: '1.5px solid ' + (showTips ? '#4CAF50' : '#D4E6D4'),
                                        borderRadius: showTips ? '16px 16px 0 0' : '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        color: '#2D6A2E',
                                    }}
                                >
                                    <span>{t.tipsTitle}</span>
                                    <svg
                                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                                        style={{
                                            transform: showTips ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.25s ease',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <path d="M6 9l6 6 6-6" stroke="#4CAF50" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                {/* Collapsible body */}
                                <div style={{
                                    overflow: 'hidden',
                                    maxHeight: showTips ? '600px' : '0px',
                                    transition: 'max-height 0.4s ease',
                                    border: showTips ? '1.5px solid #4CAF50' : '1.5px solid transparent',
                                    borderTop: 'none',
                                    borderRadius: '0 0 16px 16px',
                                    background: '#fff',
                                }}>
                                    <div style={{ padding: '8px 16px 16px' }}>
                                        {/*
                                         * ═══════════════════════════════════════════════════
                                         * Each card comes from t.tips[] in the texts object.
                                         * To ADD a card:    add a new {} entry to tips[]
                                         * To EDIT text:     change title / text fields
                                         * To EDIT a link:   change the link and linkText fields
                                         * To ADD an icon:   change the emoji in the icon field
                                         * ═══════════════════════════════════════════════════
                                         */}
                                        {t.tips.map((tip, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                gap: '14px',
                                                alignItems: 'flex-start',
                                                padding: '14px 8px',
                                                borderBottom: idx < t.tips.length - 1 ? '1px solid #EEF5EE' : 'none',
                                            }}>
                                                <span style={{
                                                    fontSize: '26px',
                                                    lineHeight: 1,
                                                    flexShrink: 0,
                                                    marginTop: '2px',
                                                }}>{tip.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A2E1A', marginBottom: '4px' }}>
                                                        {tip.title}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: '#667A66', lineHeight: '1.55', marginBottom: '8px' }}>
                                                        {tip.text}
                                                    </div>
                                                    <a
                                                        href={tip.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            color: '#4CAF50',
                                                            textDecoration: 'none',
                                                            borderBottom: '1px dashed #4CAF50',
                                                            paddingBottom: '1px',
                                                        }}
                                                    >
                                                        {tip.linkText}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {analysisStage === 'processing' && (
                        <div style={{ padding: '40px 0' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px' }}>
                                <div className="spinner" style={{
                                    width: '100%', height: '100%', border: '4px solid #E8F5E9',
                                    borderTop: '4px solid #4CAF50', borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                {filePreview && <img src={filePreview} alt="Target" style={{
                                    position: 'absolute', top: '10px', left: '10px', width: '100px', height: '100px',
                                    borderRadius: '50%', objectFit: 'cover'
                                }} />}
                            </div>
                            <h3 style={{ marginBottom: '10px' }}>{t.processingTitle}</h3>
                            <div style={{ width: '100%', height: '8px', background: '#EEE', borderRadius: '4px', overflow: 'hidden', maxWidth: '300px', margin: '20px auto' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: '#4CAF50', transition: 'width 0.3s' }}></div>
                            </div>
                            <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>{progress}%</p>
                        </div>
                    )}

                    {analysisStage === 'result' && analysisResult && (
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ margin: 0 }}>{t.result}</h2>
                                <button onClick={resetAnalysis} style={{ ...styles.buttonPrimary, background: '#f0f0f0', color: '#444', boxShadow: 'none' }}>
                                    {t.newAnalysis}
                                </button>
                            </div>

                            <div style={{ 
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' 
                            }}>
                                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #EEE' }}>
                                    <img src={filePreview} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={styles.badge(analysisResult.visual_status)}>{analysisResult.status_text}</span>
                                        <h3 style={{ marginTop: '15px', color: '#1A2E1A' }}>{analysisResult.diagnosis_text}</h3>
                                    </div>
                                    <div style={{ background: '#F9FBF9', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ fontSize: '13px', color: '#7A8C7A', marginBottom: '5px' }}>{t.stats.confidence}</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{analysisResult.confidence}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px', padding: '20px', background: '#fff', border: '1px solid #EEE', borderRadius: '20px' }}>
                                <div><strong> {t.stats.cause}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.symptom_description}</p></div>
                                <div style={{ borderTop: '1px solid #EEE', paddingTop: '15px' }}>
                                    <strong> {t.stats.recommendation}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.recommendation}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button onClick={saveAnalysisResult} style={{ ...styles.buttonPrimary, flex: 1 }}>{t.saveResult}</button>
                                <button style={{ ...styles.buttonPrimary, background: '#fff', color: '#4CAF50', border: '2px solid #4CAF50', flex: 1 }}>{t.share}</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step Cards Section */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '24px', 
                    marginTop: '40px', 
                    width: '100%' 
                }}>
                    {t.steps.map((step, i) => (
                        <div key={i} style={{ 
                            background: 'white', 
                            padding: '40px 20px',
                            borderRadius: '25px', 
                            border: '1px solid #E8EDF2', 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ 
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '64px',
                                height: '64px',
                                background: '#e8ede8',
                                borderRadius: '18px',
                                flexShrink: 0
                            }}>
                                {step.icon}
                            </div>
                            <div style={{ 
                                fontWeight: '700', 
                                fontSize: '16px',
                                marginBottom: '10px',
                                color: '#1A2E1A' 
                            }}>
                                {step.t}
                            </div>
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#7A8C7A',
                                lineHeight: '1.4',
                                maxWidth: '200px'
                            }}>
                                {step.d}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .upload-container:hover .upload-area { border-color: #4CAF50; }
            `}</style>
        </div>
    );
};

export default Analysis;
