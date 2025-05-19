const User = require('../model/userModel')
const crypto = require("crypto");
// const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js"); // à créer juste après
const cookieParser = require("cookie-parser");
// const bcrypt = require("bcryptjs");


// creation d'un utilisateur
const createUsers = async (req, res) => {
    try {
        const { prenom, email, password , isAdmin} = req.body;

        // vérifier si l'utilisateur existe
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Email deja utilisé" });

        // const hashedPassword = await bcrypt.hash(password, 10);

        // creer l'utilisateur
        const user = await User.create({ prenom, email, password, isAdmin });

        // generer le token
        const token = user.generateToken();

        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          sameSite: "none",
          secure: true,
        })

        // renvoyer le token
        res.status(201).json({ 
             message: "Utilisateur créé",
             user: {
                 id: user._id,
                prenom,
                email,
                isAdmin
                } ,
                token
            });
            console.log("utilisateur créer", user);
            
    } catch (error) {
        console.error("erreur d'inscription", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

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

    if (req.body.password) {
      user.password = req.body.password;
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
  

  // Mot de passe oublier
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "Aucun utilisateur trouvé avec cet email" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`;
    const message = `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`;

    await sendEmail(email, "Réinitialisation de mot de passe", message);

    res.json({ status: "Succès", message: "Email de réinitialisation envoyé" });

  } catch (error) {
    console.error("Erreur dans forgotPassword :", error);
    res.status(500).json({ status: "Erreur serveur" });
  }
};

module.exports = forgotPassword;



    // Générer un token sécurisé
  //   const resetToken = crypto.randomBytes(32).toString("hex");
  //   const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  //   // Stocker dans le user
  //   user.resetPasswordToken = hashedToken;
  //   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  //   await user.save();

  //   // URL de réinitialisation (à ajuster selon ton frontend)
  //   const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  //   const message = `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`;

  //   await sendEmail(user.email, "Réinitialisation de mot de passe", message);

  //   res.json({ message: "Email de réinitialisation envoyé" });
  // } catch (error) {
  //   console.error("Erreur forgotPassword :", error);
  //   res.status(500).json({ message: "Erreur serveur" });
  // }



// reset password
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur resetPassword :", error);
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
     forgotPassword,
     resetPassword,
     logout
    }