import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Проверка прав (как в твоем коде)
        if (!currentUser || currentUser.role !== 'admin') {
            alert("Доступ запрещен!");
            navigate('/');
            return;
        }

        // Имитация загрузки данных
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Загрузка админ-панели...</p>
            </div>
        );
    }

    return (
        <div className="admin-page" style={{paddingTop: '100px', padding: '20px'}}>
            <h1>Панель администратора</h1>
            <div className="admin-grid">
                <div className="stat-card"> Пользователей: 2 </div>
                <div className="stat-card"> Анализов: 0 </div>
            </div>
            {/* Сюда добавим таблицу пользователей позже */}
        </div>
    );
};

export default Admin;