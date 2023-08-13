# Domain Security and Identity System

As part of home assigment of Reflectiz, This project implements a system that provides security and identity information about domains. It scans domains in the database at specified intervals to gather information, stores past results for future use, and exposes an asynchronous REST API for interacting with the system.

## Table of Contents

- [Description](#description)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

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
