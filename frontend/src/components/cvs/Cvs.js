import React, { useState, useEffect } from "react";

function Cvs() {
  const [cvs, setCvs] = useState([]);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");

  // Charger tous les CVs depuis le backend
  useEffect(() => {
    fetch("http://localhost:3000/cvs")
      .then((res) => res.json())
      .then((data) => setCvs(data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  // Ajouter un nouveau CV
  const addCv = async (e) => {
    e.preventDefault();
    if (!name || !skills) return;

    const token = localStorage.getItem("token"); // si tu protèges la route

    const res = await fetch("http://localhost:3000/cvs", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // si auth requise
      },
      body: JSON.stringify({ name, skills }),
    });

    const newCv = await res.json();
    setCvs([...cvs, newCv]);
    setName("");
    setSkills("");
  };

  return (
    <div>
      <h2>Gestion des CVs</h2>

      {/* Formulaire pour ajouter un CV */}
      <form onSubmit={addCv}>
        <input
          type="text"
          placeholder="Nom du candidat"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Compétences (ex: React, Node.js)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />
        <button type="submit">Ajouter le CV</button>
      </form>

      {/* Liste des CVs */}
      <ul>
        {cvs.map((cv) => (
          <li key={cv.id}>
            <b>{cv.name}</b> – {cv.skills}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cvs;
