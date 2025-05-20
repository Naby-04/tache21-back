const path = require("path")
const fs = require("fs")
const Download = require("../model/dowloadModel")

const lunchDownload = async (req, res) => {
    try {
        const download = Download.findById(req.params.id)

        if(!download){
            res.status(404).json({message: "F"})
        }
    }catch (error){

    }
}