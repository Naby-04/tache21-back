const express = require('express');
const router = express.Router();
const Post = require('../model/PostModel');

//GET- lire tous les messages
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.json({ message: posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//POST- créer un post
router.post("/", async (req, res) => {
  try {
    const { titre, contenu } = req.body;
    const nouveauPost = new Post({ titre, contenu });
    await nouveauPost.save();

    res.status(201).json({ message: "Post créé avec succès ✅", post: nouveauPost });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erreur lors de la création du post." });
  }
});

module.exports = router;
