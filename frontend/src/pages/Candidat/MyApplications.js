import React, { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/applications/my") // backend
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">📑 Mes Candidatures</h2>
      <ul>
        {applications.map(app => (
          <li key={app.id} className="border-b py-2">
            Offre : {app.offer_title} | Statut : {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyApplications;
