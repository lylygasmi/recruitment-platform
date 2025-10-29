import React, { useState, useEffect } from "react";
import axios from "axios";

const OffresDetailCandidat = ({ offerId }) => {
  const [offer, setOffer] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Récupérer les détails de l'offre
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`/api/job_offers/${offerId}`);
        setOffer(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffer();
  }, [offerId]);

  const handleFileChange = (e) => setCvFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setMessage("❌ Veuillez sélectionner un CV");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("offer_id", offerId);
    formData.append("required_skills", offer.technologies.join(","));

    try {
      const res = await axios.post("/api/candidature/postuler-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Erreur serveur");
    }
  };

  if (!offer) return <div>Chargement...</div>;

  return (
    <div>
      <h2>{offer.title}</h2>
      <p>{offer.description}</p>
      <p><b>Compétences requises :</b> {offer.technologies.join(", ")}</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit">Postuler</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OffresDetailCandidat;
