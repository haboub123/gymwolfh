import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './navbar/Navbar'; // Ajout de la navbar principale

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user")) || { _id: null, role: null };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!currentUser._id || !currentUser.role) {
                    throw new Error("Utilisateur non connecté");
                }
                const response = await axios.get("http://localhost:5000/notification/getAllNotifications", {
                    params: { userId: currentUser._id, role: currentUser.role },
                    withCredentials: true,
                });
                setNotifications(response.data.notifications || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [currentUser._id, currentUser.role]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(
                `http://localhost:5000/notification/updateNotification/${notificationId}`,
                { statut: "lu" },
                { withCredentials: true }
            );
            setNotifications(notifications.map(n =>
                n._id === notificationId ? { ...n, statut: "lu" } : n
            ));
        } catch (err) {
            console.error("Erreur lors du marquage comme lu:", err);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">Erreur : {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Mes Notifications</h1>
                {notifications.length === 0 ? (
                    <p className="text-gray-400">Aucune notification pour le moment.</p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-4 rounded-lg shadow-md ${
                                    notification.statut === "non lu" ? "bg-blue-100" : "bg-gray-100"
                                }`}
                            >
                                <p className="text-lg">{notification.contenu}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(notification.dateEnvoi).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">Destiné à : {notification.roleCible}</p>
                                {notification.statut === "non lu" && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Marquer comme lu
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;