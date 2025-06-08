import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import gymBackground from '../../assets/img/gym-background.jpg';
import { loginUser } from "../../services/apiUser";

export default function Connexion() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifierConnexion = () => {
      try {
        const utilisateur = JSON.parse(localStorage.getItem("user"));
        if (utilisateur) {
          if (utilisateur.role === "admin") {
            navigate("/dashboard/admin");
          } else if (utilisateur.role === "coach") {
            navigate("/dashboard/coach");
          } else if (utilisateur.role === "client") {
            navigate("/");
          }
        }
      } catch (erreur) {
        console.error("Erreur lors de la vérification du statut de connexion :", erreur);
        localStorage.removeItem("user");
      }
    };

    verifierConnexion();
  }, [navigate]);

  const gererChangementInput = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const gererSoumission = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!data.user) {
        throw new Error(data.message || "Échec de la connexion.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("jwt_token_9antra", data.token);

      const reservationEnAttente = sessionStorage.getItem("pendingReservation");

      if (reservationEnAttente) {
        setMessageSucces("Connexion réussie ! Finalisation de votre réservation...");
        setTimeout(() => {
          setChargement(false);
          navigate("/mes-reservations");
        }, 1500);
      } else {
        setMessageSucces("Connexion réussie !");
        setTimeout(() => {
          setChargement(false);
          const role = data.user.role;
          if (role === "admin") {
            navigate("/dashboard/admin");
          } else if (role === "coach") {
            navigate("/dashboard/coach");
          } else if (role === "client") {
            navigate("/");
          } else {
            throw new Error("Rôle inconnu.");
          }
        }, 1500);
      }
    } catch (erreur) {
      console.error("Erreur de connexion :", erreur);
      setErreur(erreur.message || "Une erreur s'est produite. Veuillez réessayer.");
      setChargement(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form">
          <h2 className="login-title">Connexion</h2>

          {erreur && <div className="error-message">{erreur}</div>}
          {messageSucces && <div className="success-message">{messageSucces}</div>}

          <form onSubmit={gererSoumission}>
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={gererChangementInput}
                disabled={chargement}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={gererChangementInput}
                disabled={chargement}
                required
              />
            </div>
            <div className="remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="checkbox"
                  checked={formData.rememberMe}
                  onChange={gererChangementInput}
                  disabled={chargement}
                />
                <span className="checkbox-text">Se souvenir de moi</span>
              </label>
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={chargement}
            >
              {chargement ? "CHARGEMENT..." : "SE CONNECTER"}
            </button>
          </form>
          <div className="links">
            <Link to="/auth/forget" className="link">Mot de passe oublié ?</Link>
            <Link to="/auth/register" className="link">Créer un compte</Link>
          </div>
        </div>
        <div className="image-section">
          <img src={gymBackground} alt="Image Salle de sport" className="gym-image" />
        </div>
      </div>
    </div>
  );
}
