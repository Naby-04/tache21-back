const mongoose = require("mongoose");
const Rapport = require("../model/rapportModel");
const streamifier = require("streamifier")
const cloudinary = require("../cloudinary")


const createRapport = async (req, res) => {
  const { title, description, category, tags } = req.body;
  const file = req.file;

  console.log("req.body", req.body);
  
  if (!title || !description || !file || !category) {
    return res.status(400).json({ message: "Veuillez renseigner tous les champs requis." });
  }

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    // Fonction pour envoyer le fichier à Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
              folder: "uploads",
              public_id: `${Date.now()}_${file.originalname.split(".")[0].replace(/\s+/g, "_")}`,
              resource_type: "raw",
              type: "upload" // ✅ Ceci rend le fichier public
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
        // const stream = cloudinary.uploader.upload_stream(
        //   {
        //     folder: "uploads",
        //     public_id: `${Date.now()}_${file.originalname.split(".")[0].replace(/\s+/g, "_")}`,
        //     resource_type: mime.includes("pdf") || mime.includes("msword") || mime.includes("officedocument") ? "raw" : "auto",
        //   },
        //   (error, result) => {
        //     if (error) return reject(error);
        //     resolve(result);
        //   }
        // );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Envoie du fichier à Cloudinary
    const result = await streamUpload(file.buffer);

    // Création du nouveau rapport
    const newRapport = new Rapport({
      title,
      description,
      file: result.secure_url,
      category,
      tags,
      type: file.mimetype,
      date: new Date(),
      userId: req.user.id,
    });

    await newRapport.save();

    // 🟢 Population de l'utilisateur AVANT de retourner le rapport
    const rapportAvecUser = await Rapport.findById(newRapport._id).populate('userId', 'prenom photo');

    return res.status(201).json({ message: "Rapport créé avec succès", rapport: rapportAvecUser });
  } catch (error) {
    console.error("Erreur dans /createRapport :", error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la création du rapport." });
  }
};




const getAllRapports = async (req, res) => {
  try {
  
    const rapports = await Rapport.find({})
  .sort({ createdAt: -1 })
  .populate('userId', 'prenom photo'); 
    return res.status(200).json(rapports);
  } catch (error) {
    return res.status(500).json({ message: "Impossible de récupérer les rapports" });
  }
};

const getRapportById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const rapport = await Rapport.findById(req.params.id);
    if (!rapport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }
    return res.status(200).json({ msg: "Rapport trouvé", rapport });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id);
    if (!rapport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }

    await rapport.deleteOne();
    return res.status(200).json({ msg: "Rapport supprimé", rapport });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateRapport = async (req, res) => {

  console.log("Données reçues dans req.body :", req.body);
  console.log("Fichier reçu dans req.file :", req.file);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const updateData = {
    ...req.body
  }

  if(req.file && req.file.path){
    updateData.fileUrl = req.file.path
  }


  try {
    const updated = await Rapport.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }
    return res.status(200).json({ msg: "Rapport modifié", rapport: updated });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getUserRapports = async (req, res) => {
  try {
    const rapports = await Rapport.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // console.log("Rapports de l'utilisateur :", rapports);
    
    return res.status(200).json(rapports);
  } catch (error) {
    return res.status(500).json({ message: "Impossible de récupérer les rapports de l'utilisateur" });
  }
};

const deleteUserRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!rapport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }
    return res.status(200).json({ msg: "Rapport supprimé", rapport });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateUserRapport = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  const updateData = {
    title,
    description,
  };

  if (req.file) {
    updateData.fileUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const rapport = await Rapport.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!rapport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }

    return res.status(200).json({ msg: "Rapport modifié avec succès", rapport });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createRapport,
  getAllRapports,
  getRapportById,
  deleteRapport,
  updateRapport,
  getUserRapports,
  deleteUserRapport,
  updateUserRapport,
};
