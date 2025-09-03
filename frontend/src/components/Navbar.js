import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/candidat/applications">Mes candidatures</Link> |{" "}
      <Link to="/candidat/cvs">Mes CVs</Link> |{" "}
      <Link to="/employeur/offres">Mes offres</Link> |{" "}
      <Link to="/employeur/candidatures">Candidatures reçues</Link>
    </nav>
  );
}

export default Navbar;
