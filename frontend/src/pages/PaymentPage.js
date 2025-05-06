import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';

function PaymentPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [hall, setHall] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    card: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingAndHall = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const bookingRes = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setBooking(bookingRes.data);

        const hallId = bookingRes.data.hall;
        const hallRes = await axios.get(`http://127.0.0.1:8000/api/halls/${hallId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setHall(hallRes.data);
      } catch (err) {
        setError('Ошибка при получении данных.');
        console.error(err);
      }
    };

    fetchBookingAndHall();
  }, [bookingId]);

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleChange = (field, value) => {
    if (field === 'card') {
      value = formatCardNumber(value);
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!/^[А-Яа-яA-Za-z\s]+$/.test(form.name.trim())) {
      errors.name = 'Имя должно содержать только буквы';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Введите корректный email';
    }

    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.card)) {
      errors.card = 'Введите номер карты в формате 1111 2222 3333 4444';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/bookings/${bookingId}/pay/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });

      setIsPaid(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Ошибка при оплате. Попробуйте позже.');
    }
  };

  if (error) return <div className="payment-container"><p>{error}</p></div>;
  if (!booking || !hall) return <div className="payment-container"><p>Загрузка...</p></div>;

  return (
    <div className="payment-container">
      <h2>Оплата бронирования</h2>
      <p><strong>Мероприятие:</strong> {booking.event_name}</p>
      <p><strong>Зал:</strong> {hall.name}</p>
      <div><strong>Цена:</strong> {hall.price ? `${hall.price} сом` : '—'}</div>

      {!isPaid ? (
        <>
          <div className="payment-form">
            <input
              type="text"
              placeholder="Имя на карте"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={formErrors.name ? 'input-error' : ''}
            />
            {formErrors.name && <div className="error-msg">{formErrors.name}</div>}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={formErrors.email ? 'input-error' : ''}
            />
            {formErrors.email && <div className="error-msg">{formErrors.email}</div>}

            <input
              type="text"
              placeholder="Номер карты (**** **** **** ****)"
              maxLength={19}
              value={form.card}
              onChange={(e) => handleChange('card', e.target.value)}
              className={formErrors.card ? 'input-error' : ''}
            />
            {formErrors.card && <div className="error-msg">{formErrors.card}</div>}

            <button className="pay-btn" onClick={handlePayment}>Оплатить</button>
          </div>
        </>
      ) : (
        <div className="payment-success">
          ✅ Оплата прошла успешно! Возвращаемся...
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
