# Domain Security and Identity System

As part of home assigment of Reflectiz, This project implements a system that provides security and identity information about domains. It scans domains in the database at specified intervals to gather information, stores past results for future use, and exposes an asynchronous REST API for interacting with the system.

## Description

The system utilizes various APIs to gather information about domains, including information from VirusTotal, WHOIS, and potentially other sources. It provides two main endpoints:

### Get Domain Information

- **URL**: `/domainAnalysis/:domainName`
- **Method**: `GET`
- **Parameters**:
  - `domainName` (Path Parameter): The domain name to analyze
- **Responses**:
  - `200 OK`: Returns domain information if available
  - `202 Accepted`: Analysis is currently being scanned. Check back later.
  - `500 Internal Server Error`: Failed to process the request

### Add Domain for Analysis

- **URL**: `/domainAnalysis`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "domainName": "example.com"
  }
  ```
- **Responses**:
  - `200 OK`: Domain already exists
  - `202 Accepted`: Analysis is currently being scanned. Check back later.
  - `500 Internal Server Error`: Failed to process the request

## Communication with RabbitMQ

The system leverages RabbitMQ to facilitate asynchronous communication between distinct components. The `rabbitmq.ts` file serves as the communication hub for RabbitMQ and offers essential functions to send domains for analysis.

**rabbitmq.ts:** This module establishes and manages communication with RabbitMQ. It provides functions that enable the seamless dispatch of domains to the RabbitMQ queue for analysis.

---

## Scheduling Domain Analysis

The `schedulingService.ts` file takes charge of scheduling domain analysis tasks at predefined intervals. This scheduling is achieved using the `node-schedule` library. This component retrieves domains from the database and forwards them to the RabbitMQ queue, where they await analysis.

## Analysis Service

The `analysisService.ts` module orchestrates the interaction with external APIs to gather comprehensive information about domains. This module fetches data from external sources, such as VirusTotal and WHOIS, and performs thorough analysis to provide insightful domain information.

## Domain Controller

The `domainController.ts` file defines the essential controller functions using the Express.js framework. These functions are pivotal in handling API endpoints, managing domain analysis operations, and facilitating communication with the RabbitMQ queue.

**domainController.ts:** Functions as the core of the system's API handling. It takes charge of adding domains for analysis, retrieving domain information, and orchestrating seamless interactions with the RabbitMQ queue for efficient analysis.

## Environment Variables

The system relies on environment variables to configure its behavior and interact with external services. These variables are stored in a `.env` file at the root of the project and are loaded using the `dotenv` library.

To set up the required environment variables, create a `.env` file and populate it with the necessary values:

```plaintext
MONGODB_URI=your_mongodb_uri
RABBITMQ_URL=your_rabbitmq_url
VIRUS_TOTAL_API_KEY=your_virus_total_api_key
WHOIS_XML_API_KEY=your_whois_xml_api_key
ANALYSIS_INTERVAL=your_analysis_interval
```

## Docker Setup

The system can be containerized using Docker, providing a consistent and isolated environment for running its components. Follow these steps to set up and run the system using Docker:

1. **Install Docker**: If you haven't already, install Docker by following the instructions for your operating system: [Docker Installation Guide](https://docs.docker.com/get-docker/).

2. **Install Docker Compose**: Docker Compose is a tool for defining and running multi-container Docker applications. Install it by following the guide here: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/).

3. **Docker Configuration**: Create a `Dockerfile` for each service/component in your project. This file defines how to build a Docker image for the respective service. Specify the necessary dependencies, environment variables, and commands.

4. **Docker Compose Configuration**: Create a `docker-compose.yml` file in the root of your project. This file defines the services, networks, and volumes for your application. Configure environment variables, port mappings, build contexts, and any dependencies.

5. **Build and Run**: Open a terminal in your project directory and run the following command to build and start the services defined in your `docker-compose.yml`:

   ```bash
   docker-compose up -d
   ```

## Regular Setup

To set up the system using the traditional approach of cloning the repository, installing dependencies, and running the application, follow these steps:

1. **Clone the Repository**: Open a terminal and navigate to the directory where you want to clone the repository. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/senderh55/reflectiz-home-assignment.git
   ```

2.Navigate to Project Directory: Change your working directory to the cloned project:
```cd reflectiz-home-assignment``````
3.Install Dependencies: Install the required dependencies using npm (Node Package Manager):

```bash
   npm install
```

4.Environment Variables: Create a .env file in the root of the project and provide the necessary environment variables. Refer to the Environment Configuration section for details.

5.Start the Application: Run the application using npm:

````bash
    npm start
    ```
````
