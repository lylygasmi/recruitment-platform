import React from "react";

function ApplicationList({ applications }) {
  return (
    <ul>
      {applications.map((app, idx) => (
        <li key={idx}>
          {app.name} – CV: {app.cv}
        </li>
      ))}
    </ul>
  );
}

export default ApplicationList;
