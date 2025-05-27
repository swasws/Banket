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
    card: '',
    expiration: '',
    cvv: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const bookingRes = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setBooking(bookingRes.data);

        const hallRes = await axios.get(`http://127.0.0.1:8000/api/halls/${bookingRes.data.hall}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setHall(hallRes.data);
      } catch (err) {
        setError('Ошибка при получении данных.');
        console.error(err);
      }
    };

    fetchData();
  }, [bookingId]);

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();

  const handleChange = (field, value) => {
    if (field === 'card') value = formatCard(value);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!/^[А-Яа-яA-Za-z\s]+$/.test(form.name.trim())) errors.name = 'Только буквы';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Некорректный email';
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.card)) errors.card = 'Формат 0000 1111 2222 3333';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiration)) errors.expiration = 'Формат MM/YY';
    if (!/^\d{3}$/.test(form.cvv)) errors.cvv = '3 цифры';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/bookings/${bookingId}/pay/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });
      setIsPaid(true);
      setTimeout(() => navigate('/'), 3000);
    } catch {
      setError('Ошибка при оплате. Повторите позже.');
    }
  };

  if (error) return <div className="payment-page"><p>{error}</p></div>;
  if (!booking || !hall) return <div className="payment-page"><p>Загрузка...</p></div>;

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Оплата бронирования</h2>
        <p><strong>Мероприятие:</strong> {booking.event_name}</p>
        <p><strong>Зал:</strong> {hall.name}</p>
        <p><strong>Сумма:</strong> {hall.price || 0} сом</p>

        {!isPaid ? (
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
              placeholder="Номер карты"
              maxLength={19}
              value={form.card}
              onChange={(e) => handleChange('card', e.target.value)}
              className={formErrors.card ? 'input-error' : ''}
            />
            {formErrors.card && <div className="error-msg">{formErrors.card}</div>}

            <div className="row">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={form.expiration}
                onChange={(e) => handleChange('expiration', e.target.value)}
                className={formErrors.expiration ? 'input-error' : ''}
              />
              <input
                type="text"
                placeholder="CVV"
                maxLength={3}
                value={form.cvv}
                onChange={(e) => handleChange('cvv', e.target.value)}
                className={formErrors.cvv ? 'input-error' : ''}
              />
            </div>
            {formErrors.expiration && <div className="error-msg">{formErrors.expiration}</div>}
            {formErrors.cvv && <div className="error-msg">{formErrors.cvv}</div>}

            <button className="pay-btn" onClick={handlePay}>💳 Оплатить</button>
          </div>
        ) : (
          <div className="payment-success">✅ Оплата прошла успешно!</div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
