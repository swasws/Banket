// src/pages/HallDetailPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './HallDetailPage.css';

function HallDetailPage() {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem('userId'), 10);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hallRes, commentsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/halls/${id}/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`http://127.0.0.1:8000/api/comments/?hall=${id}`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);
        setHall(hallRes.data);
        setComments(commentsRes.data);
      } catch {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const reloadComments = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/comments/?hall=${id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setComments(res.data);
    } catch {
      console.error('Ошибка обновления комментариев');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://127.0.0.1:8000/api/comments/`, {
        hall: id,
        text: newComment,
      }, {
        headers: { Authorization: `Token ${token}` },
      });

      setNewComment('');
      reloadComments();
    } catch {
      alert('Не удалось отправить комментарий');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const handleEditSubmit = async (commentId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/comments/${commentId}/`, {
        text: editingText,
      }, {
        headers: { Authorization: `Token ${token}` },
      });
      setEditingCommentId(null);
      setEditingText('');
      reloadComments();
    } catch {
      alert('Ошибка при редактировании');
    }
  };

  if (loading) return <p className="detail-loading">Загрузка...</p>;
  if (error) return <p className="detail-error">{error}</p>;
  if (!hall) return <p className="detail-empty">Нет данных.</p>;

  const imageUrl = hall.image?.startsWith('http')
    ? hall.image
    : `http://127.0.0.1:8000${hall.image}`;

  return (
    <div className="detail-wrapper">
      <div className="detail-header">
        <h1 className="detail-title">{hall.name}</h1>
        <p className="detail-address">{hall.address}</p>
      </div>

      {hall.image && (
        <div className="detail-image-container">
          <img src={imageUrl} alt={hall.name} className="detail-image" />
        </div>
      )}

      <div className="detail-section">
        <h2>Описание</h2>
        <p>{hall.description || '—'}</p>
      </div>

      <div className="detail-section">
        <h2>Основные характеристики</h2>
        <div className="features-grid">
          <div className="feature-card">
            <strong>Цена</strong>
            <p>{hall.price ? `${hall.price} сом` : '—'}</p>
          </div>
          <div className="feature-card">
            <strong>Алкоголь</strong>
            <p>{hall.alcohol_option === 'allowed' ? 'Разрешено' : 'Запрещено'}</p>
          </div>
          <div className="feature-card">
            <strong>Вместимость</strong>
            <p>{hall.capacity_min} – {hall.capacity_max}</p>
          </div>
          <div className="feature-card">
            <strong>Еда</strong>
            <p>{hall.food_option === 'venue' ? 'От заведения' : 'Своя'}</p>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Дополнительные сведения</h2>
        <ul className="detail-extra-list">
          <li><strong>Теги:</strong> {hall.tags || '—'}</li>
          <li><strong>Мероприятия:</strong> {hall.event_types || '—'}</li>
          <li><strong>Обслуживание:</strong> {hall.service ? 'Есть' : 'Нет'}</li>
          <li><strong>Правила:</strong> {hall.rules || '—'}</li>
        </ul>
      </div>

      <div className="detail-button-wrapper">
        <Link to={`/halls/${hall.id}/book`}>
          <button className="detail-book-button">Забронировать</button>
        </Link>
      </div>

      <div className="comment-section">
        <h2>Отзывы клиентов</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            rows={3}
          />
          <button type="submit" className="comment-submit">Отправить</button>
        </form>

        <div className="comment-list">
          {comments.map((comment) => {
            const isAuthor = comment.user === userId;
            const isOwner = hall.owner === userId;
            const isEditing = editingCommentId === comment.id;

            return (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <strong>{comment.user_username}</strong>
                  <span>{new Date(comment.created_at).toLocaleString()}</span>
                  {(isAuthor || isOwner) && (
                    <div className="comment-actions">
                      <button
                        className="dots-button"
                        onClick={() => setShowDropdownId(prev => prev === comment.id ? null : comment.id)}
                      >⋮</button>
                      {showDropdownId === comment.id && (
                        <div className="comment-dropdown">
                          {isAuthor && (
                            <button onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingText(comment.text);
                              setShowDropdownId(null);
                            }}>Изменить</button>
                          )}
                          <button onClick={() => handleDelete(comment.id)}>Удалить</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="edit-form">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows={3}
                    />
                    <button onClick={() => handleEditSubmit(comment.id)}>Сохранить</button>
                  </div>
                ) : (
                  <p>{comment.text}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HallDetailPage;
