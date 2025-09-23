import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages Candidat
import CandidatProfile from "./pages/Candidat/CandidatProfile";
import OffresList from "./pages/Candidat/OffresList";
import MesCandidatures from "./pages/Candidat/MesCandidatures";

// Pages Employeur
import EmployeurProfile from "./pages/Employeur/EmployeurProfile";
import PublierOffre from "./pages/Employeur/PublierOffre";
import OffresGerees from "./pages/Employeur/OffresGerees";
import CandidaturesRecues from "./pages/Employeur/CandidaturesRecues";

// Auth
import Login from "./components/login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidat */}
        <Route path="/candidat/profile" element={<PrivateRoute role="candidat"><CandidatProfile /></PrivateRoute>} />
        <Route path="/candidat/offres" element={<PrivateRoute role="candidat"><OffresList /></PrivateRoute>} />
        <Route path="/candidat/candidatures" element={<PrivateRoute role="candidat"><MesCandidatures /></PrivateRoute>} />

        {/* Employeur */}
        <Route path="/employeur/profile" element={<PrivateRoute role="employeur"><EmployeurProfile /></PrivateRoute>} />
        <Route path="/employeur/publier" element={<PrivateRoute role="employeur"><PublierOffre /></PrivateRoute>} />
        <Route path="/employeur/offres" element={<PrivateRoute role="employeur"><OffresGerees /></PrivateRoute>} />
        <Route path="/employeur/candidatures" element={<PrivateRoute role="employeur"><CandidaturesRecues /></PrivateRoute>} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Login />} />
      // Candidat
<Route
  path="/candidat/candidatures"
  element={<PrivateRoute role="candidat"><MesCandidatures /></PrivateRoute>}
/>

// Employeur
<Route
  path="/employeur/candidatures"
  element={<PrivateRoute role="employeur"><CandidaturesRecues /></PrivateRoute>}
/>
      </Routes>
    </Router>
  );
}

export default App;
