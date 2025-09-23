import React, { useEffect, useState } from "react";
import axios from "axios";

function CandidaturesRecues() {
  const [candidatures, setCandidatures] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/candidatures/reçues", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCandidatures(Array.isArray(res.data) ? res.data : []));
  }, [token]);

  if (candidatures.length === 0) return <p>Aucune candidature reçue</p>;

  return (
    <div>
      <h2>Candidatures Reçues</h2>
      {candidatures.map(c => (
        <div key={c.id}>
          <p>Candidat: {c.candidate_email}</p>
          <p>Offre: {c.offer_title}</p>
          <p>Date: {new Date(c.date_posted).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default CandidaturesRecues;
