import React, { useState } from 'react';
import axios from 'axios';

function AdminMaqalDrop({ username }) {
  const [sentence, setSentence] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/maqal/add', {
        username,
        sentence,
      });
      console.log(response.data);
      alert('News added successfully');
      setSentence('');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('Error adding news');
    }
  };

  return (
    <div className="admin-page">
      <h1>Welcome, Admin!</h1>
      <p>You have administrative privileges.</p>
      <form className="news-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Type your sentence here"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
        ></textarea>
        <button type="submit">Add Level</button>
      </form>
    </div>
  );
}

export default AdminMaqalDrop;
