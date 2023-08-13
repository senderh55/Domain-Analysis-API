import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Domain Analysis Documentation",
      version: "1.0.0",
      description: "API documentation for domain analysis",
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
            virusTotalInfo: {
              type: "object",
            },
            whoisInfo: {
              type: "object",
            },
            status: {
              type: "string",
            },
          },
        },
        DomainRequestBody: {
          type: "object",
          properties: {
            domainName: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
