#!/bin/bash

# Script to create a test applicant account
# Usage: ./scripts/create-test-user.sh [email] [password] [firstName] [lastName]

API_URL="${API_URL:-http://localhost:3000/api}"

EMAIL="${1:-test.applicant@example.com}"
PASSWORD="${2:-Test123456}"
FIRST_NAME="${3:-Test}"
LAST_NAME="${4:-Applicant}"

echo "🚢 Creating test applicant account..."
echo "Email: $EMAIL"
echo "Password: $PASSWORD"
echo ""

# Register the candidate
RESPONSE=$(curl -s -X POST "$API_URL/candidates/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"$FIRST_NAME\",
    \"lastName\": \"$LAST_NAME\",
    \"phoneNumber\": \"+1234567890\"
  }")

# Check if registration was successful
if echo "$RESPONSE" | grep -q "registered successfully"; then
  echo "✅ Account created successfully!"
  echo ""
  echo "📝 Login credentials:"
  echo "   Email: $EMAIL"
  echo "   Password: $PASSWORD"
  echo ""
  echo "🔗 Login at: http://localhost:4000/login"
  echo "   Or: http://localhost:4002/login"
  echo ""
else
  echo "❌ Registration failed:"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

