import React from "react";

function OfferList({ offers, onSelect }) {
  return (
    <ul>
      {offers.map((offer) => (
        <li key={offer.id} onClick={() => onSelect(offer)}>
          <b>{offer.title}</b> - {offer.description}
        </li>
      ))}
    </ul>
  );
}

export default OfferList;
