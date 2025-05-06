// src/pages/EditHallPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditHallPage.css';

function EditHallPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    price: '',
    capacity_min: '',
    capacity_max: '',
    address: '',
    food_option: 'venue',
    alcohol_option: 'allowed',
    event_types: '',
    service: false,
    rules: '',
    city: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const [hallRes, cityRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/halls/${id}/`, {
            headers: { Authorization: `Token ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/cities/', {
            headers: { Authorization: `Token ${token}` }
          })
        ]);

        setCities(cityRes.data);
        const data = hallRes.data;
        setFormData({
          name: data.name,
          description: data.description,
          tags: data.tags,
          price: data.price,
          capacity_min: data.capacity_min,
          capacity_max: data.capacity_max,
          address: data.address,
          food_option: data.food_option,
          alcohol_option: data.alcohol_option,
          event_types: data.event_types,
          service: data.service,
          rules: data.rules,
          city: data.city,
        });

        if (data.image) {
          const img = data.image.startsWith('http') ? data.image : `http://127.0.0.1:8000${data.image}`;
          setImagePreview(img);
        }
      } catch (err) {
        setError('Ошибка при загрузке данных зала.');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();
      for (const key in formData) {
        if (key === 'service') {
          data.append(key, formData[key].toString());
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) data.append('image', image);

      await axios.put(`http://127.0.0.1:8000/api/halls/${id}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/owner/dashboard');
    } catch (err) {
      setError('Ошибка при обновлении зала.');
    }
  };

  return (
    <div className="edit-hall-container">
      <h2 className="edit-hall-title">Редактировать Зал</h2>
      {error && <p className="edit-hall-error">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-hall-form">
        <label>Название:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Описание:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Изображение:</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="edit-hall-image-preview" />
        )}

        <label>Теги:</label>
        <input name="tags" value={formData.tags} onChange={handleChange} />

        <label>Цена:</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} />

        <label>Мин. вместимость:</label>
        <input name="capacity_min" type="number" value={formData.capacity_min} onChange={handleChange} />

        <label>Макс. вместимость:</label>
        <input name="capacity_max" type="number" value={formData.capacity_max} onChange={handleChange} />

        <label>Адрес:</label>
        <input name="address" value={formData.address} onChange={handleChange} />

        <label>Город:</label>
        <select name="city" value={formData.city} onChange={handleChange} required>
          <option value="">-- Выберите город --</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>

        <label>Еда:</label>
        <select name="food_option" value={formData.food_option} onChange={handleChange}>
          <option value="venue">От заведения</option>
          <option value="own">Своя</option>
        </select>

        <label>Алкоголь:</label>
        <select name="alcohol_option" value={formData.alcohol_option} onChange={handleChange}>
          <option value="allowed">Разрешено</option>
          <option value="forbidden">Запрещено</option>
        </select>

        <label>Типы мероприятий:</label>
        <input name="event_types" value={formData.event_types} onChange={handleChange} />

        <label>Обслуживание:</label>
        <select name="service" value={formData.service ? 'yes' : 'no'} onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value === 'yes' }))}>
          <option value="yes">Есть</option>
          <option value="no">Нет</option>
        </select>

        <label>Правила:</label>
        <textarea name="rules" value={formData.rules} onChange={handleChange} />

        <button type="submit" className="edit-hall-button">Сохранить</button>
      </form>
    </div>
  );
}

export default EditHallPage;
