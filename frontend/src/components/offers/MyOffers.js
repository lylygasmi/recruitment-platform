import React, { useEffect, useState } from "react";
import OfferForm from "./OfferForm";
import OfferList from "./OfferList";
import OfferDetails from "./OfferDetails";

function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/offers")
      .then(res => res.json())
      .then(data => setOffers(data));
  }, []);

  const addOffer = async (offer) => {
    const res = await fetch("http://localhost:3000/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offer),
    });
    const newOffer = await res.json();
    setOffers([...offers, newOffer]);
  };

  return (
    <div>
      <h2>Mes Offres</h2>
      <OfferForm onAdd={addOffer} />
      <OfferList offers={offers} onSelect={setSelectedOffer} />
      <OfferDetails offer={selectedOffer} />
    </div>
  );
}

export default MyOffers;
