const Rapport = require("../model/rapportModel");
const mongoose = require("mongoose")


const createRapport = async (req, res) => {
    const {title, description, fileUrl, user} = req.body

    if(!title || !description || !fileUrl){
        return res.status(400).json({message: "Veuillez renseigner ces champs"})
    }

    try {
        const newRapport = new Rapport({
        title,
        description,
        fileUrl
    })

    await newRapport.save()
    return res.status(201).json({message: "Rapport crée", rapport:newRapport})
    }

    
    catch (error) {
        console.error(error)
        return res.status(500).json({message: "Une erreur s'est produite"})
    }
}

const deleteRapport = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    try {
        const rapport = await Rapport.findOneAndDelete({_id: id})

        if(!rapport){
            return res.status(404).json({msg : "Rapport introuvable"})
        }

        return res.status(201).json({msg: "Rapport supprime", rapport: rapport})

    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite"})
    }
}

const updateRapport = async (req, res) => {
     const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "impossible de trouver l'id"})
    }

    try {
        const rapport = await Rapport.findOneAndUpdate({_id: id}, req.body)

        if(!rapport){
            return res.status(401).json({msg : "Rapport introuvable"})
        }

        return res.status(201).json({msg: "Rapport modifiee", rapport: rapport})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
}

module.exports = {
    createRapport,
    deleteRapport,
    updateRapport
}