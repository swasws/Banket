// src/pages/RoleChoicePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './RoleChoicePage.css';

const RoleChoicePage = () => {
  return (
    <div className="role-choice-container">
      <h2 className="role-choice-title">Выберите свою роль</h2>
      <div className="role-cards">
        <Link to="/owner/login" className="role-card owner">
          <div className="icon">🏢</div>
          <h3>Я Владелец зала</h3>
          <p>У меня есть помещение, и я хочу сдавать его в аренду.</p>
        </Link>

        <Link to="/client/login" className="role-card client">
          <div className="icon">🎉</div>
          <h3>Я Клиент</h3>
          <p>Хочу найти и забронировать зал для мероприятия.</p>
        </Link>
      </div>

      <div className="register-links">
        <p>Нет аккаунта?</p>
        <Link to="/owner/register" className="register-btn">Регистрация владельца</Link>
        <Link to="/client/register" className="register-btn">Регистрация клиента</Link>
      </div>
    </div>
  );
};

export default RoleChoicePage;
