#!/bin/bash

echo "=================================================="
echo "EOS AI WORKFORCE"
echo "=================================================="

curl -s http://localhost:3000/api/ai-workforce-members | jq -r '
"Total     : \(.summary.total)
Enabled   : \(.summary.enabled)
Connected : \(.summary.connected)
Status    : \(.summary.status)

--------------------------------------------------
WORKFORCE MEMBERS
--------------------------------------------------",
(.members[] | "
\(.name)
Role      : \(.role)
Provider  : \(.provider)
Model     : \(.model)
Enabled   : \(.enabled)
Connected : \(.connected)
Health    : \(.health)
")
'
