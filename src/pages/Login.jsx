// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage, apiRequests } from '../api/axios';

const Login = ({ lang, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const texts = {
    ru: {
      title: "Вход в аккаунт",
      email: "Email",
      password: "Пароль",
      btn: "Войти",
      error: "Ошибка входа",
      loading: "Вход..."
    },
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      btn: "Sign In",
      error: "Login error",
      loading: "Logging in..."
    }
  };

  const t = texts[lang] || texts.ru;

  
const handleSubmit = async (e) => {
    onClose();
    navigate('/');
    console.log(' Вход успешен!');
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Отправляем запрос на /login...');
      const response = await apiRequests.login(formData);
      console.log('📥 Ответ от сервера:', response.data);

      if (response.data && response.data.access_token) {
        // МАКСИМАЛЬНО ГИБКИЙ ПОИСК ID
        // Твой сервер присылает user_id, поэтому ставим его первым!
        const finalId = response.data.user_id || response.data.id || response.data.userId;
        
        // Собираем данные пользователя, которые реально есть
        const userData = {
          ...response.data, // Берем всё что пришло (там и name, и role)
          email: response.data.email || formData.email,
          id: finalId 
        };
        
        // Сохраняем (внутри MemoryStorage уже стоит логика для user_id)
        MemoryStorage.saveSession(response.data.access_token, userData);
        window.dispatchEvent(new Event('user-login'));
        console.log('✅ Вход успешен! ID:', finalId);
        onClose();
      } else {
        throw new Error('Токен не получен от сервера');
      }
      
    } catch (err) {
      console.error('❌ Ошибка входа:', err);
      // ... твой код обработки ошибок без изменений
      if (err.response) {
        const serverError = err.response.data;
        if (err.response.status === 401) {
          setError('Неверный email или пароль');
        } else {
          setError(`Ошибка сервера: ${err.response.status}`);
        }
      } else {
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'transparent',
            fontSize: '22px',
            cursor: 'pointer',
            zIndex: 10
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
            <label>{t.email}</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange('email')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              placeholder="••••••"
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

export default Login;