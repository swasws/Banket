import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 добавили
import './HomePage.css';

const cities = [
  { name: "Бишкек", description: "Столица с лучшими залами.", image: "/images/bishkek.jpg" },
  { name: "Ош", description: "Теплый юг и гостеприимство.", image: "/images/osh.jpg" },
  { name: "Чолпон-Ата", description: "Отдых на Иссык-Куле.", image: "/images/cholpon-ata.jpg" },
  { name: "Каракол", description: "Горы и природа.", image: "/images/karakol.jpg" },
  { name: "Талас", description: "История и культура.", image: "/images/talas.jpg" },
  { name: "Нарын", description: "Сердце гор Кыргызстана.", image: "/images/naryn.jpg" },
  { name: "Баткен", description: "Экзотика юга.", image: "/images/batken.jpg" },
  { name: "Джалал-Абад", description: "Залы для крупных событий.", image: "/images/jalal-abad.jpg" },
  { name: "Кара-Балта", description: "Близость к столице.", image: "/images/kara-balta.jpg" },
  { name: "Токмок", description: "Уютные пространства.", image: "/images/tokmok.jpg" },
];

const HomePage = () => {
  const sliderRef = useRef(null);
  const navigate = useNavigate(); // 👈 инициализировали навигатор

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleCityClick = (cityName) => {
    navigate(`/halls?cityName=${encodeURIComponent(cityName)}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Добро пожаловать в VenueFinder</h1>
          <p>Находите и бронируйте лучшие залы Кыргызстана в пару кликов.</p>
        </div>
      </section>

      <section className="cities-section">
        <h2>Популярные города</h2>
        <div className="slider-container">
          <button className="slider-button left" onClick={scrollLeft}>&#8592;</button>
          <div className="cities-slider" ref={sliderRef}>
            {cities.map((city, index) => (
              <div
                className="city-card"
                key={index}
                onClick={() => handleCityClick(city.name)} // 👈 переход по клику
                style={{ cursor: 'pointer' }} // 👈 визуально понятно что клик
              >
                <img src={city.image} alt={city.name} />
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>{city.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-button right" onClick={scrollRight}>&#8594;</button>
        </div>
      </section>

      <section className="book-hall-section">
        <div className="book-content">
          <div className="text-block">
            <h2>Забронируй зал легко</h2>
            <p>Выберите зал, уточните детали и забронируйте место для своего мероприятия без лишних хлопот.</p>
            <ul>
              <li>Мгновенное отображение доступности по датам</li>
              <li>Общение с владельцем в встроенном чате</li>
              <li>Гарантированное подтверждение брони</li>
              <li>Просмотр отзывов и рейтингов залов</li>
            </ul>
          </div>
          <div className="image-block">
            <img src="/images/book-hall.jpg" alt="Забронируй зал" />
          </div>
        </div>
      </section>

      <section className="register-hall-section">
        <div className="register-content">
          <div className="text-block">
            <h2>Зарегистрируй свой зал</h2>
            <p>Станьте частью VenueFinder и получайте новых клиентов, продвигая свои услуги через наш портал.</p>
            <ul>
              <li>Разместите информацию и фотографии вашего зала</li>
              <li>Отслеживайте бронирования и отклики в личном кабинете</li>
              <li>Получайте уведомления о новых заявках</li>
              <li>Повышайте видимость среди сотен клиентов</li>
            </ul>
          </div>
          <div className="image-block">
            <img src="/images/register-hall.jpg" alt="Зарегистрируй свой зал" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
