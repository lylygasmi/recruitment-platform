import React, { useEffect, useState } from "react";
import axios from "axios";

function ApplicationsReceived() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/applications/received") // backend
      .then(res => setApplications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">📥 Candidatures reçues</h2>
      <ul>
        {applications.map(app => (
          <li key={app.id} className="border-b py-2">
            {app.candidate_name} - {app.cv}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApplicationsReceived;
