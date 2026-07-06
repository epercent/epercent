#!/bin/bash

echo "=================================================="
echo "EOS AI PROVIDER GATEWAY"
echo "=================================================="

curl -s http://localhost:3000/api/ai-provider-gateway | jq -r '
"Gateway Status : \(.gateway.status)
Strategy       : \(.gateway.routingStrategy)
Version        : \(.gateway.version)

--------------------------------------------------
PROVIDERS
--------------------------------------------------",
(.providers[] | "
\(.name)
ID           : \(.id)
Status       : \(.status)
Capabilities : \(.capabilities | join(", "))
")
'
