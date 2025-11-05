#!/bin/bash

# API Testing Script for Cruise Recruitment System
# Base URL
BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Cruise Recruitment System API"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=$5
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" -H "Content-Type: application/json" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" -H "Content-Type: application/json" -d "$data" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $http_code)"
        echo "Response: $body" | head -3
        ((FAILED++))
        return 1
    fi
}

test_endpoint_with_auth() {
    local name=$1
    local method=$2
    local url=$3
    local token=$4
    local data=$5
    local expected_status=$6
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $token" \
            -d "$data" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($http_code)"
        ((PASSED++))
        echo "$body" > /dev/null
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $http_code)"
        echo "Response: $body" | head -3
        ((FAILED++))
        return 1
    fi
}

# 1. Health Check
echo "1. Health Check"
echo "---------------"
test_endpoint "Health Check" "GET" "/health" "" "200"
echo ""

# 2. API Root
echo "2. API Root"
echo "-----------"
test_endpoint "API Root" "GET" "" "" "200"
echo ""

# 3. Candidate Registration
echo "3. Candidate Registration"
echo "------------------------"
REGISTER_DATA='{"email":"test.candidate@example.com","password":"Test123456","firstName":"John","lastName":"Doe","phoneNumber":"+1234567890"}'
test_endpoint "Register Candidate" "POST" "/candidates/register" "$REGISTER_DATA" "201"
echo ""

# 4. Login
echo "4. Authentication"
echo "-----------------"
LOGIN_DATA='{"email":"test.candidate@example.com","password":"Test123456"}'
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Login failed - cannot proceed with protected endpoint tests${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token obtained: ${TOKEN:0:20}..."
fi
echo ""

# 5. Get Profile
echo "5. Protected Endpoints"
echo "---------------------"
test_endpoint_with_auth "Get My Profile" "GET" "/candidates/profile" "$TOKEN" "" "200"
test_endpoint_with_auth "Get Current User" "GET" "/auth/me" "$TOKEN" "" "200"
echo ""

# 6. Job Postings
echo "6. Job Postings"
echo "--------------"
test_endpoint "Get All Jobs" "GET" "/jobs" "" "200"

# Create job posting (would need admin token, but test public endpoint)
test_endpoint "Get Job Postings (Public)" "GET" "/jobs?page=1&limit=10" "" "200"
echo ""

# 7. Applications
echo "7. Applications"
echo "---------------"
test_endpoint_with_auth "Get My Applications" "GET" "/applications/my" "$TOKEN" "" "200"
echo ""

# 8. Employment History
echo "8. Employment History"
echo "---------------------"
test_endpoint_with_auth "Get My Employment History" "GET" "/employment-history/my" "$TOKEN" "" "200"
echo ""

# 9. Documents
echo "9. Documents"
echo "------------"
test_endpoint_with_auth "Get My Documents" "GET" "/documents/my" "$TOKEN" "" "200"
test_endpoint_with_auth "Get Expiring Documents" "GET" "/documents/my/expiring?days=30" "$TOKEN" "" "200"
echo ""

# 10. Contracts
echo "10. Contracts"
echo "-------------"
test_endpoint_with_auth "Get My Contracts" "GET" "/contracts/my" "$TOKEN" "" "200"
echo ""

# 11. Crew
echo "11. Crew Management"
echo "-------------------"
test_endpoint_with_auth "Get My Crew Readiness" "GET" "/crew/readiness/my" "$TOKEN" "" "200"
echo ""

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi

