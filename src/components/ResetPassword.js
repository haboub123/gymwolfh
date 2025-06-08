import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Token récupéré depuis l\'URL:', token);
    if (!token) {
      setMessage('Token manquant dans l\'URL');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset message
    setMessage('');
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Envoi de la requête de réinitialisation...');
      console.log('Token utilisé:', token);
      console.log('URL:', `http://192.168.56.198:5000/users/reset-password`);
      
      const response = await fetch('http://192.168.56.198:5000/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        }),
        // Ajout de ces options pour CORS
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('Status de la réponse:', response.status);
      console.log('Headers de la réponse:', response.headers);

      const data = await response.json();
      console.log('Données reçues:', data);

      if (response.ok) {
        setMessage('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setMessage('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Réinitialiser le mot de passe</h2>
      
      {token ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword">Nouveau mot de passe:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser'}
          </button>
        </form>
      ) : (
        <p>Token manquant ou invalide</p>
      )}
      
      {message && (
        <div className={message.includes('succès') ? 'success' : 'error'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;