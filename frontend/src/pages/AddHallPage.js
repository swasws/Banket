import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddHallPage.css';

function AddHallPage() {
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
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/cities/', {
          headers: { Authorization: `Token ${token}` }
        });
        setCities(response.data);
      } catch (err) {
        setError('Ошибка при загрузке списка городов.');
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Нет авторизации! Сначала войдите.');
        return;
      }

      const data = new FormData();
      for (const key in formData) {
        if (key === 'service') {
          data.append(key, formData[key].toString());
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) data.append('image', image);

      await axios.post('http://127.0.0.1:8000/api/halls/', data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Зал успешно добавлен!');
      setFormData({
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
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setError('Ошибка при добавлении зала');
    }
  };

  return (
    <div className="add-hall-container">
      <h2>Добавить Зал</h2>
      <form className="add-hall-form" onSubmit={handleSubmit}>
        <label>Название:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Описание:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Изображение:</label>
        <input type="file" onChange={handleImageChange} />
        {imagePreview && (
          <div className="preview-image-wrapper">
            <p>Превью изображения:</p>
            <img src={imagePreview} alt="preview" className="preview-image" />
          </div>
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

        <button type="submit">Добавить</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
}

export default AddHallPage;
