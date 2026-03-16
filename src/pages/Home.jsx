// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MemoryStorage } from '../api/axios';

const Home = ({ lang }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showLibraryModal, setShowLibraryModal] = useState(false);
    const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        area: '',
        address: '',
        culture: '',
        date: '',
        phone: '',
        description: ''
    });
    const [activeSlide, setActiveSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false); 
    const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' }); 

    const texts = {
        ru: {
            hero: {
                title: "AgriVision — умное сельское хозяйство",
                subtitle: "Дроны и искусственный интеллект для мониторинга полей, выявления болезней и роста урожайности",
                btnRequest: "Отправить заявку",
                btnAnalysis: "Проанализировать растения"
            },
            future: {
                title: "Мы создаем будущее сельского хозяйства",
                description: "AgriVision помогает аграриям использовать современные технологии для повышения эффективности. Оптимизация ресурсов и защиты урожая.",
                btn: "Начать анализ",
                badge: "Работаем для фермеров сегодня"
            },
            capabilities: {
            title: "НАШИ ВОЗМОЖНОСТИ",
            subtitle: "Наши технологии помогают экономить ресурсы, беречь природу и увеличивать урожай без лишних трат.",
            items: [
                {
                    title: "Анализ состояния растений с воздуха",
                    desc: "Мониторинг полей с помощью дронов для раннего выявления проблем с растениями и почвой."
                },
                {
                    title: "Прогноз урожайности",
                    desc: "Точное прогнозирование урожая на основе анализа данных и метеорологических условий."
                },
                {
                    title: "Все данные в одном месте",
                    desc: "Централизованная платформа для управления всеми сельскохозяйственными процессами."
                },
                {
                    title: "Снижение использования химикатов",
                    desc: "Точечное применение средств защиты растений, минимизирующее воздействие на окружающую среду."
                }
            ]
            },
            howItWorks: {
                title: "Как работает AgriVision",
                description: "AgriVision использует дроны и искусственный интеллект для анализа полей, выявления проблем и помощи фермерам в принятии решений.",
                features: ["Точный мониторинг полей", "Анализ данных в реальном времени"],
                btn: "Попробовать анализ",
                steps: [
                    { title: "Сбор данных", desc: "Дроны собирают информацию о состоянии полей" },
                    { title: "Анализ ИИ", desc: "Искусственный интеллект обрабатывает данные" },
                    { title: "Рекомендации", desc: "Фермер получает точные рекомендации" },
                    { title: "Результат", desc: "Увеличение урожайности и снижение затрат" }
                ]
            },
            solutions: {
                title: "AgriVision — умные решения для фермеров",
                description: "Мы объединяем дроны, аналитику и ИИ, чтобы вы получали точные данные о своих полях и принимали решения вовремя.",
                stats: "рост урожайности",
                card1: { title: "Аналитика в реальном времени", desc: "Мгновенный доступ к данным о состоянии ваших полей" },
                card2: { title: "Рекомендации для вас", desc: "Индивидуальные советы для каждого участка поля" }
            },
            technologies: {
                title: "Технологии, которые работают на ваш урожай",
                btnRequest: "Отправить заявку",
                btnTry: "Попробовать анализ"
            },
            whyChoose: {
            title: "Почему выбирают AgriVision",
            description: "Мы создаём технологии, которые помогают фермерам работать эффективнее, снижать потери и повышать урожайность.",
            btnMore: "Подробнее",
            reasons: [
                {
                    title: "Инновационные технологии",
                    desc: "Используем последние достижения в области дронов и ИИ"
                },
                {
                    title: "Простота использования",
                    desc: "Интуитивный интерфейс, не требующий специальных знаний"
                },
                {
                    title: "Поддержка 24/7",
                    desc: "Наша команда всегда готова помочь с любыми вопросами"
                },
                {
                    title: "Доказанная эффективность",
                    desc: "Результаты наших клиентов подтверждают эффективность"
                }
            ]
        },
            testimonials: {
            title: "Отзывы",
            subtitle: "Наши клиенты делятся своими успехами и впечатлениями от работы с AgriVision.",
            items: [
                {
                    name: "Иван Петров",
                    role: "Фермер, Краснодарский край",
                    text: "Благодаря AgriVision увеличил урожайность пшеницы на 25%. Система вовремя обнаружила болезнь растений, что спасло весь урожай."
                },
                {
                    name: "Мария Смирнова",
                    role: "Владелец виноградника, Крым",
                    text: "Анализ от AgriVision помог оптимизировать полив и сократить расход воды на 30%. Качество винограда значительно улучшилось."
                },
                {
                    name: "Алексей Козлов",
                    role: "Агроном, Ростовская область",
                    text: "Точные рекомендации по удобрениям позволили снизить затраты на 40%. Теперь работаем только с AgriVision."
                }
            ]
        },
            articles: {
            title: "Полезные статьи о сельском хозяйстве",
            subtitle: "Узнайте больше о болезнях растений, методах лечения и современных технологиях в сельском хозяйстве",
            noArticlesTitle: "Статей пока нет",
            noArticlesText: "Администратор еще не добавил статьи. Зайдите позже!"
        },
            footer: {
                about: "AgriVision — умное сельское хозяйство для каждого фермера",
                col1Title: "Страницы",
                col2Title: "О нас",
                copyright: "© 2024 AgriVision. Все права защищены.",
                links: { main: "Главная", about: "О нас", analysis: "Анализ", library: "Библиотека", reviews: "Отзывы", services: "Услуги", contacts: "Контакты", benefits: "Преимущества" }

        },
            modals: {
                development: {
                    title: "Раздел в разработке",
                    content: "Данный раздел находится в разработке. Мы работаем над его созданием!",
                    close: "Закрыть"
                },
                request: {
                    title: "Оставить заявку",
                    area: "Площадь участка (га)*",
                    address: "Адрес/Локация*",
                    culture: "Культура*",
                    date: "Дата*",
                    phone: "Телефон*",
                    description: "Описание проблемы",
                    submit: "Отправить заявку",
                    cancel: "Отмена"
                }
                
        },
            
           adminPortal: {
                sticky: "Админ",
                title: "Вход в админ-панель",
                email: "Email администратора",
                password: "Пароль",
                loginBtn: "Войти в админ-панель",
                cancel: "Отмена",
                demo: "Демо доступ"
        }
        },
        en: {
            hero: {
                title: "AgriVision — Smart Agriculture",
                subtitle: "Drones and AI for field monitoring, disease detection, and yield growth",
                btnRequest: "Submit Request",
                btnAnalysis: "Analyze Plants"
            },
            future: {
                title: "We Create the Future of Agriculture",
                description: "AgriVision helps farmers use modern technologies to increase efficiency. Resource optimization and crop protection.",
                btn: "Start Analysis",
                badge: "Working for farmers today"
            },
            capabilities: {
            title: "OUR CAPABILITIES",
            subtitle: "Our technologies help save resources, protect nature and increase yields without unnecessary spending.",
            items: [
                {
                    title: "Aerial Plant Health Analysis",
                    desc: "Field monitoring using drones for early detection of plant and soil issues."
                },
                {
                    title: "Yield Forecasting",
                    desc: "Accurate harvest forecasting based on data analysis and meteorological conditions."
                },
                {
                    title: "All Data in One Place",
                    desc: "A centralized platform for managing all agricultural processes."
                },
                {
                    title: "Reduced Chemical Usage",
                    desc: "Targeted application of plant protection products, minimizing environmental impact."
                }
            ]
        },
            howItWorks: {
                title: "How AgriVision Works",
                description: "AgriVision uses drones and AI to analyze fields, identify problems, and help farmers make decisions.",
                features: ["Accurate field monitoring", "Real-time data analysis"],
                btn: "Try Analysis",
                steps: [
                    { title: "Data Collection", desc: "Drones gather information about field conditions" },
                    { title: "AI Analysis", desc: "Artificial Intelligence processes the data" },
                    { title: "Recommendations", desc: "The farmer receives precise recommendations" },
                    { title: "Result", desc: "Increased yields and reduced costs" }
                ]
            },
            solutions: {
                title: "AgriVision — Smart Solutions",
                description: "We combine drones, analytics, and AI so you get accurate data and make decisions on time.",
                stats: "yield growth",
                card1: { title: "Real-time Analytics", desc: "Instant access to data about your fields' condition" },
                card2: { title: "Personalized Advice", desc: "Individual advice for each section of the field" }
            },
            technologies: {
            title: "Technologies that work for your harvest",
            btnRequest: "Send Request",
            btnTry: "Try Analysis"
            },
            whyChoose: {
            title: "Why Choose AgriVision",
            description: "We create technologies that help farmers work more efficiently, reduce losses, and increase yields.",
            btnMore: "Learn More",
            reasons: [
                {
                    title: "Innovative Technologies",
                    desc: "Using the latest achievements in drones and AI"
                },
                {
                    title: "Ease of Use",
                    desc: "Intuitive interface requiring no special knowledge"
                },
                {
                    title: "24/7 Support",
                    desc: "Our team is always ready to help with any questions"
                },
                {
                    title: "Proven Efficiency",
                    desc: "Our clients' results confirm our effectiveness"
                }
            ]
        },
            testimonials: {
            title: "Testimonials",
            subtitle: "Our clients share their success stories and impressions of working with AgriVision.",
            items: [
                {
                    name: "Ivan Petrov",
                    role: "Farmer, Krasnodar Region",
                    text: "Thanks to AgriVision, I increased wheat yield by 25%. The system detected plant disease in time, saving the entire crop."
                },
                {
                    name: "Maria Smirnova",
                    role: "Vineyard Owner, Crimea",
                    text: "AgriVision's analysis helped optimize irrigation and reduce water consumption by 30%. The grape quality has significantly improved."
                },
                {
                    name: "Alexey Kozlov",
                    role: "Agronomist, Rostov Region",
                    text: "Accurate fertilizer recommendations allowed us to reduce costs by 40%. Now we work only with AgriVision."
                }
            ]
        },
            articles: {
            title: "Useful Agricultural Articles",
            subtitle: "Learn more about plant diseases, treatment methods, and modern agricultural technologies",
            noArticlesTitle: "No articles yet",
            noArticlesText: "The administrator hasn't added any articles yet. Please check back later!"
        },
            footer: {
                about: "AgriVision — smart agriculture for every farmer",
                col1Title: "Pages",
                col2Title: "About Us",
                copyright: "© 2024 AgriVision. All rights reserved.",
                links: { main: "Home", about: "About Us", analysis: "Analysis", library: "Library", reviews: "Reviews", services: "Services", contacts: "Contacts", benefits: "Benefits" }
            },
            modals: {
                development: {
                    title: "Under Development",
                    content: "This section is under development. We are working on it!",
                    close: "Close"
                },
                request: {
                    title: "Submit Request",
                    area: "Plot area (ha)*",
                    address: "Address/Location*",
                    culture: "Crop*",
                    date: "Date*",
                    phone: "Phone*",
                    description: "Problem description",
                    submit: "Submit Request",
                    cancel: "Cancel"
                }
            },
            adminPortal: {
                sticky: "Admin",
                title: "Admin Panel Login",
                email: "Admin Email",
                password: "Password",
                loginBtn: "Login to Admin Panel",
                cancel: "Cancel",
                demo: "Demo Access"
            }
        }
    };

    const t = texts[lang] || texts.ru;

    useEffect(() => {
        const user = MemoryStorage.getUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex(prev => 
                prev < t.testimonials.items.length - 1 ? prev + 1 : 0
            );
        }, 5000);
        
        return () => clearInterval(interval);
    }, [t.testimonials.items.length]);

    const handleNavClick = (section, e) => {
        e?.preventDefault();
        
        switch(section) {
            case 'analysis':
                navigate('/analysis');
                break;
            case 'library':
                setShowLibraryModal(true);
                break;
            case 'request':
                setShowRequestModal(true);
                break;
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'about':
            if (window.location.pathname !== '/') {
                navigate('/#about');
            } else {
                const element = document.getElementById('about');
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }
            break;
            
            default:
                setShowDevelopmentModal(true);
        }
        
        setIsMenuOpen(false);
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            alert(lang === 'ru' ? 'Пожалуйста, войдите в систему' : 'Please login');
            return;
        }

        if (!requestForm.area || !requestForm.address || !requestForm.culture || !requestForm.date || !requestForm.phone) {
            alert(lang === 'ru' ? 'Заполните обязательные поля' : 'Fill required fields');
            return;
        }

        try {
            const userId = MemoryStorage.getUserId();
            const token = MemoryStorage.getToken();
            
            if (!userId || !token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`http://192.168.1.108:5000/api/user/${userId}/service-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: requestForm.phone,
                    location: requestForm.address,
                    plants_description: requestForm.description || `${requestForm.culture}, ${requestForm.area}га`
                })
            });

            if (response.ok) {
                alert(lang === 'ru' ? 'Заявка отправлена!' : 'Request submitted!');
                setShowRequestModal(false);
                setRequestForm({
                    area: '',
                    address: '',
                    culture: '',
                    date: '',
                    phone: '',
                    description: ''
                });
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(lang === 'ru' ? 'Ошибка отправки заявки' : 'Error submitting request');
        }
    };

    // 1. Hero
    const renderHero = () => (
        <section id="hero" style={{
            background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginTop: '0', 
            paddingTop: '40px', 
            textAlign: 'center',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                <div className="hero-content">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800', letterSpacing: '-1px' }}>
                        {t.hero.title}
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: '400' }}>
                        {t.hero.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setShowRequestModal(true)} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', border: 'none', backgroundColor: '#2e7d32' }}>
                            {t.hero.btnRequest}
                        </button>
                        <button onClick={() => navigate('/analysis')} className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid white' }}>
                            {t.hero.btnAnalysis}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );

    // 2. Future
    const renderFuture = () => (
        <section className="future-agriculture" id="about" style={{ padding: '80px 0' }}>
            <div className="container">
                <div className="future-content">
                    <div className="future-text">
                        <h2 className="text-primary">{t.future.title}</h2>
                        <p>{t.future.description}</p>
                        <button onClick={() => navigate('/analysis')} className="btn btn-primary">{t.future.btn}</button>
                    </div>
                    <div className="future-image">
                        {/* IMAGE 1 — grass field */}
                        <div className="image-placeholder" style={{
                            height: '350px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            padding: 0
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Green grass field"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                        <div className="for-farmers">
                            <h3>{t.future.badge}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // 3. Capabilities
    const renderCapabilities = () => {
    const icons = ["fa-wind", "fa-chart-line", "fa-database", "fa-leaf"];

    return (
        <section className="features" id="capabilities">
            <div className="container">
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {t.capabilities.title}
                    </h2>
                    <p style={{ maxWidth: '700px', margin: '15px auto 0', color: '#666' }}>
                        {t.capabilities.subtitle}
                    </p>
                </div>

                <div className="features-grid">
                    {t.capabilities.items.map((item, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">
                                <i className={`fas ${icons[index]}`}></i>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

    // 4. How it works
    const renderHowItWorks = () => (
    <section className="how-it-works" id="how">
        <div className="container">
            <div className="how-content">
                <div className="how-left">
                    <div className="how-image">
                        {/* IMAGE 2 — orchard/crop field, vertical rectangle */}
                        <div className="image-placeholder" style={{
                            height: '420px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            padding: 0
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1628220986016-f74b3e657497?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Green and brown crop field"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                    <div className="how-text">
                        <h3>{t.howItWorks.title}</h3>
                        <p>{t.howItWorks.description}</p>
                        
                        <div className="feature-list">
                            {t.howItWorks.features.map((feature, idx) => (
                                <div className="feature-item" key={idx}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => navigate('/analysis')} 
                            className="btn btn-accent"
                            style={{ marginTop: '20px' }}
                        >
                            {t.howItWorks.btn}
                        </button>
                    </div>
                </div>

                <div className="how-right">
                    {[ "fa-database", "fa-brain", "fa-clipboard-check", "fa-chart-bar" ].map((icon, idx) => (
                        <div className="step-item" key={idx}>
                            <i className={`fas ${icon}`}></i>
                            <div className="step-text">
                                <h4>{t.howItWorks.steps[idx].title}</h4>
                                <p>{t.howItWorks.steps[idx].desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

    // 5. Solutions
    const renderSolutions = () => (
        <section className="smart-solutions" id="solutions">
            <div className="container">
                <div className="solutions-content">
                    <div className="solutions-image">
                        {/* IMAGE 3 — drone close-up */}
                        <div className="image-placeholder" style={{
                            height: '450px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            padding: 0
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1740329820945-f0d4cc544ab8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Drone flying over field"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                    <div className="solutions-text">
                        <h2>{t.solutions.title}</h2>
                        <p>{t.solutions.description}</p>
                        <div className="growth-stats">
                            <div className="growth-number">+30%</div>
                            <div className="growth-text">{t.solutions.stats}</div>
                        </div>
                        <div className="solutions-cards">
                            <div className="solution-card">
                                <div className="card-icon"><i className="fas fa-chart-line"></i></div>
                                <h4>{t.solutions.card1.title}</h4>
                                <p>{t.solutions.card1.desc}</p>
                            </div>
                            <div className="solution-card">
                                <div className="card-icon"><i className="fas fa-user-cog"></i></div>
                                <h4>{t.solutions.card2.title}</h4>
                                <p>{t.solutions.card2.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // 6. Technologies
    const renderTechnologies = () => (
    <section className="technologies" id="tech">
        <div className="container">
            <h2 style={{ color: '#ffffff' }}>{t.technologies.title}</h2>
            
            <div className="tech-buttons">
                <button 
                    onClick={() => setShowRequestModal(true)}
                    className="btn btn-primary"
                    style={{ 
                        backgroundColor: '#2e7d32', 
                        color: '#ffffff', 
                        border: 'none' 
                    }}
                >
                    {t.technologies.btnRequest}
                </button>
                
                <button 
                    onClick={() => navigate('/analysis')}
                    className="btn btn-outline"
                    style={{ 
                        backgroundColor: 'transparent', 
                        color: '#ffffff', 
                        border: '2px solid #ffffff' 
                    }}
                >
                    {t.technologies.btnTry}
                </button>
            </div>
        </div>
    </section>
);

    // 7. Why choose
    const renderWhyChoose = () => {
        const reasonIcons = [
            "fa-lightbulb",
            "fa-mouse-pointer",
            "fa-headset",
            "fa-chart-bar"
        ];

        return (
            <section className="why-choose" id="why-choose">
                <div className="container">
                    <div className="why-content">
                        <div className="why-text">
                            <h2>{t.whyChoose.title}</h2>
                            <p>{t.whyChoose.description}</p>
                            <button 
                                className="btn btn-primary why-btn" 
                                onClick={() => setShowDevelopmentModal(true)}
                            >
                                {t.whyChoose.btnMore}
                                <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                            </button>
                        </div>

                        <div className="why-card">
                            {t.whyChoose.reasons.map((reason, idx) => (
                                <div className="reason-item" key={idx}>
                                    <div className="reason-icon">
                                        <i className={`fas ${reasonIcons[idx]}`}></i>
                                    </div>
                                    <div className="reason-text">
                                        <h4>{reason.title}</h4>
                                        <p>{reason.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // 8. Testimonials
    const renderTestimonials = () => {
    const [hoveredBtn, setHoveredBtn] = useState(null);
    
    const testimonialItems = t.testimonials.items;
    
    const nextSlide = () => setTestimonialIndex((prev) => (prev === testimonialItems.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setTestimonialIndex((prev) => (prev === 0 ? testimonialItems.length - 1 : prev - 1));

    return (
        <section id="testimonials" style={{ padding: '80px 0', background: '#f9f9f9' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '10px' }}>
                    {t.testimonials.title}
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '50px', color: '#666' }}>
                    {t.testimonials.subtitle}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                    
                    <button 
                        onClick={prevSlide}
                        onMouseEnter={() => setHoveredBtn('prev')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            background: 'white', border: 'none', width: '50px', height: '50px', borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.3s',
                            color: hoveredBtn === 'prev' ? '#4CAF50' : '#2e7d32', fontSize: '1.2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div style={{ overflow: 'hidden', width: '100%', maxWidth: '850px' }}>
                        <div style={{ 
                            display: 'flex', 
                            transition: 'transform 0.5s ease-in-out', 
                            transform: `translateX(-${testimonialIndex * 100}%)` 
                        }}>
                            {testimonialItems.map((item, index) => (
                                <div key={index} style={{ minWidth: '100%', boxSizing: 'border-box', padding: '10px' }}>
                                    <div style={{ 
                                        background: 'white', padding: '40px', borderRadius: '20px', 
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', 
                                        alignItems: 'center', gap: '30px' 
                                    }}>
                                        <div style={{ 
                                            width: '70px', height: '70px', backgroundColor: '#4CAF50', 
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', 
                                            justifyContent: 'center', color: 'white', fontSize: '1.5rem', flexShrink: 0 
                                        }}>
                                            <i className="fas fa-user"></i>
                                        </div>

                                        <div style={{ textAlign: 'left' }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#333' }}>{item.name}</h4>
                                            <div style={{ color: '#2e7d32', fontWeight: '600', marginBottom: '15px' }}>{item.role}</div>
                                            <p style={{ 
                                                fontStyle: 'italic', color: '#555', fontSize: '1.1rem', 
                                                lineHeight: '1.6', margin: 0 
                                            }}>
                                                "{item.text}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={nextSlide}
                        onMouseEnter={() => setHoveredBtn('next')}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                            background: 'white', border: 'none', width: '50px', height: '50px', borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.3s',
                            color: hoveredBtn === 'next' ? '#4CAF50' : '#2e7d32', fontSize: '1.2rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                    {testimonialItems.map((_, i) => (
                        <div key={i} onClick={() => setTestimonialIndex(i)} style={{
                            width: '12px', height: '12px', borderRadius: '50%', cursor: 'pointer',
                            background: i === testimonialIndex ? '#2e7d32' : '#ccc', transition: '0.3s'
                        }} />
                    ))}
                </div>
            </div>
        </section>
    );
};

    // 9. Articles
    const renderArticles = () => (
    <section className="articles-section" id="articles" style={{ padding: '80px 0' }}>
        <div className="container" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center' 
        }}>
            <div className="section-header" style={{ marginBottom: '40px' }}>
                <h2 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {t.articles.title}
                </h2>
                <p style={{ color: '#666', marginTop: '15px', maxWidth: '700px' }}>
                    {t.articles.subtitle}
                </p>
            </div>
            
            <div id="noArticlesMessage" style={{ padding: '40px 0' }}>
                <i className="fas fa-newspaper" style={{ 
                    fontSize: '48px', 
                    color: '#ddd', 
                    marginBottom: '20px',
                    display: 'block' 
                }}></i>
                <h3 style={{ color: '#666', fontSize: '1.5rem', marginBottom: '10px' }}>
                    {t.articles.noArticlesTitle}
                </h3>
                <p style={{ color: '#999' }}>
                    {t.articles.noArticlesText}
                </p>
            </div>
        </div>
    </section>
);

    const [hoveredLink, setHoveredLink] = useState(null);

const renderFooter = () => {
    const footerStyle = {
        padding: '60px 0',
        backgroundColor: '#2e7d32',
        color: 'white'
    };

    const linkStyle = (id) => ({
        color: hoveredLink === id ? '#fcc40b' : 'white',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-block'
    });

    const socialStyle = (id) => ({
        color: hoveredLink === id ? '#fcc40b' : 'white',
        fontSize: '1.5rem',
        transition: 'transform 0.3s, color 0.3s',
        display: 'inline-block',
        transform: hoveredLink === id ? 'translateY(-3px)' : 'none'
    });

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer" id="footer" style={footerStyle}>
            <div className="container">
                <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
                    
                    <div className="footer-left" style={{ flex: '1', minWidth: '300px' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '1.4rem', lineHeight: '1.4' }}>
                            {t.footer.about}
                        </h3>
                        <div className="social-icons" style={{ display: 'flex', gap: '20px' }}>
                            {['fb', 'tw', 'inst', 'ln'].map((soc) => (
                                <a 
                                    key={soc}
                                    href="#" 
                                    style={socialStyle(soc)}
                                    onMouseEnter={() => setHoveredLink(soc)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <i className={`fab fa-${soc === 'fb' ? 'facebook-f' : soc === 'tw' ? 'twitter' : soc === 'inst' ? 'instagram' : 'linkedin-in'}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="footer-right" style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                        <div className="footer-column">
                            <h4 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.1rem' }}>{t.footer.col1Title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    { name: t.footer.links.main, id: 'f1', action: () => scrollToSection('hero') },
                                    { name: t.footer.links.about, id: 'f2', action: () => scrollToSection('about') },
                                    { name: t.footer.links.analysis, id: 'f3', action: () => navigate('/analysis') },
                                    { name: t.footer.links.library, id: 'f4', action: () => setShowDevelopmentModal(true) }
                                ].map(item => (
                                    <li key={item.id} style={{ marginBottom: '12px' }}>
                                        <span 
                                            style={linkStyle(item.id)}
                                            onMouseEnter={() => setHoveredLink(item.id)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                            onClick={item.action}
                                        >
                                            {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.1rem' }}>{t.footer.col2Title}</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    { name: t.footer.links.reviews, id: 'f5', action: () => scrollToSection('testimonials') },
                                    { name: t.footer.links.services, id: 'f6', action: () => scrollToSection('capabilities') },
                                    { name: t.footer.links.contacts, id: 'f7', action: () => scrollToSection('footer') },
                                    { name: t.footer.links.benefits, id: 'f8', action: () => scrollToSection('solutions') }
                                ].map(item => (
                                    <li key={item.id} style={{ marginBottom: '12px' }}>
                                        <span 
                                            style={linkStyle(item.id)}
                                            onMouseEnter={() => setHoveredLink(item.id)}
                                            onMouseLeave={() => setHoveredLink(null)}
                                            onClick={item.action}
                                        >
                                            {item.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ 
                    marginTop: '50px', 
                    paddingTop: '20px', 
                    borderTop: '1px solid rgba(255,255,255,0.1)', 
                    textAlign: 'center', 
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem'
                }}>
                    <p>{t.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
};

    const renderDevelopmentModal = () => (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: showDevelopmentModal ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '15px',
                maxWidth: '500px', width: '90%', position: 'relative'
            }}>
                <button 
                    onClick={() => setShowDevelopmentModal(false)}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                >×</button>
                <h2 style={{ marginBottom: '20px' }}>{t.modals.development.title}</h2>
                <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>{t.modals.development.content}</p>
                <button 
                    onClick={() => setShowDevelopmentModal(false)}
                    style={{ padding: '10px 30px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {t.modals.development.close}
                </button>
            </div>
        </div>
    );

    const renderRequestModal = () => (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: showRequestModal ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '15px',
                maxWidth: '600px', width: '90%', position: 'relative',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <button 
                    onClick={() => setShowRequestModal(false)}
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                >×</button>
                <h2 style={{ marginBottom: '30px' }}>{t.modals.request.title}</h2>
                
                <form onSubmit={handleRequestSubmit}>
                    <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                        {[
                            { label: t.modals.request.area, key: 'area', type: 'number' },
                            { label: t.modals.request.address, key: 'address', type: 'text' },
                            { label: t.modals.request.culture, key: 'culture', type: 'text' },
                            { label: t.modals.request.date, key: 'date', type: 'date' },
                            { label: t.modals.request.phone, key: 'phone', type: 'tel' },
                        ].map(({ label, key, type }) => (
                            <div key={key}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{label}</label>
                                <input
                                    type={type}
                                    value={requestForm[key]}
                                    onChange={(e) => setRequestForm({...requestForm, [key]: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                                    required
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{t.modals.request.description}</label>
                            <textarea
                                value={requestForm.description}
                                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', minHeight: '100px' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                        <button 
                            type="button"
                            onClick={() => setShowRequestModal(false)}
                            style={{ padding: '12px 25px', background: '#f5f5f5', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {t.modals.request.cancel}
                        </button>
                        <button 
                            type="submit"
                            style={{ padding: '12px 25px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {t.modals.request.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderAdminModal = () => (
    <div className="modal-overlay" id="adminLoginModal" style={{ display: 'flex', zIndex: 10001 }}>
        <div className="modal">
            <button className="modal-close" onClick={() => setShowAdminModal(false)}>&times;</button>
            <h2 style={{ color: '#2e7d32' }}>{t.adminPortal.title}</h2>
            
            <form id="adminLoginForm" onSubmit={(e) => { e.preventDefault(); navigate('/admin.html'); }}>
                <div className="form-group">
                    <label>{t.adminPortal.email}</label>
                    <input type="email" id="adminEmail" placeholder="admin@agrivision.ru" required />
                </div>
                <div className="form-group">
                    <label>{t.adminPortal.password}</label>
                    <input type="password" id="adminPassword" placeholder="Введите пароль" required />
                </div>
                <div className="modal-buttons">
                    <button type="submit" className="btn btn-primary">{t.adminPortal.loginBtn}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowAdminModal(false)}>
                        {t.adminPortal.cancel}
                    </button>
                </div>
            </form>
            
            <div className="modal-switch">
                <p>
                    {t.adminPortal.demo}:<br/>
                    Email: <strong>admin@agrivision.ru</strong><br/>
                    Пароль: <strong>AgriVision2024!</strong>
                </p>
            </div>
        </div>
    </div>
);

    return (
        <div className="home-page">
            {renderHero()}
            {renderFuture()}
            {renderCapabilities()}
            {renderHowItWorks()}
            {renderSolutions()}
            {renderTechnologies()}
            {renderWhyChoose()}
            {renderTestimonials()}
            {renderArticles()}
            {renderFooter()}

            {showDevelopmentModal && renderDevelopmentModal()}
            {showRequestModal && renderRequestModal()}
            {showAdminModal && renderAdminModal()}
        </div>
    );
};

export default Home;
