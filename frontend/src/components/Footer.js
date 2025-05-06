// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>VenueFinder</h3>
          <p>Платформа для бронирования банкетных и конференц-залов по всей стране.</p>
        </div>

        <div className="footer-right">
          <ul>
            <li><a href="/halls">Залы</a></li>
            <li><a href="/client/register">Стать клиентом</a></li>
            <li><a href="/owner/register">Добавить зал</a></li>
            <li><a href="/login">Вход</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {currentYear} VenueFinder. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
