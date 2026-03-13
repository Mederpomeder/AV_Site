import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './pages/Home';
import Library from './components/Library';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Analysis from './pages/Analysis';
import DroneRequest from './pages/DroneRequest';
import './style.css';

function App() {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'ru');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
 
  
  
  const handleLanguageChange = (newLang) => {
 
  setLang(newLang);
  localStorage.setItem('appLang', newLang);
};
 

  return (
    <Router>
      <div className="app-wrapper" style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        <Header
          lang={lang}
          setLang={handleLanguageChange}
          onOpenLogin={() => {
            console.log('STATE LOGIN TRUE');
            setIsLoginOpen(true);
          }}
          onOpenRegister={() => {
            console.log('STATE REGISTER TRUE');
            setIsRegisterOpen(true);
          }}
        />
        {/* Модальные окна показываем только если стейт true */}
        {isLoginOpen && (
          <Login lang={lang} onClose={() => setIsLoginOpen(false)} />
        )}
        
        {isRegisterOpen && (
          <Register lang={lang} onClose={() => setIsRegisterOpen(false)} />
        )}

        <main>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/analysis" element={<Analysis lang={lang} />} />
            <Route path="/profile" element={<Profile lang={lang} />} />
            <Route path="/admin" element={<Admin lang={lang} />} />
            <Route path="/library" element={<Library lang={lang} />} />
            <Route path="/drone-request" element={<DroneRequest lang={lang} />} />
          </Routes>
        </main>
          {/* <Footer lang={lang} /> */}
      </div>
    </Router>
  );
}

export default App;