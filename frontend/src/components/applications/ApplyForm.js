import React, { useState } from "react";

function ApplyForm({ offerId, onApply }) {
  const [name, setName] = useState("");
  const [cv, setCv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply({ offerId, name, cv });
    setName("");
    setCv("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Lien vers votre CV"
        value={cv}
        onChange={(e) => setCv(e.target.value)}
        required
      />
      <button type="submit">Postuler</button>
    </form>
  );
}

export default ApplyForm;
