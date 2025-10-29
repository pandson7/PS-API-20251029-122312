import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class PsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '20251029122312';

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, `ProductSpecifications-${suffix}`, {
      tableName: `ProductSpecifications-${suffix}`,
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // IAM Role for Lambda functions
    const lambdaRole = new iam.Role(this, `LambdaExecutionRole-${suffix}`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:Scan',
                'dynamodb:Query',
                'dynamodb:BatchWriteItem'
              ],
              resources: [productsTable.tableArn],
            }),
          ],
        }),
      },
    });

    // Lambda function for getting all products
    const getProductsFunction = new lambda.Function(this, `GetProductsFunction-${suffix}`, {
      functionName: `GetProductsFunction-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const command = new ScanCommand({
      TableName: process.env.TABLE_NAME
    });
    
    const result = await docClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result.Items,
        message: 'Products retrieved successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve products'
        },
        timestamp: new Date().toISOString()
      })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
    });

    // Lambda function for getting product by ID
    const getProductByIdFunction = new lambda.Function(this, `GetProductByIdFunction-${suffix}`, {
      functionName: `GetProductByIdFunction-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const productId = event.pathParameters?.id;
    
    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Product ID is required'
          },
          timestamp: new Date().toISOString()
        })
      };
    }

    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { productId }
    });
    
    const result = await docClient.send(command);
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found'
          },
          timestamp: new Date().toISOString()
        })
      };
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result.Item,
        message: 'Product retrieved successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve product'
        },
        timestamp: new Date().toISOString()
      })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
    });

    // Lambda function for initializing sample data
    const initDataFunction = new lambda.Function(this, `InitDataFunction-${suffix}`, {
      functionName: `InitDataFunction-${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
  {
    productId: 'ELEC001',
    productName: 'iPhone 15 Pro',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      color: 'Space Black',
      storage: '256GB',
      display: '6.1-inch Super Retina XDR',
      camera: '48MP Main Camera',
      features: ['Face ID', '5G', 'Wireless Charging']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'ELEC002',
    productName: 'MacBook Pro 14-inch',
    category: 'Electronics',
    brand: 'Apple',
    specifications: {
      processor: 'M3 Pro chip',
      memory: '16GB',
      storage: '512GB SSD',
      display: '14.2-inch Liquid Retina XDR',
      features: ['Touch ID', 'Thunderbolt 4', 'MagSafe 3']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'CLOTH001',
    productName: 'Classic Cotton T-Shirt',
    category: 'Clothing',
    brand: 'Nike',
    specifications: {
      material: '100% Cotton',
      size: 'Medium',
      color: 'Navy Blue',
      fit: 'Regular',
      features: ['Breathable', 'Machine Washable', 'Dri-FIT Technology']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'HOME001',
    productName: 'Smart Coffee Maker',
    category: 'Home & Garden',
    brand: 'Keurig',
    specifications: {
      capacity: '12 cups',
      material: 'Stainless Steel',
      power: '1500W',
      connectivity: 'WiFi',
      features: ['Programmable', 'Auto Shut-off', 'Mobile App Control']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'SPORT001',
    productName: 'Professional Tennis Racket',
    category: 'Sports & Outdoors',
    brand: 'Wilson',
    specifications: {
      weight: '300g',
      headSize: '100 sq in',
      stringPattern: '16x19',
      material: 'Carbon Fiber',
      features: ['Shock Absorption', 'Enhanced Control', 'Professional Grade']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

exports.handler = async (event) => {
  try {
    const putRequests = sampleProducts.map(product => ({
      PutRequest: {
        Item: product
      }
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [process.env.TABLE_NAME]: putRequests
      }
    });

    await docClient.send(command);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Sample data initialized successfully',
        count: sampleProducts.length
      })
    };
  } catch (error) {
    console.error('Error initializing data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      role: lambdaRole,
      timeout: cdk.Duration.seconds(60),
    });

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductsApi-${suffix}`, {
      restApiName: `ProductsApi-${suffix}`,
      description: 'API for Product Specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API Gateway resources and methods
    const productsResource = api.root.addResource('products');
    
    // GET /products
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction));
    
    // GET /products/{id}
    const productByIdResource = productsResource.addResource('{id}');
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Custom resource to initialize data after deployment
    const initDataProvider = new lambda.Function(this, `InitDataProvider-${suffix}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambda = new LambdaClient({});

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    try {
      const command = new InvokeCommand({
        FunctionName: process.env.INIT_FUNCTION_NAME,
        InvocationType: 'RequestResponse'
      });
      
      const response = await lambda.send(command);
      console.log('Init function response:', response);
      
      await sendResponse(event, 'SUCCESS', { Message: 'Data initialized successfully' });
    } catch (error) {
      console.error('Error:', error);
      await sendResponse(event, 'FAILED', { Message: error.message });
    }
  } else {
    await sendResponse(event, 'SUCCESS', { Message: 'Delete operation completed' });
  }
};

async function sendResponse(event, status, data) {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: data.Message,
    PhysicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: data
  });

  const url = event.ResponseURL;
  const parsedUrl = new URL(url);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'PUT',
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = require(parsedUrl.protocol.slice(0, -1)).request(options, (res) => {
      console.log('Response status:', res.statusCode);
      resolve();
    });
    
    req.on('error', (err) => {
      console.error('Error sending response:', err);
      reject(err);
    });
    
    req.write(responseBody);
    req.end();
  });
}
      `),
      environment: {
        INIT_FUNCTION_NAME: initDataFunction.functionName,
      },
      role: new iam.Role(this, `InitDataProviderRole-${suffix}`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
        inlinePolicies: {
          InvokeLambda: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['lambda:InvokeFunction'],
                resources: [initDataFunction.functionArn],
              }),
            ],
          }),
        },
      }),
      timeout: cdk.Duration.minutes(5),
    });

    // Custom resource to trigger data initialization
    new cdk.CustomResource(this, `InitDataResource-${suffix}`, {
      serviceToken: initDataProvider.functionArn,
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'API Gateway URL for Product Specifications API',
    });

    new cdk.CfnOutput(this, 'ProductsEndpoint', {
      value: `${api.url}products`,
      description: 'Endpoint to get all products',
    });
  }
}
