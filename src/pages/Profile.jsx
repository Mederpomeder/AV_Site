// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_CONFIG, MemoryStorage } from '../api/axios';

const Profile = ({ lang }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: ''
    });
    const navigate = useNavigate();

    const texts = {
        ru: {
            title: "Мой профиль",
            loading: "Загрузка профиля...",
            error: "Ошибка загрузки",
            name: "Имя",
            email: "Email",
            phone: "Телефон",
            location: "Локация",
            edit: "Редактировать",
            save: "Сохранить",
            cancel: "Отмена",
            stats: {
                analyses: "Анализов проведено",
                requests: "Заявок создано",
                since: "С нами с"
            }
        },
        en: {
            title: "My Profile",
            loading: "Loading profile...",
            error: "Load error",
            name: "Name",
            email: "Email",
            phone: "Phone",
            location: "Location",
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            stats: {
                analyses: "Analyses done",
                requests: "Requests created",
                since: "Member since"
            }
        }
    };

    const t = texts[lang] || texts.ru;

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const userId = MemoryStorage.getUserId();
            if (!userId || userId === 'undefined') {
                throw new Error('Пользователь не авторизован или ID потерян');
            }

            const endpoint = API_CONFIG.ENDPOINTS.USER_PROFILE(userId);
            const response = await api.get(endpoint);
            
            const userData = response.data;
            setUser(userData);
            
            setFormData({
                name: userData.name || userData.full_name || '',
                phone: userData.phone || '',
                location: userData.location || userData.address || ''
            });

        } catch (err) {
            console.error('❌ Ошибка профиля:', err);
            setError(err.message || 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            const userId = MemoryStorage.getUserId();
            const response = await api.patch(`/user/${userId}`, {
                name: formData.name,
                phone: formData.phone,
                location: formData.location
            });

            const updatedUser = {
                ...user,
                name: formData.name,
                phone: formData.phone,
                location: formData.location
            };
            
            const token = MemoryStorage.getToken();
            MemoryStorage.saveSession(token, updatedUser);
            setUser(updatedUser);
            setEditMode(false);
            alert('Профиль успешно обновлен!');

        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            alert(err.response?.data?.message || 'Ошибка сохранения профиля');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                    <div>{t.loading}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '100px' }}>
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px', padding: '20px', color: '#d32f2f', textAlign: 'center' }}>
                    ⚠️ {error}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container" style={{ paddingTop: '100px' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Профиль не найден</h2>
                    <p>Пожалуйста, войдите в систему</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '800px' }}>
            {/* Заголовок профиля */}
            <div className="profile-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '100px', height: '100px', background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '48px', color: 'white', boxShadow: '0 4px 12px rgba(76,175,80,0.3)'
                }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
                
                <h1 style={{ marginBottom: '10px' }}>{t.title}</h1>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    {!editMode ? (
                        <button onClick={() => setEditMode(true)} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '14px' }}>
                            ✏️ {t.edit}
                        </button>
                    ) : (
                        <>
                            <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
                                💾 {t.save}
                            </button>
                            <button onClick={() => { setEditMode(false); setFormData({ name: user.name || '', phone: user.phone || '', location: user.location || '' }); }} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '14px' }}>
                                ❌ {t.cancel}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Информация профиля */}
            <div className="profile-info" style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h2 style={{ marginBottom: '25px', color: '#333' }}>Информация</h2>
                <div className="info-grid" style={{ display: 'grid', gap: '20px' }}>
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>{t.name}</label>
                        {editMode ? (
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }} />
                        ) : (
                            <div style={{ padding: '10px 15px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' }}>
                                {user?.name || user?.full_name || 'Не указано'}
                            </div>
                        )}
                    </div>
                    
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>{t.email}</label>
                        <div style={{ padding: '10px 15px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee', color: '#666' }}>
                            {user?.email}
                        </div>
                    </div>
                    
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>{t.phone}</label>
                        {editMode ? (
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }} />
                        ) : (
                            <div style={{ padding: '10px 15px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' }}>
                                {user?.phone || 'Не указано'}
                            </div>
                        )}
                    </div>
                    
                    <div className="info-field">
                        <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px', fontWeight: '500' }}>{t.location}</label>
                        {editMode ? (
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' }} />
                        ) : (
                            <div style={{ padding: '10px 15px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' }}>
                                {user?.location || user?.address || 'Не указано'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Статистика */}
            {/* <div className="profile-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', color: '#4CAF50', marginBottom: '10px' }}>📊</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>{t.stats.analyses}</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{user?.analyses_count || 0}</p>
                </div>
                
                <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', color: '#2196F3', marginBottom: '10px' }}>📋</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>{t.stats.requests}</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{user?.requests_count || 0}</p>
                </div>
                
                <div className="stat-card" style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', color: '#FF9800', marginBottom: '10px' }}>📅</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>{t.stats.since}</h3>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                    </p>
                </div>
            </div> */}

            {/* БЕЗОПАСНЫЙ БЛОК ID (ВНУТРИ RETURN) */}
            <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                <div>ID пользователя: <code>{user?.id || user?.user_id || 'Загрузка...'}</code></div>
                <div style={{ marginTop: '5px' }}>Эндпоинт профиля: <code>/user/{user?.id || user?.user_id || '...'}</code></div>
            </div>
        </div>
    );
};

export default Profile;