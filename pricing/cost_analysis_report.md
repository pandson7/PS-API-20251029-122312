# PS-API Serverless Architecture Cost Analysis Estimate Report

## Service Overview

PS-API Serverless Architecture is a fully managed, serverless service that allows you to This project uses multiple AWS services.. This service follows a pay-as-you-go pricing model, making it cost-effective for various workloads.

## Pricing Model

This cost analysis estimate is based on the following pricing model:
- **ON DEMAND** pricing (pay-as-you-go) unless otherwise specified
- Standard service configurations without reserved capacity or savings plans
- No caching or optimization techniques applied

## Assumptions

- Standard ON DEMAND pricing model for all services
- US East (N. Virginia) region pricing
- Moderate usage patterns for a product specification API
- No reserved capacity or savings plans applied
- Standard memory allocation for Lambda functions (128 MB)
- Average Lambda execution time of 200ms per request
- DynamoDB on-demand billing mode
- No caching enabled on API Gateway

## Limitations and Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- IAM and security service costs
- Development and deployment pipeline costs
- Custom domain and SSL certificate costs
- Backup and disaster recovery costs

## Cost Breakdown

### Unit Pricing Details

| Service | Resource Type | Unit | Price | Free Tier |
|---------|--------------|------|-------|------------|
| AWS Lambda | Requests | request | $0.0000002 | First 12 months: 1M requests/month and 400,000 GB-seconds/month free |
| AWS Lambda | Compute | GB-second (first 6B GB-seconds) | $0.0000166667 | First 12 months: 1M requests/month and 400,000 GB-seconds/month free |
| Amazon API Gateway | Requests | request (first 333M requests/month) | $0.0000035 | No free tier for API Gateway |
| Amazon DynamoDB | Read Requests | read request unit | $0.000000125 | First 12 months: 25 GB storage, 25 RCUs, 25 WCUs free |
| Amazon DynamoDB | Write Requests | write request unit | $0.000000625 | First 12 months: 25 GB storage, 25 RCUs, 25 WCUs free |
| Amazon DynamoDB | Storage | GB-month (after first 25 GB free) | $0.25 | First 12 months: 25 GB storage, 25 RCUs, 25 WCUs free |

### Cost Calculation

| Service | Usage | Calculation | Monthly Cost |
|---------|-------|-------------|-------------|
| AWS Lambda | Processing 10,000 API requests per month with 3 functions (getProducts, getProductById, initializeData) (Requests: 10,000 requests/month, Compute: 10,000 requests × 0.2s × 0.125GB = 250 GB-seconds/month) | $0.0000002 × 10,000 requests + $0.0000166667 × 250 GB-seconds = $0.002 + $0.004 = $0.006/month (covered by free tier) | $0.21 |
| Amazon API Gateway | Handling 10,000 REST API requests per month (Requests: 10,000 requests/month) | $0.0000035 × 10,000 requests = $0.035/month | $0.035 |
| Amazon DynamoDB | Storing product specifications with read/write operations (Read Requests: 8,000 read requests/month (80% of API calls), Write Requests: 2,000 write requests/month (20% of API calls), Storage: 1 GB of product data) | $0.000000125 × 8,000 reads + $0.000000625 × 2,000 writes + $0 storage (within free tier) = $0.001 + $0.00125 = $0.00225/month (covered by free tier) | $0.13 |
| **Total** | **All services** | **Sum of all calculations** | **$0.38/month** |

### Free Tier

Free tier information by service:
- **AWS Lambda**: First 12 months: 1M requests/month and 400,000 GB-seconds/month free
- **Amazon API Gateway**: No free tier for API Gateway
- **Amazon DynamoDB**: First 12 months: 25 GB storage, 25 RCUs, 25 WCUs free

## Cost Scaling with Usage

The following table illustrates how cost estimates scale with different usage levels:

| Service | Low Usage | Medium Usage | High Usage |
|---------|-----------|--------------|------------|
| AWS Lambda | $0/month | $0/month | $0/month |
| Amazon API Gateway | $0/month | $0/month | $0/month |
| Amazon DynamoDB | $0/month | $0/month | $0/month |

### Key Cost Factors

- **AWS Lambda**: Processing 10,000 API requests per month with 3 functions (getProducts, getProductById, initializeData)
- **Amazon API Gateway**: Handling 10,000 REST API requests per month
- **Amazon DynamoDB**: Storing product specifications with read/write operations

## Projected Costs Over Time

The following projections show estimated monthly costs over a 12-month period based on different growth patterns:

Base monthly cost calculation:

| Service | Monthly Cost |
|---------|-------------|
| AWS Lambda | $0.21 |
| Amazon API Gateway | $0.04 |
| Amazon DynamoDB | $0.13 |
| **Total Monthly Cost** | **$0** |

| Growth Pattern | Month 1 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|----------|
| Steady | $0/mo | $0/mo | $0/mo | $0/mo |
| Moderate | $0/mo | $0/mo | $0/mo | $0/mo |
| Rapid | $0/mo | $0/mo | $0/mo | $1/mo |

* Steady: No monthly growth (1.0x)
* Moderate: 5% monthly growth (1.05x)
* Rapid: 10% monthly growth (1.1x)

## Detailed Cost Analysis

### Pricing Model

ON DEMAND


### Exclusions

- Data transfer costs between regions
- CloudWatch logging and monitoring costs
- IAM and security service costs
- Development and deployment pipeline costs
- Custom domain and SSL certificate costs
- Backup and disaster recovery costs

### Recommendations

#### Immediate Actions

- Leverage AWS Free Tier benefits for the first 12 months to minimize costs
- Monitor Lambda function memory allocation and execution time to optimize costs
- Consider implementing API Gateway caching for frequently accessed endpoints
- Use DynamoDB on-demand billing for unpredictable workloads
#### Best Practices

- Implement proper error handling to avoid unnecessary Lambda invocations
- Use DynamoDB single-table design patterns to minimize storage costs
- Monitor CloudWatch metrics to identify optimization opportunities
- Consider Reserved Capacity for DynamoDB if usage patterns become predictable
- Implement request throttling to prevent unexpected cost spikes



## Cost Optimization Recommendations

### Immediate Actions

- Leverage AWS Free Tier benefits for the first 12 months to minimize costs
- Monitor Lambda function memory allocation and execution time to optimize costs
- Consider implementing API Gateway caching for frequently accessed endpoints

### Best Practices

- Implement proper error handling to avoid unnecessary Lambda invocations
- Use DynamoDB single-table design patterns to minimize storage costs
- Monitor CloudWatch metrics to identify optimization opportunities

## Conclusion

By following the recommendations in this report, you can optimize your PS-API Serverless Architecture costs while maintaining performance and reliability. Regular monitoring and adjustment of your usage patterns will help ensure cost efficiency as your workload evolves.
