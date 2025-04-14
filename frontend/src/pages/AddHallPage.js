import React, { useState } from 'react';
import axios from 'axios';

function AddHallPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('');
  const [capacityMin, setCapacityMin] = useState('');
  const [capacityMax, setCapacityMax] = useState('');
  const [address, setAddress] = useState('');
  const [foodOption, setFoodOption] = useState('venue');    // 'venue' или 'own'
  const [alcoholOption, setAlcoholOption] = useState('allowed'); // 'allowed' или 'forbidden'
  const [eventTypes, setEventTypes] = useState('');
  // service: true = «есть», false = «нет»
  const [service, setService] = useState(false);
  const [rules, setRules] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
        const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Нет авторизации! Сначала войдите как Владелец.');
        return;
      }

      // Формируем FormData для отправки, чтобы передать файл
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) formData.append('image', image);
      formData.append('tags', tags);
      formData.append('price', price);
      formData.append('capacity_min', capacityMin);
      formData.append('capacity_max', capacityMax);
      formData.append('address', address);
      formData.append('food_option', foodOption);
      formData.append('alcohol_option', alcoholOption);
      formData.append('event_types', eventTypes);
      // Приводим булево к строке 'true' или 'false' (Django DRF распознает)
      formData.append('service', service.toString());
      formData.append('rules', rules);

      const response = await axios.post('http://127.0.0.1:8000/api/halls/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Зал создан:', response.data);
      setSuccess('Зал успешно добавлен!');
      // Очистим поля формы
      setName('');
      setDescription('');
      setImage(null);
      setTags('');
      setPrice('');
      setCapacityMin('');
      setCapacityMax('');
      setAddress('');
      setFoodOption('venue');
      setAlcoholOption('allowed');
      setEventTypes('');
      setService(false);
      setRules('');
    } catch (err) {
      console.error(err);
      setError('Ошибка при добавлении зала');
    }
  };

  return (
    <div>
      <h2>Добавить Зал</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название зала:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Изображение:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div>
          <label>Теги (через запятую):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label>Цена:</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Мин. вместимость:</label>
          <input
            type="number"
            value={capacityMin}
            onChange={(e) => setCapacityMin(e.target.value)}
          />
        </div>

        <div>
          <label>Макс. вместимость:</label>
          <input
            type="number"
            value={capacityMax}
            onChange={(e) => setCapacityMax(e.target.value)}
          />
        </div>

        <div>
          <label>Адрес:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label>Еда:</label>
          <select value={foodOption} onChange={(e) => setFoodOption(e.target.value)}>
            <option value="venue">От заведения</option>
            <option value="own">Своя</option>
          </select>
        </div>

        <div>
          <label>Алкоголь:</label>
          <select value={alcoholOption} onChange={(e) => setAlcoholOption(e.target.value)}>
            <option value="allowed">Разрешено</option>
            <option value="forbidden">Запрещено</option>
          </select>
        </div>

        <div>
          <label>Типы мероприятий (через запятую):</label>
          <input
            type="text"
            value={eventTypes}
            onChange={(e) => setEventTypes(e.target.value)}
          />
        </div>

        <div>
          <label>Обслуживание:</label>
          <select value={service ? 'yes' : 'no'}
                  onChange={(e) => setService(e.target.value === 'yes')}>
            <option value="yes">Есть</option>
            <option value="no">Нет</option>
          </select>
        </div>

        <div>
          <label>Правила:</label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />
        </div>

        <button type="submit">Добавить</button>
      </form>

      {error && <p style={{color:'red'}}>{error}</p>}
      {success && <p style={{color:'green'}}>{success}</p>}
    </div>
  );
}

export default AddHallPage;
