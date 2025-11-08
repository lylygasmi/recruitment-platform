import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MesCandidaturesEnvoyees = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <h2>Mes candidatures envoyées</h2>
      {applications.map(app => (
        <div key={app.id}>
          <p>Offre: {app.job_offer?.title}</p>
          <p>Statut: {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MesCandidaturesEnvoyees;
