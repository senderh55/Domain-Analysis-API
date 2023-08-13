# Domain Security and Identity System

This project implements a system that provides security and identity information about domains. It scans domains in the database at specified intervals to gather information, stores past results for future use, and exposes an asynchronous REST API for interacting with the system.

## Table of Contents

- [Description](#description)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

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
  - `200 OK`: Returns domain information if available
  - `202 Accepted`: Analysis is currently being scanned. Check back later.
  - `500 Internal Server Error`: Failed to process the request
