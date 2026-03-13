import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api, { MemoryStorage } from '../api/axios';

const DroneRequest = ({ lang = 'ru' }) => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        area: '',
        address: '',
        crop: '',
        date: '',
        phone: '',
        additionalInfo: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRequests, setUserRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);

    const texts = {
        ru: {
            title: "Заявка на выезд дрона",
            subtitle: "Оставьте данные, и наш дрон выполнит анализ вашего сада",
            areaLabel: "Площадь участка",
            areaPlaceholder: "Введите площадь участка (в гектарах)",
            addressLabel: "Адрес",
            addressPlaceholder: "Введите адрес участка",
            cropLabel: "Культура",
            cropPlaceholder: "Введите культуру (пшеница, кукуруза, виноград и т.д.)",
            dateLabel: "Предпочтительная дата",
            datePlaceholder: "ДД.ММ.ГГГГ",
            phoneLabel: "Телефон",
            phonePlaceholder: "0555123456",
            additionalLabel: "Дополнительная информация",
            additionalPlaceholder: "Описание участка, особые требования и т.д.",
            submit: "Отправить заявку",
            cancel: "Отмена",
            successTitle: "Заявка успешно отправлена!",
            successMessage: "Наш специалист свяжется с вами в ближайшее время для уточнения деталей.",
            myRequests: "Мои заявки",
            showRequests: "Показать мои заявки",
            hideRequests: "Скрыть заявки",
            noRequests: "У вас еще нет заявок",
            requestId: "ID заявки",
            status: "Статус",
            dateCreated: "Дата создания",
            statuses: {
                pending: "В обработке",
                approved: "Одобрена",
                rejected: "Отклонена",
                completed: "Выполнена"
            },
            validation: {
                required: "Это поле обязательно",
                invalidArea: "Площадь должна быть числом больше 0",
                invalidPhone: "Введите корректный номер телефона",
                invalidDate: "Введите корректную дату"
            }
        },
        en: {
            title: "Drone Service Request",
            subtitle: "Leave your details and our drone will analyze your garden",
            areaLabel: "Area of the plot",
            areaPlaceholder: "Enter plot area (in hectares)",
            addressLabel: "Address",
            addressPlaceholder: "Enter plot address",
            cropLabel: "Crop",
            cropPlaceholder: "Enter crop type (wheat, corn, grapes, etc.)",
            dateLabel: "Preferred date",
            datePlaceholder: "DD.MM.YYYY",
            phoneLabel: "Phone",
            phonePlaceholder: "0555123456",
            additionalLabel: "Additional information",
            additionalPlaceholder: "Plot description, special requirements, etc.",
            submit: "Submit request",
            cancel: "Cancel",
            successTitle: "Request submitted successfully!",
            successMessage: "Our specialist will contact you shortly to clarify details.",
            myRequests: "My requests",
            showRequests: "Show my requests",
            hideRequests: "Hide requests",
            noRequests: "You have no requests yet",
            requestId: "Request ID",
            status: "Status",
            dateCreated: "Date created",
            statuses: {
                pending: "Pending",
                approved: "Approved",
                rejected: "Rejected",
                completed: "Completed"
            },
            validation: {
                required: "This field is required",
                invalidArea: "Area must be a number greater than 0",
                invalidPhone: "Enter a valid phone number",
                invalidDate: "Enter a valid date"
            }
        }
    };

    const t = texts[lang] || texts.ru;

    useEffect(() => {
        const user = MemoryStorage.getUser();
        if (user) {
            setCurrentUser(user);
            loadUserRequests();
        }
    }, []);

    const loadUserRequests = async () => {
        const userId = MemoryStorage.getUserId();
        if (!userId) return;
        
        try {
            const response = await api.get(`/user/${userId}/services`);
            if (response.data) {
                setUserRequests(response.data);
            }
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.area.trim()) newErrors.area = t.validation.required;
        else if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
            newErrors.area = t.validation.invalidArea;
        }
        
        if (!formData.address.trim()) newErrors.address = t.validation.required;
        if (!formData.crop.trim()) newErrors.crop = t.validation.required;
        
        if (!formData.date.trim()) newErrors.date = t.validation.required;
        else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(formData.date)) {
            newErrors.date = t.validation.invalidDate;
        }
        
        if (!formData.phone.trim()) newErrors.phone = t.validation.required;
        else if (!/^0\d{9}$/.test(formData.phone)) {
            newErrors.phone = t.validation.invalidPhone;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            // Убираем все нецифры
            let phone = value.replace(/\D/g, '');
            
            // Ограничиваем длину до 10 цифр
            if (phone.length > 10) phone = phone.slice(0, 10);
            
            // Проверяем, начинается ли с 0
            if (phone.length > 0 && !phone.startsWith('0')) {
                phone = '0' + phone;
            }
            
            // Сохраняем как есть, без форматирования
            setFormData({ ...formData, [name]: phone });
        } else if (name === 'date') {
            let date = value.replace(/\D/g, '');
            if (date.length > 8) date = date.slice(0, 8);
            
            let formatted = '';
            if (date.length > 0) {
                formatted = date.slice(0, 2);
                if (date.length >= 3) {
                    formatted += '.' + date.slice(2, 4);
                }
                if (date.length >= 5) {
                    formatted += '.' + date.slice(4, 8);
                }
            }
            setFormData({ ...formData, [name]: formatted });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const userId = MemoryStorage.getUserId();
        if (!userId) {
            alert('Пожалуйста, войдите в систему');
            navigate('/login');
            return;
        }
        
        setLoading(true);
        
        try {
            const requestData = {
                area: parseFloat(formData.area),
                location: formData.address,
                crop_type: formData.crop,
                preferred_date: formData.date,
                phone: formData.phone,
                additional_info: formData.additionalInfo
            };
            
            await api.post(`/user/${userId}/service-request`, requestData);
            
            setSuccess(true);
            setFormData({
                area: '',
                address: '',
                crop: '',
                date: '',
                phone: '',
                additionalInfo: ''
            });
            
            loadUserRequests();
            
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US');
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending: { background: '#FFF3CD', color: '#856404' },
            approved: { background: '#D4EDDA', color: '#155724' },
            rejected: { background: '#F8D7DA', color: '#721C24' },
            completed: { background: '#D1ECF1', color: '#0C5460' }
        };
        return styles[status] || styles.pending;
    };

    return (
        <div style={{ 
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <Header />
            
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '100px 20px 60px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Заголовок */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '50px',
                    width: '100%'
                }}>
                    <h1 style={{ 
                        fontSize: '36px', 
                        fontWeight: '700', 
                        color: '#2E7D32',
                        marginBottom: '16px',
                        lineHeight: '1.2'
                    }}>
                        {t.title}
                    </h1>
                    <p style={{ 
                        fontSize: '18px', 
                        color: '#6c757d',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.5'
                    }}>
                        {t.subtitle}
                    </p>
                </div>
                
                {/* Уведомление об успехе */}
                {success && (
                    <div style={{
                        width: '100%',
                        maxWidth: '600px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb',
                        color: '#155724',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '30px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.5s ease'
                    }}>
                        <div style={{ 
                            fontSize: '18px', 
                            fontWeight: '700', 
                            marginBottom: '8px' 
                        }}>
                            {t.successTitle}
                        </div>
                        <p style={{ 
                            fontSize: '16px', 
                            margin: 0,
                            lineHeight: '1.5' 
                        }}>
                            {t.successMessage}
                        </p>
                    </div>
                )}
                
                {/* Основная форма */}
                <div style={{
                    width: '100%',
                    maxWidth: '600px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '40px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e9ecef'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Площадь участка */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.areaLabel}
                            </label>
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                placeholder={t.areaPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `2px solid ${errors.area ? '#dc3545' : '#e9ecef'}`,
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                            {errors.area && (
                                <div style={{ 
                                    color: '#dc3545', 
                                    fontSize: '14px', 
                                    marginTop: '8px' 
                                }}>
                                    {errors.area}
                                </div>
                            )}
                        </div>
                        
                        {/* Адрес */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.addressLabel}
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder={t.addressPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `2px solid ${errors.address ? '#dc3545' : '#e9ecef'}`,
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                            {errors.address && (
                                <div style={{ 
                                    color: '#dc3545', 
                                    fontSize: '14px', 
                                    marginTop: '8px' 
                                }}>
                                    {errors.address}
                                </div>
                            )}
                        </div>
                        
                        {/* Культура */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.cropLabel}
                            </label>
                            <input
                                type="text"
                                name="crop"
                                value={formData.crop}
                                onChange={handleChange}
                                placeholder={t.cropPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `2px solid ${errors.crop ? '#dc3545' : '#e9ecef'}`,
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                            {errors.crop && (
                                <div style={{ 
                                    color: '#dc3545', 
                                    fontSize: '14px', 
                                    marginTop: '8px' 
                                }}>
                                    {errors.crop}
                                </div>
                            )}
                        </div>
                        
                        {/* Дата */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.dateLabel}
                            </label>
                            <input
                                type="text"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                placeholder={t.datePlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `2px solid ${errors.date ? '#dc3545' : '#e9ecef'}`,
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                            {errors.date && (
                                <div style={{ 
                                    color: '#dc3545', 
                                    fontSize: '14px', 
                                    marginTop: '8px' 
                                }}>
                                    {errors.date}
                                </div>
                            )}
                        </div>
                        
                        {/* Телефон - простой формат 0555123456 */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.phoneLabel}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={t.phonePlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: `2px solid ${errors.phone ? '#dc3545' : '#e9ecef'}`,
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                            />
                            {errors.phone && (
                                <div style={{ 
                                    color: '#dc3545', 
                                    fontSize: '14px', 
                                    marginTop: '8px' 
                                }}>
                                    {errors.phone}
                                </div>
                            )}
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#6c757d', 
                                marginTop: '6px',
                                fontStyle: 'italic'
                            }}>

                            </div>
                        </div>
                        
                        {/* Дополнительная информация */}
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ 
                                display: 'block',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#495057',
                                marginBottom: '10px'
                            }}>
                                {t.additionalLabel}
                            </label>
                            <textarea
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                placeholder={t.additionalPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    fontSize: '16px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '10px',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    minHeight: '120px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        
                        {/* Кнопки */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '20px', 
                            marginTop: '40px' 
                        }}>
                            <button
                                type="submit"
                                style={{
                                    flex: '1',
                                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '18px 32px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    opacity: loading ? 0.7 : 1
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Отправка...' : t.submit}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    flex: '1',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '18px 32px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* История заявок */}
                {/* {currentUser && (
                    <div style={{
                        width: '100%',
                        maxWidth: '600px',
                        marginTop: '60px'
                    }}>
                        <button
                            onClick={() => setShowRequests(!showRequests)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4CAF50',
                                fontSize: '18px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '20px'
                            }}
                        >
                            <span>{showRequests ? '▲' : '▼'}</span>
                            {showRequests ? t.hideRequests : t.showRequests}
                        </button>
                        
                        {showRequests && (
                            <div>
                                {userRequests.length > 0 ? (
                                    userRequests.map((request, index) => {
                                        const statusStyle = getStatusStyle(request.status);
                                        return (
                                            <div key={index} style={{
                                                background: '#ffffff',
                                                borderRadius: '12px',
                                                padding: '20px',
                                                marginBottom: '15px',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    marginBottom: '15px' 
                                                }}>
                                                    <div style={{ 
                                                        fontSize: '14px', 
                                                        color: '#6c757d', 
                                                        fontWeight: '600' 
                                                    }}>
                                                        {t.requestId}: #{request.id || index + 1}
                                                    </div>
                                                    <div style={{ 
                                                        padding: '6px 16px', 
                                                        borderRadius: '50px', 
                                                        fontSize: '14px', 
                                                        fontWeight: '600',
                                                        ...statusStyle
                                                    }}>
                                                        {t.statuses[request.status] || t.statuses.pending}
                                                    </div>
                                                </div>
                                                
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(2, 1fr)', 
                                                    gap: '15px' 
                                                }}>
                                                    <div>
                                                        <div style={{ 
                                                            fontSize: '12px', 
                                                            color: '#6c757d', 
                                                            marginBottom: '4px' 
                                                        }}>
                                                            {t.addressLabel}
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '14px', 
                                                            color: '#212529', 
                                                            fontWeight: '500' 
                                                        }}>
                                                            {request.location}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ 
                                                            fontSize: '12px', 
                                                            color: '#6c757d', 
                                                            marginBottom: '4px' 
                                                        }}>
                                                            {t.cropLabel}
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '14px', 
                                                            color: '#212529', 
                                                            fontWeight: '500' 
                                                        }}>
                                                            {request.crop_type}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ 
                                                            fontSize: '12px', 
                                                            color: '#6c757d', 
                                                            marginBottom: '4px' 
                                                        }}>
                                                            {t.areaLabel}
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '14px', 
                                                            color: '#212529', 
                                                            fontWeight: '500' 
                                                        }}>
                                                            {request.area} га
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ 
                                                            fontSize: '12px', 
                                                            color: '#6c757d', 
                                                            marginBottom: '4px' 
                                                        }}>
                                                            {t.dateCreated}
                                                        </div>
                                                        <div style={{ 
                                                            fontSize: '14px', 
                                                            color: '#212529', 
                                                            fontWeight: '500' 
                                                        }}>
                                                            {formatDate(request.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '40px', 
                                        color: '#6c757d', 
                                        fontSize: '16px',
                                        background: '#ffffff',
                                        borderRadius: '12px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        {t.noRequests}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )} */}
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                input:focus, textarea:focus {
                    border-color: #4CAF50 !important;
                    background-color: white;
                    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
                }
                
                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                }
                
                button:active:not(:disabled) {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default DroneRequest;