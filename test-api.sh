#!/bin/bash

API_BASE_URL="https://rj28jp1nrg.execute-api.us-east-1.amazonaws.com/prod"

echo "=== Product Specifications API Test ==="
echo "API Base URL: $API_BASE_URL"
echo ""

echo "1. Testing GET /products (Get all products):"
echo "curl -X GET \"$API_BASE_URL/products\""
curl -X GET "$API_BASE_URL/products" -H "Content-Type: application/json" | jq '.'
echo ""

echo "2. Testing GET /products/ELEC001 (Get specific product):"
echo "curl -X GET \"$API_BASE_URL/products/ELEC001\""
curl -X GET "$API_BASE_URL/products/ELEC001" -H "Content-Type: application/json" | jq '.'
echo ""

echo "3. Testing GET /products/CLOTH001 (Get clothing product):"
echo "curl -X GET \"$API_BASE_URL/products/CLOTH001\""
curl -X GET "$API_BASE_URL/products/CLOTH001" -H "Content-Type: application/json" | jq '.'
echo ""

echo "4. Testing GET /products/INVALID123 (404 error test):"
echo "curl -X GET \"$API_BASE_URL/products/INVALID123\""
curl -X GET "$API_BASE_URL/products/INVALID123" -H "Content-Type: application/json" | jq '.'
echo ""

echo "=== Test Complete ==="
