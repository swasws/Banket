import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';

function Chat() {
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!bookingId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://127.0.0.1:8000/api/messages/?booking=${bookingId}`, {
          headers: { Authorization: `Token ${token}` }
        });
        setMessages(response.data);
      } catch (err) {
        console.error('Ошибка при получении сообщений:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleSend = async () => {
    if (!bookingId || !newMessage.trim()) {
      console.warn('bookingId или сообщение отсутствует');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://127.0.0.1:8000/api/messages/',
        {
          booking: bookingId,
          text: newMessage
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setNewMessage('');
      // моментально подгружаем новое сообщение
      const response = await axios.get(`http://127.0.0.1:8000/api/messages/?booking=${bookingId}`, {
        headers: { Authorization: `Token ${token}` }
      });
      setMessages(response.data);

    } catch (err) {
      console.error('Ошибка при отправке:', err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Чат по бронированию #{bookingId}</h2>
      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        minHeight: '300px',
        marginBottom: '10px',
        background: '#f8f8f8',
        borderRadius: '8px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender_username}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <textarea
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Введите сообщение..."
        rows={3}
        style={{ width: '100%', padding: '10px', borderRadius: '6px' }}
      />
      <button onClick={handleSend} style={{ marginTop: '10px', padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px' }}>
        Отправить
      </button>
    </div>
  );
}

export default Chat;
