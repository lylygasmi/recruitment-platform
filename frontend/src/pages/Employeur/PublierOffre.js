import React, { useState } from 'react';
import axios from 'axios';

const PublierOffre = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    contract_type: '',
    speciality: '',
    salary: '',
    currency: 'DT',
    country: 'Tunisie',
    category: '',
    technologies: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // ton token JWT
      const res = await axios.post('http://localhost:3000/api/offers/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Erreur lors de la publication de l’offre');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Titre" value={formData.title} onChange={handleChange} />
      <input name="company" placeholder="Entreprise" value={formData.company} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <input name="location" placeholder="Lieu" value={formData.location} onChange={handleChange} />
      <input name="contract_type" placeholder="Type de contrat" value={formData.contract_type} onChange={handleChange} />
      <input name="speciality" placeholder="Spécialité" value={formData.speciality} onChange={handleChange} />
      <input name="salary" placeholder="Salaire" value={formData.salary} onChange={handleChange} />
      <input name="currency" placeholder="Devise" value={formData.currency} onChange={handleChange} />
      <input name="country" placeholder="Pays" value={formData.country} onChange={handleChange} />
      <input name="category" placeholder="Catégorie" value={formData.category} onChange={handleChange} />
      <input name="technologies" placeholder="Technologies" value={formData.technologies} onChange={handleChange} />
      <button type="submit">Publier l'offre</button>
    </form>
  );
};

export default PublierOffre;
