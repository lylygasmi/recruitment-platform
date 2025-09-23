import React, { useEffect, useState } from "react";
import axios from "axios";

function MesCandidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/candidatures/mes-candidatures", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCandidatures(Array.isArray(res.data) ? res.data : []));
  }, [token]);

  if (candidatures.length === 0) return <p>Aucune candidature envoyée</p>;

  return (
    <div>
      <h2>Mes Candidatures</h2>
      {candidatures.map(c => (
        <div key={c.id}>
          <p>Offre: {c.title}</p>
          <p>Description: {c.description}</p>
          <p>Lieu: {c.location}</p>
          <p>Type de contrat: {c.contract_type}</p>
          <p>Date: {new Date(c.date_posted).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default MesCandidatures;
