import React, { useState } from 'react';
import axios from 'axios';

const UploadCV = () => {
  const [file, setFile] = useState(null);

  const handleChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/cvs/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert('Erreur lors du téléchargement du CV');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleChange} />
      <button type="submit">Uploader le CV</button>
    </form>
  );
};

export default UploadCV;
