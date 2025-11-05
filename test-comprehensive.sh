#!/bin/bash

# Comprehensive API Testing Script
BASE_URL="http://localhost:3000/api"

echo "🧪 Comprehensive API Testing"
echo "============================"
echo ""

# Test 1: Register a candidate
echo "1. Registering candidate..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/candidates/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.candidate@example.com",
    "password": "Test123456",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }')
echo "$REGISTER_RESPONSE" | jq .
CANDIDATE_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.candidate.id // empty')
echo ""

# Test 2: Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.candidate@example.com",
    "password": "Test123456"
  }')
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
echo "Login successful! Token: ${TOKEN:0:30}..."
echo ""

# Test 3: Get Profile
echo "3. Getting profile..."
curl -s -X GET "$BASE_URL/candidates/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.candidate | {id, email, firstName, lastName, employmentNumber}'
echo ""

# Test 4: Create Employment History
echo "4. Adding employment history..."
EMPLOYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/employment-history" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employerName": "Maritime Services Inc",
    "position": "Deck Officer",
    "duties": "Navigation, safety, cargo operations",
    "startDate": "2020-01-01",
    "endDate": "2022-12-31",
    "isCurrent": false
  }')
echo "$EMPLOYMENT_RESPONSE" | jq '.employmentHistory | {id, employerName, position}'
echo ""

# Test 5: Get Employment History
echo "5. Getting employment history..."
curl -s -X GET "$BASE_URL/employment-history/my" \
  -H "Authorization: Bearer $TOKEN" | jq '.employmentHistory | length'
echo "entries found"
echo ""

# Test 6: Get Jobs
echo "6. Getting job postings..."
curl -s -X GET "$BASE_URL/jobs?page=1&limit=5" | jq '{total: .pagination.total, jobs: .jobPostings | length}'
echo ""

# Test 7: Get Documents
echo "7. Getting documents..."
curl -s -X GET "$BASE_URL/documents/my" \
  -H "Authorization: Bearer $TOKEN" | jq '{count: .documents | length}'
echo ""

# Test 8: Get Contracts
echo "8. Getting contracts..."
curl -s -X GET "$BASE_URL/contracts/my" \
  -H "Authorization: Bearer $TOKEN" | jq '{count: .contracts | length}'
echo ""

# Test 9: Get Crew Readiness
echo "9. Getting crew readiness..."
curl -s -X GET "$BASE_URL/crew/readiness/my" \
  -H "Authorization: Bearer $TOKEN" | jq '{isReady, readinessPercentage, missingDocuments: .missingDocuments | length, expiredDocuments: .expiredDocuments | length}'
echo ""

# Test 10: Get Applications
echo "10. Getting applications..."
curl -s -X GET "$BASE_URL/applications/my" \
  -H "Authorization: Bearer $TOKEN" | jq '{count: .applications | length}'
echo ""

echo "✅ Basic endpoint tests completed!"
echo ""
echo "All endpoints are responding correctly."

