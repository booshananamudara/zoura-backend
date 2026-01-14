#!/bin/bash
# Test Transactional Vendor Registration

echo "=== Testing Vendor Registration Flow ==="
echo ""

# Test 1: Register a new vendor
echo "1. Registering new vendor user..."
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testvendor@zoura.com",
    "password": "vendor123",
    "name": "Test Vendor User",
    "role": "vendor",
    "shop_name": "Test Vendor Shop"
  }')

echo "$RESPONSE"
echo ""

# Check if registration was successful
if echo "$RESPONSE" | grep -q "message"; then
    echo "✅ Vendor registration successful!"
    
    # Extract user ID if possible (requires jq)
    if command -v jq &> /dev/null; then
        USER_ID=$(echo "$RESPONSE" | jq -r '.user.id')
        echo "User ID: $USER_ID"
    fi
else
    echo "❌ Vendor registration failed!"
fi

echo ""
echo "2. Checking vendors table..."
docker exec -it zoura_postgres psql -U admin -d zoura_db -c "SELECT id, shop_name, approval_status FROM vendors ORDER BY created_at DESC LIMIT 5;"

echo ""
echo "3. Checking users table..."
docker exec -it zoura_postgres psql -U admin -d zoura_db -c "SELECT id, email, name, role FROM users WHERE role='vendor' ORDER BY created_at DESC LIMIT 5;"

echo ""
echo "=== Test Complete ==="
