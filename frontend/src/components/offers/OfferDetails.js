import React from "react";

function OfferDetails({ offer }) {
  if (!offer) return <p>Sélectionnez une offre pour voir les détails.</p>;

  return (
    <div>
      <h3>{offer.title}</h3>
      <p>{offer.description}</p>
    </div>
  );
}

export default OfferDetails;
