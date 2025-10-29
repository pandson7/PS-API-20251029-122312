# PS-API Architecture Diagrams

This directory contains AWS architecture diagrams for the PS-API (Product Specification API) system.

## Generated Diagrams

### 1. PS-API Serverless Architecture (`ps-api-architecture.png`)
- **Purpose**: High-level overview of the serverless architecture
- **Components**: User, API Gateway, Lambda Functions, DynamoDB
- **Focus**: Core system components and their relationships

### 2. PS-API Detailed Data Flow (`ps-api-detailed-flow.png`)
- **Purpose**: Detailed view of API endpoints and data flow
- **Components**: API endpoints, Lambda function details, DynamoDB structure
- **Focus**: Request routing and data processing flow

### 3. PS-API Deployment Architecture (`ps-api-deployment.png`)
- **Purpose**: Infrastructure deployment view
- **Components**: AWS Cloud layers, IAM roles, CDK stack
- **Focus**: Infrastructure organization and deployment structure

## Architecture Summary

The PS-API system implements a serverless architecture pattern using:

- **API Gateway**: RESTful API with two main endpoints
  - `GET /products` - Retrieve all products
  - `GET /products/{id}` - Retrieve specific product by ID

- **Lambda Functions**: Node.js runtime
  - `getProducts`: Handles retrieval of all products
  - `getProductById`: Handles retrieval of specific product
  - `initializeData`: Populates sample data during deployment

- **DynamoDB**: NoSQL database
  - Table: `ProductSpecifications`
  - Primary Key: `productId`
  - On-demand billing model
  - Encryption at rest enabled

- **Infrastructure as Code**: AWS CDK for deployment and management

## Security Features

- API Gateway with API key authentication
- Lambda execution roles with minimal DynamoDB permissions
- DynamoDB encryption at rest
- HTTPS enforcement for all API calls

## Generated**: 2025-10-29T12:28:41.004-04:00
