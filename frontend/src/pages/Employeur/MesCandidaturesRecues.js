import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesCandidaturesRecues = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/applications/received', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualiser la liste
      setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Mes candidatures reçues</h2>
      {applications.map(app => (
        <div key={app.id}>
          <p>Candidat: {app.candidate?.name}</p>
          <p>Offre: {app.job_offer?.title}</p>
          <p>Statut: {app.status}</p>
          <button onClick={() => handleStatusChange(app.id, 'acceptée')}>Accepter</button>
          <button onClick={() => handleStatusChange(app.id, 'refusée')}>Refuser</button>
        </div>
      ))}
    </div>
  );
};

export default MesCandidaturesRecues;
