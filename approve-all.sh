#!/bin/bash
# Quick Database Approval Script for Zoura

echo "=== Approving All Pending Vendors ==="
docker exec -it zoura_postgres psql -U admin -d zoura_db -c "UPDATE vendors SET approval_status = 'APPROVED' WHERE approval_status = 'PENDING'; SELECT id, shop_name, approval_status FROM vendors;"

echo ""
echo "=== Approving All Pending Products ==="
docker exec -it zoura_postgres psql -U admin -d zoura_db -c "UPDATE products SET approval_status = 'APPROVED' WHERE approval_status = 'PENDING'; SELECT id, name, approval_status FROM products LIMIT 10;"

echo ""
echo "✅ Done! All pending vendors and products have been approved."
