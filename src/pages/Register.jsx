// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage, apiRequests } from '../api/axios';

const Register = ({ lang, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

   
    const texts = {
        ru: {
            title: "Регистрация",
            name: "Имя",
            email: "Email",
            phone: "Телефон",
            location: "Локация",
            pass: "Пароль",
            btn: "Зарегистрироваться",
            loading: "Регистрация...",
            error: "Ошибка регистрации"
        },
        en: {
            title: "Registration",
            name: "Name",
            email: "Email",
            phone: "Phone",
            location: "Location",
            pass: "Password",
            btn: "Sign Up",
            loading: "Registering...",
            error: "Registration error"
        }
    };

    const t = texts[lang] || texts.ru;

    // 3. Функция отправки данных - ОБНОВЛЯЕМ ЭНДПОИНТ
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        console.log('🚀 Отправляем запрос регистрации через apiRequests...');
        
        // 1. Используем готовую функцию (она уже знает про эндпоинт /register)
        // Передаем весь объект formData (в нем есть name, email, password, phone, location)
        const response = await apiRequests.register(formData);

        console.log('📥 Ответ от сервера:', response.data);

        if (response.data) {
            console.log("✅ Регистрация успешна!");
            
            // 2. Если бэк сразу прислал токен — сохраняем сессию
            if (response.data.access_token) {
                // Берем данные юзера из ответа ИЛИ собираем из формы, если бэк прислал пустой объект user
                const userData = response.data.user || {
                    ...formData,
                    id: response.data.id || response.data.userId
                };
                
                MemoryStorage.saveSession(response.data.access_token, userData);
            }
            
            alert("Успешно!");
            onClose(); // закрываем модалку
            navigate('/login'); // Перекидываем на логин (или сразу на главную, если уже есть токен)
        }
    } catch (error) {
        // ... блок catch оставляем как есть, он у тебя написан отлично ...
        // (логика обработки 400, 409 ошибок и отсутствия сети)
    } finally {
        setLoading(false);
    }
};

    // 4. Функция обновления полей - ОСТАВЛЯЕМ
    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
        if (error) setError('');
    };

    return (
        <div className="modal-overlay" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="modal" style={{position: 'relative', top: 0}}>
                {/* Кнопка закрытия как в Login.jsx */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '22px',
                        cursor: 'pointer'
                    }}
                >
                    ✕
                </button>
                
                <h2>{t.title}</h2>
                
                {error && (
                    <div style={{ 
                        color: '#d32f2f', 
                        padding: '10px 15px', 
                        margin: '15px 0',
                        background: '#ffebee',
                        borderRadius: '8px',
                        border: '1px solid #ffcdd2',
                        fontSize: '14px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t.name} *</label>
                        <input 
                            type="text" 
                            placeholder={t.name}
                            value={formData.name}
                            onChange={handleChange('name')}
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.email} *</label>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.phone}</label>
                        <input 
                            type="tel" 
                            placeholder="+7..."
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.location}</label>
                        <input 
                            type="text" 
                            placeholder={t.location}
                            value={formData.location}
                            onChange={handleChange('location')}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.pass} *</label>
                        <input 
                            type="password" 
                            placeholder="***"
                            value={formData.password}
                            onChange={handleChange('password')}
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? t.loading : t.btn}
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default Register;