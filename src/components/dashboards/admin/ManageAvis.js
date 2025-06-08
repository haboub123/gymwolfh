// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ManageAvisPage = () => {
//   const [avisListe, setAvisListe] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingAvis, setEditingAvis] = useState(null); 
//   const [updatedNote, setUpdatedNote] = useState("");
//   const [updatedCommentaire, setUpdatedCommentaire] = useState("");
//   const [updatedDate, setUpdatedDate] = useState("");

//   useEffect(() => {
//     const fetchAvis = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const { data } = await axios.get("http://localhost:5000/avis/getAllAvis", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAvisListe(data.avisListe || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des avis:", error);
//         setLoading(false);
//       }
//     };
//     fetchAvis();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet avis?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/avis/deleteAvisById/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAvisListe(avisListe.filter((avis) => avis._id !== id));
//     } catch (error) {
//       console.error("Erreur lors de la suppression:", error);
//     }
//   };

//   const handleEdit = (avis) => {
//     setEditingAvis(avis._id);
//     setUpdatedNote(avis.note);
//     setUpdatedCommentaire(avis.commentaire);
//     setUpdatedDate(avis.date ? new Date(avis.date).toISOString().split("T")[0] : ""); // Format pour l'input date
//   };

//   const handleUpdate = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const updatedData = {};
//       if (updatedNote) updatedData.note = updatedNote;
//       if (updatedCommentaire) updatedData.commentaire = updatedCommentaire;
//       if (updatedDate) updatedData.date = new Date(updatedDate);

//       await axios.put(
//         `http://localhost:5000/avis/updateAvis/${id}`,
//         updatedData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setAvisListe(
//         avisListe.map((avis) =>
//           avis._id === id ? { ...avis, ...updatedData } : avis
//         )
//       );
//       setEditingAvis(null);
//       setUpdatedNote("");
//       setUpdatedCommentaire("");
//       setUpdatedDate("");
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingAvis(null);
//     setUpdatedNote("");
//     setUpdatedCommentaire("");
//     setUpdatedDate("");
//   };

//   if (loading) return <div className="text-center mt-10">Chargement...</div>;

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold mb-6">Gestion des Avis</h2>
//       {avisListe.length > 0 ? (
//         <div className="space-y-4">
//           {avisListe.map((avis) => (
//             <div key={avis._id} className="bg-white shadow rounded p-4">
//               {editingAvis === avis._id ? (
//                 <div className="space-y-2">
//                   <div>
//                     <label>Note (1-5) :</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="5"
//                       value={updatedNote}
//                       onChange={(e) => setUpdatedNote(e.target.value)}
//                       className="border p-1 ml-2"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label>Commentaire :</label>
//                     <textarea
//                       value={updatedCommentaire}
//                       onChange={(e) => setUpdatedCommentaire(e.target.value)}
//                       className="border p-1 w-full"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label>Date :</label>
//                     <input
//                       type="date"
//                       value={updatedDate}
//                       onChange={(e) => setUpdatedDate(e.target.value)}
//                       className="border p-1 ml-2"
//                     />
//                   </div>
//                   <div>
//                     <button
//                       onClick={() => handleUpdate(avis._id)}
//                       className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
//                     >
//                       Sauvegarder
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       className="bg-gray-500 text-white py-1 px-3 rounded"
//                     >
//                       Annuler
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <p><strong>Note :</strong> {avis.note}/5</p>
//                   <p><strong>Commentaire :</strong> {avis.commentaire}</p>
//                   <p><strong>Client :</strong> {avis.client?.nom || "Anonyme"}</p>
//                   <p><strong>Date :</strong> {new Date(avis.date).toLocaleDateString()}</p>
//                   <div className="mt-2">
//                     <button
//                       onClick={() => handleEdit(avis)}
//                       className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
//                     >
//                       Modifier
//                     </button>
//                     <button
//                       onClick={() => handleDelete(avis._id)}
//                       className="bg-red-500 text-white py-1 px-3 rounded"
//                     >
//                       Supprimer
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>Aucun avis disponible.</p>
//       )}
//     </div>
//   );
// };

// export default ManageAvisPage;