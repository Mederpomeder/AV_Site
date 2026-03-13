// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MemoryStorage } from '../api/axios';

const translations = {
    ru: { 
        home: "Главная", 
        analysis: "Анализ", 
        library: "Библиотека", 
        request: "Заявка", 
        about: "О нас", 
        login: "Войти", 
        register: "Регистрация", 
        profile: "Мой профиль", 
        logout: "Выйти",
        stats: "Статистика",
        notifications: "Уведомления",
        no_notifications: "Нет новых уведомлений"
    },
    en: { 
        home: "Home", 
        analysis: "Analysis", 
        library: "Library", 
        request: "Request", 
        about: "About", 
        login: "Login", 
        register: "Register", 
        profile: "My Profile", 
        logout: "Logout",
        stats: "Statistics",
        notifications: "Notifications",
        no_notifications: "No new notifications"
    }
};

const Header = ({ lang, setLang, onOpenRegister, onOpenLogin }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

   useEffect(() => {
    // 1. Функция проверки пользователя
    const checkUser = () => {
        const currentUser = MemoryStorage.getUser();
        if (currentUser) {
            setUser(currentUser);
        } else {
            setUser(null);
        }
    };

    // Проверяем один раз при загрузке
    checkUser();

    // 2. Слушаем событие входа/выхода (чтобы хедер обновлялся мгновенно)
    window.addEventListener('storage', checkUser);
    // Также создаем кастомное событие для мгновенного обновления в той же вкладке
    window.addEventListener('user-login', checkUser);

    setNotifications([
        { id: 1, text: "Ваш анализ растения завершен", time: "10 мин назад", read: false },
        { id: 2, text: "Новая статья в библиотеке", time: "1 час назад", read: true },
    ]);

    const handleClickOutside = (e) => {
        if (!e.target.closest('.notifications-wrapper') && !e.target.closest('.user-profile')) {
            setShowNotifications(false);
            setShowProfileDropdown(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('storage', checkUser);
        window.removeEventListener('user-login', checkUser);
    };
}, []);

    const t = (key) => translations[lang]?.[key] || translations['ru'][key] || key;

    const handleLogout = () => {
        MemoryStorage.clear();
        setUser(null);
        setShowProfileDropdown(false);
        window.location.href = '/';
    };

    const handleNavClick = (sectionId, e) => {
        if (e) e.preventDefault();
        
        if (sectionId === 'analysis') {
            navigate('/analysis'); 
            setIsMenuOpen(false);
            return;
        }
        if (sectionId === 'library') {
            navigate('/library'); 
            setIsMenuOpen(false);
            return;
        }
        if (sectionId === 'drone-request') {
            navigate('/drone-request');
            setIsMenuOpen(false);
            return;
        }
        
        // Для остальных случаев (якорные ссылки на главной)
        if (window.location.pathname !== '/') {
            navigate(`/#${sectionId}`);
        } else {
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerOffset = 80; 
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        }
        setIsMenuOpen(false);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(prev => 
            prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
    };

    const dropdownLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        textDecoration: 'none',
        color: '#333',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="main-header" style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, 
            background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
        }}>
            <div className="container header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' }}>
                <div className="logo">
                    <Link to="/" className="logo-link" onClick={(e) => handleNavClick('home', e)}>
                        <div className="svg-placeholder" style={{ fontSize: '24px' }}>🌱</div>
                    </Link>
                </div>

                <button 
                    className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
                >
                    <span></span><span></span><span></span>
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
                        <li><a href="/" onClick={(e) => handleNavClick('home', e)}>{t('home')}</a></li>
                        <li><a href="#analysis" onClick={(e) => handleNavClick('analysis', e)}>{t('analysis')}</a></li>
                        <li><a href="#library" onClick={(e) => handleNavClick('library', e)}>{t('library')}</a></li>
                        {/* Изменяем этот пункт для заявки на дрон */}
                        <li><a href="#drone-request" onClick={(e) => handleNavClick('drone-request', e)}>{t('request')}</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick('about', e)}>{t('about')}</a></li>
                    </ul>
                </nav>

                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    
                    {/* 1. ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ */}
                    <div className="language-switcher">
                        <button className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} onClick={() => setLang('ru')}>RU</button>
                        <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
                    </div>

                    {/* 2. КОЛОКОЛЬЧИК УВЕДОМЛЕНИЙ */}
                    {/* <div className="notifications-wrapper" style={{ position: 'relative' }}>
                        <button 
                            className="notifications-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {user && unreadCount > 0 && (
                                <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#ff4757', color: 'white', borderRadius: '50%', width: '12px', height: '12px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="notifications-dropdown" style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                right: 0,
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                width: '280px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                border: '1px solid #eee',
                                zIndex: 9999
                            }}>
                                <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontWeight: '600', fontSize: '16px' }}>{t('notifications')}</div>
                                    {unreadCount > 0 && (
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            {unreadCount} непрочитанных
                                        </div>
                                    )}
                                </div>
                                
                                <div style={{ padding: '10px 0' }}>
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div 
                                                key={notification.id} 
                                                style={{
                                                    padding: '12px 15px',
                                                    borderBottom: '1px solid #f5f5f5',
                                                    cursor: 'pointer',
                                                    backgroundColor: notification.read ? 'transparent' : '#f8f9fa',
                                                    transition: 'background 0.2s'
                                                }}
                                                onClick={() => markNotificationAsRead(notification.id)}
                                            >
                                                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                                                    {notification.text}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#999' }}>
                                                    {notification.time}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                            {t('no_notifications')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div> */}

                    {/* 3. ПРОФИЛЬ ИЛИ КНОПКИ ВХОДА */}
                    {!user ? (
                        <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="btn btn-outline" 
                                onClick={onOpenLogin}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #2d7a2f',
                                    background: 'transparent',
                                    color: '#4CAF50',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {t('login')}
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={onOpenRegister}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    background: '#368c39',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {t('register')}
                            </button>
                        </div>
                    ) : (
                        <div className="user-profile" style={{ position: 'relative' }}>
                            <button 
                                className="profile-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileDropdown(!showProfileDropdown);
                                }}
                                style={{
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    background: 'none',
                                    border: '1px solid #ddd', 
                                    borderRadius: '25px',
                                    padding: '5px 15px', 
                                    cursor: 'pointer', 
                                    gap: '8px'
                                }}
                            >
                                <div style={{
                                    width: '32px', 
                                    height: '32px', 
                                    background: '#2e7d32',
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center', 
                                    color: 'white', 
                                    fontWeight: 'bold'
                                }}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span style={{ color: '#333', fontWeight: '500' }}>{user?.name || "User"}</span>
                                <span style={{ fontSize: '10px' }}>{showProfileDropdown ? '▲' : '▼'}</span>
                            </button>

                            {/* ВЫПАДАЮЩЕЕ МЕНЮ */}
                            {showProfileDropdown && (
                                <div className="profile-dropdown" style={{
                                    position: 'absolute',          
                                    top: 'calc(100% + 10px)',      
                                    right: '0',                    
                                    background: 'white',           
                                    borderRadius: '12px',         
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                                    width: '210px',               
                                    padding: '8px 0',          
                                    border: '1px solid #eee',     
                                    zIndex: 9999,                  
                                    display: 'flex',              
                                    flexDirection: 'column'
                                }}>
                                    <Link 
                                        to="/profile" 
                                        className="dropdown-item" 
                                        style={dropdownLinkStyle} 
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        <span style={{ marginRight: '9px' }}></span> {t('profile')}
                                    </Link>
                                    
                                    {/* <Link 
                                        to="/stats" 
                                        className="dropdown-item" 
                                        style={dropdownLinkStyle} 
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        <span style={{ marginRight: '12px' }}>📊</span> {t('stats')}
                                    </Link> */}

                                    <div style={{ height: '1px', background: '#eee', margin: '4px 0' }}></div>

                                    <button 
                                        onClick={handleLogout} 
                                        className="dropdown-item" 
                                        style={{ 
                                            ...dropdownLinkStyle, 
                                            width: '100%', 
                                            border: 'none', 
                                            background: 'none', 
                                            textAlign: 'left', 
                                            color: '#dc3545' 
                                        }}
                                    >
                                        <span style={{ marginRight: '9px' }}></span> {t('logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .burger-menu { display: none; width: 30px; height: 20px; position: relative; }
                .burger-menu span { display: block; position: absolute; height: 3px; width: 100%; background: #333; border-radius: 3px; transition: 0.3s; }
                .burger-menu span:nth-child(1) { top: 0; }
                .burger-menu span:nth-child(2) { top: 8px; }
                .burger-menu span:nth-child(3) { top: 16px; }
                .burger-menu.active span:nth-child(1) { transform: rotate(45deg); top: 8px; }
                .burger-menu.active span:nth-child(2) { opacity: 0; }
                .burger-menu.active span:nth-child(3) { transform: rotate(-45deg); top: 8px; }
                
                .nav-menu ul li a {
                    color: #333;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 5px 0;
                    position: relative;
                    transition: color 0.3s;
                }
                
                .nav-menu ul li a:hover {
                    color: #4CAF50;
                }
                
                .nav-menu ul li a::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    
                    left: 0;
                    bottom: 0;
                    transition: width 0.3s;
                }
                
                .nav-menu ul li a:hover::after {
                    width: 100%;
                }
                
                .lang-btn {
                    background: none;
                    border: none;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    transition: color 0.3s;
                }
                
                .lang-btn.active {
                    color: #4CAF50;
                    font-weight: bold;
                }
                
                .lang-btn:hover {
                    color: #4CAF50;
                }

                @media (max-width: 768px) {
                    .burger-menu { display: block !important; }
                    .nav-menu { 
                        position: fixed; 
                        top: 70px; 
                        left: -100%; 
                        width: 100%; 
                        height: calc(100vh - 70px); 
                        background: white; 
                        transition: 0.3s; 
                        padding: 20px; 
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                    }
                    .nav-menu.active { left: 0; }
                    .nav-menu ul { 
                        flex-direction: column !important; 
                        gap: 20px; 
                        padding: 0;
                    }
                    .nav-menu ul li {
                        width: 100%;
                    }
                    .nav-menu ul li a {
                        display: block;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;