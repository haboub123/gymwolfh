const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema(
  {
    note: { 
      type: Number, 
      min: 1, 
      max: 5,
      // Ajout d'une validation avec message personnalisé
      validate: {
        validator: function(v) {
          return v >= 1 && v <= 5;
        },
        message: 'La note doit être comprise entre 1 (très faible) et 5 (excellent)'
      }
    },
    commentaire: String,
    date: Date,
    isShared: { type: Boolean, default: false },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seance",
    },
  },
  { timestamps: true }
);

// Méthode pour obtenir le label de la note
AvisSchema.methods.getNoteLabel = function() {
  const labels = {
    1: "Très faible",
    2: "Faible", 
    3: "Correct",
    4: "Bien",
    5: "Excellent"
  };
  return labels[this.note] || "Non défini";
};

const Avis = mongoose.model("Avis", AvisSchema);
module.exports = Avis;