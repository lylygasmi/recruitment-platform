import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/offers") // backend
      .then(res => setOffers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">📌 Mes Offres</h2>
      <ul>
        {offers.map(offer => (
          <li key={offer.id} className="border-b py-2">
            {offer.title} - {offer.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageOffers;
