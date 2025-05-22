// Importation des modules
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Fonction asynchrone pour gérer le téléchargement et la transformation de l'image
async function photoProfil() {
  // Configuration de Cloudinary avec les variables d'environnement
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Téléversement (upload) de l'image depuis une URL distante
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/dcidine0f/image/upload/v1747757957/uploads/userProfil.JPG', // Une image réelle et publique
      {
        public_id: 'profile_utilisateur',
        folder: 'userProfil',
      }
    );

    console.log('🟢 Upload réussi :');
    console.log(uploadResult);

    // Optimisation de l'image (qualité et format auto)
    const optimizeUrl = cloudinary.url('userProfil/profile_utilisateur', {
      fetch_format: 'auto',
      quality: 'auto',
    });

    console.log('🔧 Image optimisée :');
    console.log(optimizeUrl);

    // Transformation : crop automatique, centrage, taille carrée
    const autoCropUrl = cloudinary.url('userProfil/profile_utilisateur', {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    console.log('📐 Image recadrée :');
    console.log(autoCropUrl);

  } catch (error) {
    console.error('❌ Erreur pendant le téléversement :', error);
  }
}

// Appel de la fonction
photoProfil();
