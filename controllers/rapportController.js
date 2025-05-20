const Rapport = require("../model/rapportModel");
const mongoose = require("mongoose")



const createRapport = async (req, res) => {
    const {title, description, category, tags} = req.body
    const file = req.file //on recupere le nom depuis le middleware update

    if(!title || !description || !file || !category){
        return res.status(400).json({message: "Veuillez renseigner ces champs"})
    }
    

    try {

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(file.filename)}`;
        console.log("fileUrl",fileUrl)


        // const fileUrl = file.path // on recupere la forme de donnee qu'on veut recuperer sois par extension ou par le nom ex: par le nom file.filename
        const newRapport = new Rapport({
        title,
        description,
        fileUrl,
        category,
        tags,
        type: file.mimetype,
        date: Date.now().toLocaleString(),

        user: req.user.id
    })

    console.log("fileName",newRapport.type);
    
    await newRapport.save()

    return res.status(201).json({message: "Rapport crée", rapport:newRapport})
    }
    catch (error) {
       console.error("Erreur dans /create:", error); // ➤ pour voir le vrai message
    res.status(500).json({ message: "Une erreur s'est produite" });
    }
}

const getRapport = async (req, res) => {
    try {
        const rapport = await Rapport.find({}).sort({createdAt: -1})
        return res.status(200).json(rapport)
    } catch (error) {
        return res.status(500).json({message: "Impossible de recuperer les rapports"})
    }
}


const getOneRapport = async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    const existingRapport = await Rapport.findOne({
        _id: req.params.id,

    })

    if(!existingRapport){
        return res.status(409).json({msg: "Rapport introuvable"})
    }

    return res.status(200).json({msg: "Rapport trouve,", rapport: existingRapport})
}


const deleteRapport = async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    try {
        const rapport = await Rapport.findOneAndDelete({
            _id: req.params.id,
        })

        if(!rapport){
            return res.status(404).json({msg : "Rapport introuvable"})
        }

        return res.status(200).json({msg: "Rapport supprime", rapport: rapport})

    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite"})
    }
}

const updateRapport = async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    try {
        const rapport = await Rapport.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})

        if(!rapport){
            return res.status(401).json({msg : "Rapport introuvable"})
        }

        return res.status(201).json({msg: "Rapport modifiee", rapport: rapport})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
}

const getMyAllRapport = async (req, res) => {
    try {
        const rapport = await Rapport.find({user: req.user.id}).sort({createdAt: -1})
        return res.status(200).json(rapport)
    } catch (error) {
        return res.status(500).json({message: "Impossible de recuperer les rapports"})
    }
}

const deleteMyRapport = async (req, res) => {
    try{
        const rapportId = await Rapport.findOneAndDelete({
            _id:req.params.id,
            user: req.user.id
        })

        if(!rapportId){
            return res.status(404).json({msg : "Rapport introuvable"})
        }

        return res.status(200).json({msg: "Rapport supprime", rapport: rapportId})
    }catch(error){
        return res.status(500).json({message: "Une erreur s'est produite"})
    }
}

const updateMyRapport = async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    try {
        const rapport = await Rapport.findOneAndUpdate({_id: req.params.id, user: req.params.id}, req.body, {new: true})

        if(!rapport){
            return res.status(401).json({msg : "Rapport introuvable"})
        }

        return res.status(200).json({msg: "Rapport modife avec succes" , rapport: rapport})
    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite"})
    }
}

module.exports = {
    createRapport,
    deleteRapport,
    updateRapport,
    getRapport,
    getOneRapport,
    getMyAllRapport,
    deleteMyRapport,
    updateMyRapport
}

// Commentaires swagger 

