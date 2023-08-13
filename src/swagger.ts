import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Domain analysis Documentation",
      version: "1.0.0",
      description: "Domain analysis API documentation for Reflectiz",
    },
    tags: [
      {
        name: "Domain Analysis",
        description: "API endpoints for domain analysis",
      },
    ],
    components: {
      schemas: {
        DomainInfo: {
          type: "object",
          properties: {
            domainName: {
              type: "string",
            },
            // Add more properties as needed
          },
        },
        DomainRequestBody: {
          type: "object",
          properties: {
            domainName: {
              type: "string",
            },
            // Add more properties as needed
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
