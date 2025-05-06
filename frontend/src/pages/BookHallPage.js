// src/pages/BookHallPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookHallPage.css';

function BookHallPage() {
  const { id } = useParams(); // ID зала
  const navigate = useNavigate();

  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [foodOption, setFoodOption] = useState('venue');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Вы не авторизованы.');
        return;
      }

      const data = {
        hall: id,
        event_name: eventName,
        date,
        time,
        people_count: peopleCount,
        food_option: foodOption,
        description,
      };

      await axios.post('http://127.0.0.1:8000/api/bookings/', data, {
        headers: {
          Authorization: `Token ${token}`,
        }
      });

      setSuccess('Бронирование успешно отправлено!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      setError('Ошибка при бронировании.');
    }
  };

  return (
    <div className="booking-container">
    <h2 className="booking-title">Забронировать зал</h2>
    <form onSubmit={handleSubmit} className="booking-form">

      <div className="form-group">
        <label>Название мероприятия:</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Дата:</label>
        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Время:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Количество людей:</label>
        <input type="number" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Еда:</label>
        <select value={foodOption} onChange={(e) => setFoodOption(e.target.value)}>
          <option value="venue">От заведения</option>
          <option value="own">Своя</option>
        </select>
      </div>

      <div className="form-group">
        <label>Краткое описание:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button type="submit" className="submit-button">Забронировать</button>
    </form>

    {error && <p className="form-error">{error}</p>}
    {success && <p className="form-success">{success}</p>}
  </div>
  );
}

export default BookHallPage;
