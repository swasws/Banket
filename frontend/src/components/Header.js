// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const organizationName = localStorage.getItem('organizationName');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">VenueFinder</Link>
        </div>

        <nav className="nav-links">
          {token ? (
            <>
              <span className="greeting">
                {role === 'owner' && <>Здравствуйте, <strong>{organizationName || 'Владелец'}</strong>!</>}
                {role === 'client' && <>Здравствуйте, <strong>{userName || 'Клиент'}</strong>!</>}
              </span>

              {role === 'owner' && (
                <>
                  <Link to="/halls">Все залы</Link>
                  <Link to="/owner/dashboard">Кабинет</Link>
                </>
              )}

              {role === 'client' && (
                <>
                  <Link to="/halls">Список залов</Link>
                  <Link to="/client/dashboard">Кабинет</Link>
                </>
              )}

              <button className="logout-button-red" onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Логин</Link>
              <Link to="/owner/register">Регистрация Владельца</Link>
              <Link to="/client/register">Регистрация Клиента</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
