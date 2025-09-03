import React, { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/applications")
      .then(res => res.json())
      .then(data => setApplications(data));
  }, []);

  return (
    <div>
      <h2>Mes Candidatures</h2>
      <ul>
        {applications.map((app, idx) => (
          <li key={idx}>
            Offre {app.offerId} – {app.name} ({app.cv})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyApplications;
