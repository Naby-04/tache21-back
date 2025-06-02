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
        // url: "http://localhost:8000",
        url: "https://tache21-back.onrender.com"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["prenom", "email", "password"],
          properties: {
            prenom: {
              type: "string",
              example: "Ndeye Amie",
            },
            email: {
              type: "string",
              format: "email",
              example: "ndeyeamie@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "passer123",
            },
            isAdmin: {
              type: "boolean",
              default: false,
            },
            photo: {
              type: "string",
              format: "uri",
              example: "https://example.com/photo.jpg",
            },
            resetPasswordToken: {
              type: "string",
              nullable: true,
            },
            resetPasswordExpires: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
