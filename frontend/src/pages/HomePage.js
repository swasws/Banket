// src/pages/HomePage.js
import React from 'react';
import ListHallsPage from './ListHallsPage';
import './HomePage.css'; // добавим стили

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Добро пожаловать в VenueFinder</h1>
          <p>Найдите идеальный зал для своего события — банкет, конференция, свадьба, все в одном месте.</p>
        </div>
      </div>

      <div className="hall-section">
        <h2>🔍 Список доступных залов</h2>
        <ListHallsPage />
      </div>
    </div>
  );
};

export default HomePage;
