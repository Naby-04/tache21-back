const User = require('../model/userModel')
const crypto = require("crypto");
// const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const bcrypt = require("bcryptjs");
const cloudinary = require("../cloudinary");

const updateUserPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifie si un fichier a bien été envoyé
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image envoyée" });
    }

    // Envoie l'image vers Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "utilisateurs", // Dossier Cloudinary
      },
      async (error, result) => {
        if (error) {
          console.error("Erreur upload Cloudinary :", error);
          return res.status(500).json({ message: "Erreur upload Cloudinary" });
        }

        // Met à jour le champ profileImage
        user.profileImage = result.secure_url;
        const updatedUser = await user.save();

        res.json({
          message: "Image de profil mise à jour",
          profileImage: updatedUser.profileImage,
        });
      }
    );

    // Envoie le buffer du fichier à Cloudinary
    result.end(req.file.buffer);
  } catch (error) {
    console.error("Erreur mise à jour photo de profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// creation d'un utilisateur
const createUsers = async (req, res) => {
  try {
    const { prenom, email, password, isAdmin } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "Email déjà utilisé" });

    // Image par défaut
    const defaultImage = "https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg";

    // Crée l'utilisateur avec l'image par défaut
    const user = await User.create({
      prenom,
      email,
      password,
      isAdmin,
      profileImage: defaultImage,
    });

    // Génère le token
    const token = user.generateToken();

    // Envoie le cookie avec le token
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      sameSite: "none",
      secure: true,
    });

    // Réponse au client
    res.status(201).json({
      message: "Utilisateur créé",
      user: {
        id: user._id,
        prenom,
        email,
        isAdmin,
        profileImage: user.profileImage,
      },
      token,
    });

    console.log("Utilisateur créé :", user);
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
   
      // Chercher l'utilisateur
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  
      // Vérifier le mot de passe
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  
      // Générer le token
      const token = user.generateToken();
  
      // Renvoyer les infos utilisateur (sans le mot de passe)
      res.json({
        message: "Connexion réussie",
        user: {
          id: user._id,
          prenom: user.prenom,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        token,
      });
      console.log("utilisateur recuperér", user);
    } catch (error) {
      console.error("Erreur lors du login :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };

  const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Deconnexion avec success" });
  }
  
//GET users
const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      res.json(user);
    } catch (error) {
      console.error("Erreur récupération profil :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("Erreur récupération utilisateur par ID :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

  
//UPDATE
 const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Mise à jour uniquement du prénom et du mot de passe
    if (req.body.prenom) {
      user.prenom = req.body.prenom;
    }

    if (req.body.newPassword) {
  user.password = req.body.newPassword;
}


    const updatedUser = await user.save();
    const token = updatedUser.generateToken();

    res.json({
      message: "Profil mis à jour",
      user: {
        id: updatedUser._id,
        prenom: updatedUser.prenom,
        email: updatedUser.email, // affichage, mais non modifiable
        isAdmin: updatedUser.isAdmin,
        profileImage: updatedUser.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur mise à jour :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

   

//GET All users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password"); // sans les mots de passe
      res.json(users);
    } catch (error) {
      console.error("Erreur récupération des utilisateurs :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  


//DELETE   
const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      await user.deleteOne();
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  



 
module.exports = {
     createUsers ,
     loginUser,
     getUserProfile,
     getUserById, 
     updateUserProfile,
     getAllUsers,
     deleteUser,
     logout,
     updateUserPhoto,
    }