import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

// Auth components
import Login from "./components/login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

// Auth pages
import ConfirmEmail from "./pages/ConfirmEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifySuccess from "./pages/VerifySuccess";

// Pages Candidat
import CandidatProfile from "./pages/Candidat/CandidatProfile";
// ✅ Nouveau composant pour afficher toutes les offres avec détails
import OffresDetailCandidat from "./pages/Candidat/OffresDetailCandidat";
import MesCandidaturesEnvoyees from "./pages/Candidat/MesCandidaturesEnvoyees";

// Pages Employeur
import EmployeurProfile from "./pages/Employeur/EmployeurProfile";
import PublierOffre from "./pages/Employeur/PublierOffre";
import OffresGerees from "./pages/Employeur/OffresGerees";
import MesCandidaturesRecues from "./pages/Employeur/MesCandidaturesRecues";

function AppWrapper() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-success" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/confirm/");

  return (
    <>
      {!hideNavbar && token && (
        <AppBar position="static" sx={{ backgroundColor: "#1877F2" }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
              {role === "candidat" && (
                <>
                  <Button component={Link} to="/candidat/profile" color="inherit">Profil</Button>
                  <Button component={Link} to="/candidat/offres" color="inherit">Offres</Button>
                  <Button component={Link} to="/candidat/candidatures" color="inherit">Candidatures</Button>
                </>
              )}

              {role === "employeur" && (
                <>
                  <Button component={Link} to="/employeur/profile" color="inherit">Profil</Button>
                  <Button component={Link} to="/employeur/publier" color="inherit">Publier Offre</Button>
                  <Button component={Link} to="/employeur/offres" color="inherit">Mes Offres</Button>
                  <Button component={Link} to="/employeur/candidatures" color="inherit">Candidatures reçues</Button>
                </>
              )}
            </Box>

            {role && (
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/confirm/:token" element={<ConfirmEmail />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* Candidat */}
        <Route path="/candidat/profile" element={<PrivateRoute role="candidat"><CandidatProfile /></PrivateRoute>} />
        <Route path="/candidat/offres" element={<PrivateRoute role="candidat"><OffresDetailCandidat /></PrivateRoute>} />
        <Route path="/candidat/candidatures" element={<PrivateRoute role="candidat"><MesCandidaturesEnvoyees /></PrivateRoute>} />

        {/* Employeur */}
        <Route path="/employeur/profile" element={<PrivateRoute role="employeur"><EmployeurProfile /></PrivateRoute>} />
        <Route path="/employeur/publier" element={<PrivateRoute role="employeur"><PublierOffre /></PrivateRoute>} />
        <Route path="/employeur/offres" element={<PrivateRoute role="employeur"><OffresGerees /></PrivateRoute>} />
        <Route path="/employeur/candidatures" element={<PrivateRoute role="employeur"><MesCandidaturesRecues /></PrivateRoute>} />

        {/* Route fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
