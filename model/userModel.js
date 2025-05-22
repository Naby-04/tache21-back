const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 🧠 Définition du schéma utilisateur
const UserSchema = new mongoose.Schema(
  {
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Empêche deux utilisateurs d'avoir le même email
      lowercase: true, // Convertit automatiquement les emails en minuscule
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // 📸 Photo de profil avec une image par défaut hébergée sur Cloudinary
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dcidine0f/image/upload/c_auto,g_auto,h_500,w_500/v1747757957/uploads/userProfil.JPG",
    },
    // 🔐 Pour réinitialiser le mot de passe
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true } // Crée createdAt et updatedAt automatiquement
);

// 🔑 Générer un token JWT (pour login)
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "90d" } // Expire après 90 jours
  );
};

// 🔍 Vérifie que le mot de passe entré correspond au mot de passe haché
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔒 Avant de sauvegarder : hacher le mot de passe si modifié
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Si le mot de passe n'a pas changé, on continue
  }

  const salt = await bcrypt.genSalt(10); // Génère un sel pour le hachage
  this.password = await bcrypt.hash(this.password, salt); // Hash du mot de passe
});

module.exports = mongoose.model("User", UserSchema);
