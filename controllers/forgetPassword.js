// const User = require('../model/userModel')
// const { Resend } = require ("resend");
// const { verificationHtml } = require('../utils/sendEmail');

// const resend = new Resend("re_VAT37vpi_9PAbhEjGgE4Tvjy8jewTCyBr");
// const forgetPassword = async (req ,res ) =>{
     
//     const {email } = req.body
//     console.log(email)
//     if(!email){
//         return res.status(400).json({ error:"velleiz ajouter votre email" });
//     }
//   const user = await User.findOne({ email });
//   console.log(user);
  
//   if (!user) return res.status(400).json({ message: "utilisateur non trouver" });

// const { data, error } = await resend.emails.send({
//     from: "SenRapport <hello@sunueducation.com>",
//     to: ["tndeyeamie456@gmail.com"],
//     subject: "Bienvenue a SenRapport",
//     html: verificationHtml({name : user.prenom , url: "http://localhost:5173/reinitialisermdp"})
//   });

//   if (error) {
//     return res.status(400).json({ error });

//   }

//   res.status(200).json({ message :"Veillez votre email" });


// }

// module.exports = {
//     forgetPassword
// }


const User = require('../model/userModel');
const { v4: uuidv4 } = require("uuid");
const { Resend } = require("resend");
const bcrypt = require("bcrypt");
const { verificationHtml } = require('../utils/sendEmail');

const resend = new Resend("re_VAT37vpi_9PAbhEjGgE4Tvjy8jewTCyBr");

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Veuillez ajouter votre email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    const resetToken = uuidv4();
    const expiration = Date.now() + 3600000; // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetLink = `http://localhost:5173/reinitialisermdp/${resetToken}`;

    const { error } = await resend.emails.send({
      from: "SenRapport <hello@sunueducation.com>",
      to: ["planimportant@gmail.com"],
      subject: "Réinitialisation de mot de passe - SenRapport",
      html: verificationHtml({ name: user.prenom, url: resetLink }),
    });

    if (error) {
      console.error("Erreur EmailJS:", error);
      return res.status(400).json({ error: "Échec d'envoi d'email." });
    }

    res.status(200).json({ message: "Lien de réinitialisation envoyé. Vérifiez votre email." });
  } catch (err) {
    console.error("Erreur dans forgetPassword:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("Token reçu :", token);
    console.log("Nouveau mot de passe reçu :", newPassword);

    if (!newPassword) {
      console.log("Erreur : Aucun mot de passe fourni.");
      return res.status(400).json({ message: "Mot de passe requis." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Erreur : Token invalide ou expiré.");
      return res.status(400).json({ message: "Lien invalide ou expiré." });
    }

    console.log("Utilisateur trouvé :", user.email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("Mot de passe hashé :", hashedPassword);

   user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    console.log("Mot de passe mis à jour avec succès pour :", user.email);
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  forgetPassword,
  resetPassword,
};
