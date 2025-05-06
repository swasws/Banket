import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditBookingPage.css';

function EditBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    event_name: '',
    date: '',
    time: '',
    people_count: '',
    food_option: 'venue',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${id}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setFormData(response.data);
      } catch (err) {
        setError('Ошибка при загрузке брони.');
      }
    };
    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://127.0.0.1:8000/api/bookings/${id}/`, formData, {
        headers: { Authorization: `Token ${token}` }
      });
      setSuccess('Бронирование обновлено!');
      setTimeout(() => navigate('/client/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setError('Ошибка при сохранении.');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      navigate('/client/dashboard');
    } catch (err) {
      console.error(err);
      setError('Ошибка при отмене бронирования.');
    }
  };

  return (
    <div className="edit-booking-container">
    <h2 className="edit-booking-title">Редактировать Бронирование</h2>
    {error && <p className="edit-booking-error">{error}</p>}
    {success && <p className="edit-booking-success">{success}</p>}

    <form onSubmit={handleSubmit} className="edit-booking-form">
      <label>Название мероприятия:</label>
      <input name="event_name" value={formData.event_name} onChange={handleChange} required />

      <label>Дата:</label>
      <input name="date" type="date" min={today} value={formData.date} onChange={handleChange} required />

      <label>Время:</label>
      <input name="time" type="time" value={formData.time} onChange={handleChange} required />

      <label>Кол-во людей:</label>
      <input name="people_count" type="number" value={formData.people_count} onChange={handleChange} />

      <label>Еда:</label>
      <select name="food_option" value={formData.food_option} onChange={handleChange}>
        <option value="venue">От заведения</option>
        <option value="own">Своя</option>
      </select>

      <label>Описание:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} />

      <div className="edit-booking-buttons">
        <button type="submit" className="save-btn">Сохранить</button>
        <button type="button" className="cancel-btn" onClick={handleCancel}>Отменить бронирование</button>
      </div>
    </form>
  </div>
  );
}

export default EditBookingPage;
