// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RoleChoicePage from './pages/RoleChoicePage';
import OwnerRegisterPage from './pages/OwnerRegisterPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import ClientRegisterPage from './pages/ClientRegisterPage';
import ClientLoginPage from './pages/ClientLoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AddHallPage from './pages/AddHallPage';
import ListHallsPage from './pages/ListHallsPage';
import HallDetailPage from './pages/HallDetailPage';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<HomePage />} />

        {/* Страница выбора роли */}
        <Route path="/login" element={<RoleChoicePage />} />

        {/* Владелец: регистрация/логин */}
        <Route path="/owner/register" element={<OwnerRegisterPage />} />
        <Route path="/owner/login" element={<OwnerLoginPage />} />

        {/* Клиент: регистрация/логин */}
        <Route path="/client/register" element={<ClientRegisterPage />} />
        <Route path="/client/login" element={<ClientLoginPage />} />

        {/* Личный кабинет владельца */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />

        <Route path="/halls/add" element={<AddHallPage />} />
        <Route path="/halls" element={<ListHallsPage />} />
        <Route path="/halls/:id" element={<HallDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
