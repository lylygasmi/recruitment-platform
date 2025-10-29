import React from "react";
import { useNavigate } from "react-router-dom";

const VerifySuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>✅ Votre compte a été vérifié avec succès !</h2>
      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1877F2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Aller à la page de connexion
      </button>
    </div>
  );
};

export default VerifySuccess;
