import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Library = ({ lang }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const t = {
        ru: {
            title: "Полезные статьи о сельском хозяйстве",
            subtitle: "Узнайте больше о болезнях растений, методах лечения и современных технологиях в сельском хозяйстве",
            no_articles: "Статей пока нет",
            no_articles_sub: "Администратор еще не добавил статьи. Зайдите позже!",
            read_more: "Читать далее",
            error_msg: "Не удалось загрузить данные. Проверьте соединение с сервером."
        }
    }[lang] || { /* по умолчанию RU */ };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/library');
                if (Array.isArray(response.data)) setArticles(response.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    if (loading) return <div style={{ paddingTop: '200px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Загрузка...</div>;

    return (
        <div style={{ 
            background: '#F8FAFB', // Тот самый чистый фон
            minHeight: '100vh', 
            paddingTop: '140px', 
            fontFamily: "'Inter', sans-serif" 
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                
                {/* Заголовок с точным цветом AgriVision */}
                {/* <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 style={{ 
                        color: '#2d6a4f', 
                        fontSize: '42px', 
                        fontWeight: '700', 
                        letterSpacing: '-1px',
                        marginBottom: '20px'
                    }}>
                        {t.title}
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '18px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
                        {t.subtitle}
                    </p>
                </header> */}

                {articles.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
                        {articles.map(article => (
                            <div key={article.id} style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '32px',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}>
                                <h3 style={{ color: '#111827', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{article.title}</h3>
                                <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>{article.description}</p>
                                <button style={{ color: '#2d6a4f', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                                    {t.read_more} →
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Состояние "Статей пока нет" — копия твоего скрина */
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            background: '#F3F4F6', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 30px'
                        }}>
                            {/* Более "дорогая" иконка газеты */}
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                                <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/>
                            </svg>
                        </div>
                        <h2 style={{ color: '#1F2937', fontSize: '32px', fontWeight: '700', marginBottom: '10px' }}>{t.no_articles}</h2>
                        <p style={{ color: '#9CA3AF', fontSize: '18px' }}>{t.no_articles_sub}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;