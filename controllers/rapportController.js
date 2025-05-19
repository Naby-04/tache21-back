const mongoose = require("mongoose");
const Rapport = require("../model/rapportModel");

const createRapport = async (req, res) => {
  const { title, description, category, tags } = req.body;
  const file = req.file;

  if (!title || !description || !file || !category) {
    return res.status(400).json({ message: "Veuillez renseigner tous les champs obligatoires." });
  }

  try {
    const newRapport = new Rapport({
      title,
      description,
      fileUrl: file.path,
      category,
      tags,
      type: file.mimetype,
      user: req.user.id,
    });

    await newRapport.save();
    return res.status(201).json({ message: "Rapport créé", rapport: newRapport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
};

const getAllRapports = async (req, res) => {
  try {
    const rapports = await Rapport.find().sort({ createdAt: -1 });
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const updated = await Rapport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ msg: "Rapport introuvable" });
    }
    return res.status(200).json({ msg: "Rapport modifié", rapport: updated });
  } catch (error) {
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

  try {
    const rapport = await Rapport.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
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
