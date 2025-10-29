import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/confirm/${token}`);
        if (res.status === 200) {
          setStatus("success");
          setTimeout(() => navigate("/verify-success"), 2000);
        }
      } catch (err) {
        setStatus("error");
      }
    };
    confirmAccount();
  }, [token, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100"
    >
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
          <h2 className="text-xl text-gray-700 font-semibold">
            Vérification de votre compte en cours...
          </h2>
        </div>
      )}

      {status === "success" && (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-green-600 mb-2">
            🎉 Compte vérifié !
          </h2>
          <p className="text-gray-600">Redirection vers la page de succès...</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-red-500 mb-2">❌ Erreur</h2>
          <p className="text-gray-600">
            Le lien de vérification est invalide ou expiré.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmEmail;


