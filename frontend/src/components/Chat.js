import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';

function Chat() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    setCurrentUserId(parseInt(localStorage.getItem('userId'), 10));

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setBookingInfo(res.data);
      } catch (err) {
        console.error('Ошибка при получении информации о бронировании:', err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://127.0.0.1:8000/api/messages/?booking=${bookingId}`, {
          headers: { Authorization: `Token ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Ошибка при получении сообщений:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Умный автоскролл только если близко к низу
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/messages/`, {
        booking: bookingId,
        text: newMessage,
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setNewMessage('');
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
    }
  };

  const formatTimestamp = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
           date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{bookingInfo ? `Чат зала: ${bookingInfo.hall_name}` : 'Загрузка...'}</h2>
      </div>

      <div className="chat-messages" ref={chatRef}>
        {messages.map(msg => {
          const senderId = typeof msg.sender === 'object' ? msg.sender.id : msg.sender;
          const isOwn = senderId === currentUserId;
          return (
            <div key={msg.id} className={`chat-bubble ${isOwn ? 'own' : 'other'}`}>
              <div className="chat-text">{msg.text}</div>
              <div className="chat-meta">
                <span className="chat-user">{msg.sender_username}</span>
                <span className="chat-time">{formatTimestamp(msg.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-textarea"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          rows={2}
          autoFocus
        />
        <button className="chat-send" onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
}

export default Chat;
