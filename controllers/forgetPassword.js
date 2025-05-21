const User = require('../model/userModel')
const { Resend } = require ("resend");
const { verificationHtml } = require('../utils/sendEmail');

const resend = new Resend("re_VAT37vpi_9PAbhEjGgE4Tvjy8jewTCyBr");

const forgetPassword = async (req ,res ) =>{
     
    const {email } = req.body
    console.log(email)
    if(!email){
        return res.status(400).json({ error:"velleiz ajouter votre email" });
    }
  const user = await User.findOne({ email });
  console.log(user);
  
  if (!user) return res.status(400).json({ message: "utilisateur non trouver" });

const { data, error } = await resend.emails.send({
    from: "SenRapport <hello@sunueducation.com>",
    to: ["tndeyeamie456@gmail.com"],
    subject: "Bienvenue a SenRapport",
    html: verificationHtml({name : user.prenom , url: "http://localhost:5173/reinitialisermdp"})
  });

  if (error) {
    return res.status(400).json({ error });

  }

  res.status(200).json({ message :"Veillez votre email" });


}

module.exports = {
    forgetPassword
}
