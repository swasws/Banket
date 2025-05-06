import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('pending');
  const token = localStorage.getItem('authToken');
  const userId = parseInt(localStorage.getItem('userId'), 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hallsRes = await axios.get('http://127.0.0.1:8000/api/halls/', {
          headers: { Authorization: `Token ${token}` }
        });
        const myHalls = hallsRes.data.filter(h => h.owner === userId);
        let bookingsData = [];

        for (const hall of myHalls) {
          const res = await axios.get(`http://127.0.0.1:8000/api/bookings/by-hall/${hall.id}/`, {
            headers: { Authorization: `Token ${token}` }
          });
          res.data.forEach(b =>
            bookingsData.push({ ...b, hall_name: hall.name, hall_image: hall.image })
          );
        }

        // Сортировка по дате (новые заявки первыми)
        bookingsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBookings(bookingsData);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      }
    };

    fetchData();
  }, []);

  const handleEnablePayment = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/bookings/${id}/enable-payment/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, is_payment_enabled: true } : b)
      );
    } catch (err) {
      alert('Ошибка при разрешении оплаты.');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Отклонить бронь?')) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/bookings/${id}/reject/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b)
      );
    } catch (err) {
      alert('Ошибка при отклонении.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/bookings/${id}/approve/`, {}, {
        headers: { Authorization: `Token ${token}` }
      });

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'approved' } : b)
      );
    } catch (err) {
      alert('Ошибка при подтверждении.');
    }
  };

  return (
    <div className="owner-dashboard-container">
      <div className="top-actions-row">
        <div className="add-hall-block">
          <h2>Добавить новый зал</h2>
          <p>Хотите опубликовать новый зал? Укажите описание, вместимость, теги и фото — и начните получать заявки!</p>
          <Link to="/halls/add" className="add-hall-link">Добавить зал</Link>
        </div>

        <div className="my-halls-block">
          <h2>Мои залы</h2>
          <p>Посмотрите список всех ваших опубликованных залов. Вы можете управлять, редактировать или удалять их.</p>
          <Link to="/my-halls" className="my-halls-link">Перейти к списку</Link>
        </div>
      </div>

      <h2 className="section-title">Заявки на бронирование</h2>
      <div className="toggle-buttons">
        <button onClick={() => setView('pending')} className={view === 'pending' ? 'active' : ''}>Текущие заявки</button>
        <button onClick={() => setView('approved')} className={view === 'approved' ? 'active' : ''}>Одобренные</button>
        <button onClick={() => setView('rejected')} className={view === 'rejected' ? 'active' : ''}>Отклонённые</button>
      </div>

      <div className="booking-list">
        {bookings.filter(b => b.status === view).length === 0 ? (
          <div className="empty-placeholder">
            <img src="/images/empty.jpg" alt="Нет заявок" className="empty-img" />
            <h3>Пока нет заявок</h3>
            <p>Добавьте зал, чтобы начать получать бронирования от клиентов.</p>
          </div>
        ) : (
          bookings
            .filter(b => b.status === view)
            .map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <p><strong>Зал:</strong> {booking.hall_name}</p>
                  <p><strong>Название мероприятия: </strong>{booking.event_name}</p>
                  <p><strong>Время:</strong> {booking.date} в {booking.time}</p>
                  <p><strong>Описание:</strong> {booking.description || '—'}</p>
                  <p><strong>Вместимость:</strong> {booking.people_count} человек</p>
                  <p><strong>Статус:</strong> {booking.status}</p>

                  <div className="booking-buttons">
                    {booking.status === 'pending' && (
                      <>
                        <button className="btn btn-approve" onClick={() => handleApprove(booking.id)}>Подтвердить</button>
                        <button className="btn btn-reject" onClick={() => handleReject(booking.id)}>Отклонить</button>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <>
                        <button className="btn btn-reject" onClick={() => handleReject(booking.id)}>Отклонить</button>
                        <Link to={`/chat/${booking.id}`} className="btn btn-chat">Перейти в чат</Link>
                        {booking.is_paid ? (
                          <span className="paid">✅ Оплачено</span>
                        ) : booking.is_payment_enabled ? (
                          <span className="enabled">💰 Оплата разрешена</span>
                        ) : (
                          <button className="btn btn-pay" onClick={() => handleEnablePayment(booking.id)}>Разрешить оплату</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {booking.hall_image && (
                  <div className="booking-image">
                    <img src={booking.hall_image} alt="Фото зала" />
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
