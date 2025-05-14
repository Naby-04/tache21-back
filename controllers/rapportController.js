const Rapport = require("../model/rapportModel");


const createRapport = async (req, res) => {
    const {title, description, fileUrl, user} = req.body

    if(!title || !description || !fileUrl){
        return res.status(400).json({message: "Veuillez renseigner ces champs"})
    }

    const newRapport = new Rapport({
        title,
        description,
        fileUrl,
        user: req.userId
    })

    if(newRapport){
        return res.status(201).json({message: "Rapport crée"})
    }

    await newRapport.save()

    return res.status(201).json({message: "Rapport crée", userdetails: {
        title: newRapport.title,
        description: newRapport.description,
        fileUrl: newRapport.fileUrl
    }})
}

module.exports = {
    createRapport
}