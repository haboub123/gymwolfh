import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et a le rôle approprié
    const checkAuthorization = () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          setIsAuthorized(false);
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Si aucun rôle n'est spécifié, la route est accessible à tout utilisateur connecté
        if (!allowedRoles.length) {
          setIsAuthorized(true);
          return;
        }
        
        // Vérifier si l'utilisateur a un des rôles autorisés
        const hasPermission = allowedRoles.includes(user.role);
        setIsAuthorized(hasPermission);
      } catch (error) {
        console.error('Erreur lors de la vérification d\'autorisation:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthorization();
  }, [allowedRoles]);
  
  if (isLoading) {
    // Afficher un indicateur de chargement pendant la vérification
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si non autorisé
  if (!isAuthorized) {
    // Stocker l'URL actuelle pour rediriger après connexion
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/auth/login" replace />;
  }
  
  // Afficher le composant enfant si autorisé
  return children;
};

export default ProtectedRoute;