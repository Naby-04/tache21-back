const mongoose = require("mongoose");
const Rapport = require("../model/rapportModel");
const streamifier = require("streamifier")
const cloudinary = require("../cloudinary")




const createRapport = async (req, res) => {
  const { title, description, category, tags } = req.body;
  const file = req.file;

  if (!title || !description || !file || !category) {
    return res.status(400).json({ message: "Veuillez renseigner tous les champs requis." });
  }

  try {
    // On récupère le type MIME du fichier
    const mime = file.mimetype;

    // Fonction pour envoyer le fichier à Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "uploads",
            public_id: `${Date.now()}_${file.originalname.split(".")[0].replace(/\s+/g, "_")}`,
            resource_type: "raw",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Envoie du fichier à Cloudinary
    const result = await streamUpload(file.buffer);

    // Création du nouveau rapport
    const newRapport = new Rapport({
      title,
      description,
      fileUrl: result.secure_url,
      category,
      tags,
      type: file.mimetype,
      date: new Date().toLocaleString(),
      user: req.user.id,
    });

    await newRapport.save();

    return res.status(201).json({ message: "Rapport créé avec succès", rapport: newRapport });
  } catch (error) {
    console.error("Erreur dans /createRapport :", error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la création du rapport." });
  }
};




const getAllRapports = async (req, res) => {
  try {
    // const rapports = await Rapport.find({}).sort({ createdAt: -1 });
    const rapports = await Rapport.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'prenom');
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
    const rapports = await Rapport.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(rapports);
  } catch (error) {
    return res.status(500).json({ message: "Impossible de récupérer les rapports de l'utilisateur" });
  }
};

const deleteUserRapport = async (req, res) => {
  try {
    const rapport = await Rapport.findOneAndDelete({ _id: req.params.id, user: req.user.id });
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

  // ✅ Si un fichier est envoyé, on le traite ici
  if (req.file) {
    // Par exemple, si le fichier est stocké localement :
    updateData.fileUrl = `/uploads/${req.file.filename}`;

    // Ou si tu utilises Cloudinary :
    // updateData.fileUrl = req.file.path;
  }

  try {
    const rapport = await Rapport.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!rapport) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }

    return res.status(200).json({ msg: "Rapport modifié avec succès", rapport });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rapport :", error);
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
