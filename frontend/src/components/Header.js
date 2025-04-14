// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // Проверим, есть ли в localStorage токен
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const organizationName = localStorage.getItem('organizationName');

  // Функция логаута: очистим localStorage
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('organizationName');
    window.location.href = '/'; // после логаута на главную
  };

  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <nav>
        {/* Общедоступные ссылки */}
        <Link to="/">Главная</Link> | {' '}

        {token ? (
          // Если пользователь залогинен, показываем:
          <>
            {role === 'owner' && (
              // Для владельца - имя заведения
              <span style={{ marginRight: '10px' }}>
                Здравствуйте, {organizationName || 'Владелец'}!
              </span>
            )}
            {role === 'client' && (
              // Для клиента - username
              <span style={{ marginRight: '10px' }}>
                Здравствуйте, {userName || 'Клиент'}!
              </span>
            )}

            {/* Допустим, ссылки для владельцев: */}
            {role === 'owner' && (
              <>
                <Link to="/halls/add">Добавить зал</Link> | {' '}
                <Link to="/halls">Список моих залов</Link> | {' '}
              </>
            )}

            {/* Ссылки для клиентов (пример) */}
            {role === 'client' && (
              <>
                <Link to="/halls">Список залов</Link> | {' '}
              </>
            )}

            {/* Кнопка логаута */}
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          // Если не залогинен
          <>
            <Link to="/login">Логин</Link> | {' '}
            <Link to="/owner/register">Регистрация Владельца</Link> | {' '}
            <Link to="/client/register">Регистрация Клиента</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
