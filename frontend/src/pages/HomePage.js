// src/pages/HomePage.js
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('');
  const [latestHalls, setLatestHalls] = useState([]);

  const scrollLeft = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (slider.scrollLeft <= 0) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft >= maxScrollLeft - 10) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleCityClick = (cityName) => {
    navigate(`/halls?cityName=${encodeURIComponent(cityName)}`);
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      cityName: city,
      start: startDate,
      end: endDate,
      guests: guests,
    }).toString();
    navigate(`/halls?${query}`);
  };

  useEffect(() => {
    const fetchLatestHalls = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/halls/');
        const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestHalls(sorted.slice(0, 3));
      } catch (error) {
        console.error('Ошибка загрузки залов:', error);
      }
    };

    fetchLatestHalls();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-logo-center">VenueFinder</div>

        <div className="hero-headline">
          <p>Незабываемые события начинаются здесь</p>
          <h1>Банкет мечты</h1>
        </div>

        <div className="hero-image-container">
          <img src="/images/hero-bed.jpg" alt="dream stay" className="hero-image" />
          <div className="hero-booking-bar">
            <div className="booking-item">
              <span>Город</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Введите город"
              />
            </div>
            <div className="booking-item">
              <span>Дата начала</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="booking-item">
              <span>Дата окончания</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="booking-item">
              <span>Гости</span>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Количество"
              />
            </div>
            <button className="booking-search" onClick={handleSearch}>
              🔍
            </button>
          </div>
        </div>
      </section>

      <section className="cities-section">
        <h2>Залы в городах</h2>
        <div className="slider-container">
          <button className="slider-button left" onClick={scrollLeft}>&#8592;</button>
          <div className="cities-slider" ref={sliderRef}>
            {cities.map((city, index) => (
              <div
                className="city-card"
                key={index}
                onClick={() => handleCityClick(city.name)}
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

      <section className="recommended-section">
        <h2>Рекомендуемые залы</h2>
        <div className="recommended-list">
          {latestHalls.map(hall => {
            const imageUrl = hall.image?.startsWith('http')
              ? hall.image
              : `http://127.0.0.1:8000${hall.image}`;
            return (
              <div className="recommended-card" key={hall.id}>
                <Link to={`/halls/${hall.id}`}>
                  <img src={imageUrl} alt={hall.name} />
                </Link>
                <div className="card-info">
                  <h3>
                    <Link to={`/halls/${hall.id}`}>{hall.name}</Link>
                  </h3>
                  <p className="location">{hall.city_name || 'Без города'}</p>
                  <div className="price">от {hall.price || 0} сом</div>
                </div>
              </div>
            );
          })}

          <div className="recommended-cta">
            <h3>Залы</h3>
            <p>Откройте лучшие предложения</p>
            <button onClick={() => navigate('/halls')}>→</button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>Отзывы клиентов</h2>
        <div className="testimonials-list">
          <div className="testimonial-card">
            <p className="testimonial-text">
              “Отличный сервис! Нашёл идеальный зал для свадьбы всего за 15 минут. Очень удобно и красиво оформлено.”
            </p>
            <div className="testimonial-author">— Айсулуу А., Бишкек</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              “VenueFinder помог мне быстро найти площадку для бизнес-форума. Владельцы отвечали моментально!”
            </p>
            <div className="testimonial-author">— Тимур Ж., Ош</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              “Мы арендовали зал на Иссык-Куле. Всё прошло идеально — бронирование было простым и быстрым.”
            </p>
            <div className="testimonial-author">— Алина М., Чолпон-Ата</div>
          </div>
        </div>
      </section>

      <section className="for-owners-section">
        <div className="owners-content">
          <div className="owners-text">
            <h2>Хотите сдать зал?</h2>
            <p>Присоединяйтесь к VenueFinder и начните получать заявки от клиентов уже сегодня.</p>
          </div>
          <button className="owner-register-button" onClick={() => navigate('/owner/register')}>
            Зарегистрировать зал
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
