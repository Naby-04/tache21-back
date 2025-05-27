const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de gestion des rapports de mémoire",
      version: "1.0.0",
      description: "Documentation de l'API avec Swagger",
    },
    servers: [
      {
        // url: "http://localhost:8080"
        url: "https://tache21-back.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"], // ou "./controllers/*.js" selon où tu écris les commentaires
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;