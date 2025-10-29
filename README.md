# PS-API - Product Specifications API

A serverless REST API built with AWS CDK for managing and retrieving product specifications from DynamoDB.

## 🚀 Live API

The API is deployed and accessible at: **https://rj28jp1nrg.execute-api.us-east-1.amazonaws.com/prod/**

## 📋 Overview

PS-API provides a RESTful interface for accessing product specifications stored in a DynamoDB database. The system supports flexible JSON schemas for product data including product names, categories, brands, and custom specifications.

## 🏗️ Architecture

- **API Gateway**: RESTful API endpoint with CORS support
- **AWS Lambda**: Serverless compute for API logic
- **DynamoDB**: NoSQL database for product specifications
- **AWS CDK**: Infrastructure as Code for deployment

## 📊 Architecture Diagrams

Visual representations of the system architecture are available in the `generated-diagrams/` folder:

- **System Architecture**: High-level component overview
- **Detailed Flow**: Request/response flow diagram  
- **Deployment Architecture**: AWS infrastructure layout

## 🔗 API Endpoints

### Get All Products
```
GET /products
```
Returns all product specifications from the database.

### Get Product by ID
```
GET /products/{id}
```
Returns a specific product by its ID.

## 📝 Response Format

All API responses follow a consistent JSON structure:

```json
{
  "success": true,
  "data": {
    "productId": "string",
    "productName": "string", 
    "category": "string",
    "brand": "string",
    "specifications": {
      "color": "string",
      "size": "string",
      "weight": "number",
      "features": ["array"]
    },
    "createdAt": "ISO8601 timestamp",
    "updatedAt": "ISO8601 timestamp"
  },
  "message": "string",
  "timestamp": "ISO8601 timestamp"
}
```

## 🧪 Testing the API

Use the included test script to verify API functionality:

```bash
./test-api.sh
```

Or test manually with curl:

```bash
# Get all products
curl https://rj28jp1nrg.execute-api.us-east-1.amazonaws.com/prod/products

# Get specific product
curl https://rj28jp1nrg.execute-api.us-east-1.amazonaws.com/prod/products/PROD001
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- AWS CLI configured
- AWS CDK CLI installed

### Installation

```bash
npm install
```

### Deployment

```bash
# Deploy the stack
cdk deploy

# Destroy the stack
cdk destroy
```

### Local Development

```bash
# Run tests
npm test

# Build the project
npm run build
```

## 📁 Project Structure

```
├── bin/                    # CDK app entry point
├── lib/                    # CDK stack definition
├── specs/                  # Requirements and design docs
├── generated-diagrams/     # Architecture diagrams
├── pricing/               # Cost analysis
├── tasks/                 # Task documentation
├── test-api.sh           # API testing script
└── README.md             # This file
```

## 💰 Cost Analysis

Monthly operational cost: **$0.38/month**

Detailed cost breakdown available in `pricing/cost_analysis_report.md`

## 📚 Documentation

- **Requirements**: `specs/requirements.md`
- **Technical Design**: `specs/design.md` 
- **Task Breakdown**: `specs/tasks.md`
- **Jira Stories**: `jira_stories.md`
- **Deployment Summary**: `DEPLOYMENT_SUMMARY.md`

## 🔧 Configuration

The system uses AWS CDK for infrastructure management. Key configuration:

- **Runtime**: Node.js 18.x
- **Memory**: 128MB per Lambda function
- **Timeout**: 30 seconds
- **DynamoDB**: On-demand billing mode

## 🛡️ Security

- HTTPS enforcement for all API calls
- DynamoDB encryption at rest
- IAM roles with least privilege access
- Input validation and sanitization

## 📈 Monitoring

The system includes comprehensive monitoring:

- CloudWatch logs for all Lambda functions
- API Gateway access logs and metrics
- DynamoDB performance metrics
- Custom application metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the documentation in the `specs/` folder
2. Review the deployment summary
3. Check CloudWatch logs for error details
4. Create an issue in the repository

---

**Built with ❤️ using AWS CDK and TypeScript**
