import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages publiques
import Login from "./components/login"; // <-- Login devient Home
import Register from "./components/Register";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";

// Pages Candidat
import CandidatProfile from "./pages/Candidat/CandidatProfile";
import OffresDetailCandidat from "./pages/Candidat/OffresDetailCandidat";
import MesCandidaturesEnvoyees from "./pages/Candidat/MesCandidaturesEnvoyees";

// Pages Employeur
import EmployeurProfile from "./pages/Employeur/EmployeurProfile";
import PublierOffre from "./pages/Employeur/PublierOffre";
import OffresGerees from "./pages/Employeur/OffresGerees";
import MesCandidaturesRecues from "./pages/Employeur/MesCandidaturesRecues";

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil = Login */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />

        {/* Pages publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Vérification compte */}
        <Route path="/verify-account/:token" element={<VerifyAccountPage />} />

        {/* Routes Candidat */}
        <Route
          path="/candidat/profile"
          element={
            <PrivateRoute role="candidat">
              <CandidatProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidat/offres"
          element={
            <PrivateRoute role="candidat">
              <OffresDetailCandidat />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidat/candidatures"
          element={
            <PrivateRoute role="candidat">
              <MesCandidaturesEnvoyees />
            </PrivateRoute>
          }
        />

        {/* Routes Employeur */}
        <Route
          path="/employeur/profile"
          element={
            <PrivateRoute role="employeur">
              <EmployeurProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/employeur/publier"
          element={
            <PrivateRoute role="employeur">
              <PublierOffre />
            </PrivateRoute>
          }
        />
        <Route
          path="/employeur/offres"
          element={
            <PrivateRoute role="employeur">
              <OffresGerees />
            </PrivateRoute>
          }
        />
        <Route
          path="/employeur/candidatures"
          element={
            <PrivateRoute role="employeur">
              <MesCandidaturesRecues />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
