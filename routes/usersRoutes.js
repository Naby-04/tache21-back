const express = require("express");
const router = express.Router();
const { protect , admin } = require("../middlewares/authMiddleware")
const {createUsers,
        loginUser, 
        getUserProfile , 
        getUserById,
        updateUserProfile,
        getAllUsers,
        deleteUser ,
        logout,
        loginWithGoogle,
        registerWithGoogle
    } = require("../controllers/usersControlleurs");
const { forgetPassword , resetPassword} = require("../controllers/forgetPassword");

router.post("/register", createUsers);

router.post("/login", loginUser);

router.get("/profile",protect, getUserProfile);

router.get("/admin/user/:id", protect, admin, getUserById);

router.put("/update", protect, updateUserProfile); 

router.get("/allusers", protect ,  getAllUsers);

router.delete("/:id", protect,  deleteUser);


router.post("/logout", logout),

router.post("/forget-password", forgetPassword)

router.post("/reset-password/:token", resetPassword)

router.post("/google-login", loginWithGoogle);
router.post("/google-register", registerWithGoogle);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prenom
 *               - email
 *               - password
 *             properties:
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               photo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/allusers:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/users/google-login:
 *   post:
 *     summary: Connexion de l'utilisateur via Google
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - prenom
 *             properties:
 *               email:
 *                 type: string
 *               prenom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion via Google réussie
 *       401:
 *         description: Email non reconnu
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/google-register:
 *   post:
 *     summary: Inscription de l'utilisateur via Google
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - prenom
 *             properties:
 *               email:
 *                 type: string
 *               prenom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription via Google réussie
 *       400:
 *         description: Email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/forget-password:
 *   post:
 *     summary: Demande de réinitialisation du mot de passe
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       400:
 *         description: Email non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un token
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de réinitialisation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */


/**
 * @swagger
 * /api/users/admin/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (admin uniquement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur récupéré
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */



module.exports = router