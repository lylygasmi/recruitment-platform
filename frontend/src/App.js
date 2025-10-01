import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

// Pages Candidat
import CandidatProfile from "./pages/Candidat/CandidatProfile";
import OffresList from "./pages/Candidat/OffresList";
import MesCandidaturesEnvoyees from "./pages/Candidat/MesCandidaturesEnvoyees";
import UploadCV from "./pages/Candidat/UploadCV";
import MesCVs from "./pages/Candidat/MesCVs";

// Pages Employeur
import EmployeurProfile from "./pages/Employeur/EmployeurProfile";
import PublierOffre from "./pages/Employeur/PublierOffre";
import OffresGerees from "./pages/Employeur/OffresGerees";
import MesCandidaturesRecues from "./pages/Employeur/MesCandidaturesRecues";

// Auth
import Login from "./components/login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

function AppWrapper() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // 🔥 On cache la navbar si on est sur /login ou /register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && token && (
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
              {role === "candidat" && (
                <>
                  <Button component={Link} to="/candidat/profile" color="inherit">Profil</Button>
                  <Button component={Link} to="/candidat/offres" color="inherit">Offres</Button>
                  <Button component={Link} to="/candidat/candidatures" color="inherit">Candidatures</Button>
                  <Button component={Link} to="/candidat/upload-cv" color="inherit">Uploader CV</Button>
                  <Button component={Link} to="/candidat/mes-cvs" color="inherit">Mes CVs</Button>
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
            {role && <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>}
          </Toolbar>
        </AppBar>
      )}

      {/* Routes */}
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidat */}
        <Route path="/candidat/profile" element={<PrivateRoute role="candidat"><CandidatProfile /></PrivateRoute>} />
        <Route path="/candidat/offres" element={<PrivateRoute role="candidat"><OffresList /></PrivateRoute>} />
        <Route path="/candidat/candidatures" element={<PrivateRoute role="candidat"><MesCandidaturesEnvoyees /></PrivateRoute>} />
        <Route path="/candidat/upload-cv" element={<PrivateRoute role="candidat"><UploadCV /></PrivateRoute>} />
        <Route path="/candidat/mes-cvs" element={<PrivateRoute role="candidat"><MesCVs /></PrivateRoute>} />

        {/* Employeur */}
        <Route path="/employeur/profile" element={<PrivateRoute role="employeur"><EmployeurProfile /></PrivateRoute>} />
        <Route path="/employeur/publier" element={<PrivateRoute role="employeur"><PublierOffre /></PrivateRoute>} />
        <Route path="/employeur/offres" element={<PrivateRoute role="employeur"><OffresGerees /></PrivateRoute>} />
        <Route path="/employeur/candidatures" element={<PrivateRoute role="employeur"><MesCandidaturesRecues /></PrivateRoute>} />

        {/* Redirection par défaut */}
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
