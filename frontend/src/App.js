// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Chat from './components/Chat';

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

import AllHallsPage from './pages/AllHallsPage';
import MyHallsPage from './pages/MyHallsPage';

import CityHallsPage from './pages/CityHallsPage';

import EditHallPage from './pages/EditHallPage';

import BookHallPage from './pages/BookHallPage';

import ClientDashboard from './pages/ClientDashboard';
import EditBookingPage from './pages/EditBookingPage';


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

        <Route path="/halls" element={<AllHallsPage />} />
        <Route path="/my-halls" element={<MyHallsPage />} />

        <Route path="/owner/halls/:id/edit" element={<EditHallPage />} />

        <Route path="/cities/:id" element={<CityHallsPage />} />

        <Route path="/halls/:id/book" element={<BookHallPage />} />

        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/bookings/:id/edit" element={<EditBookingPage />} />

        <Route path="/chat/:bookingId" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />


      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
