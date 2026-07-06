#!/bin/bash

echo "=================================================="
echo "EOS PROVIDER DISPATCH TEST"
echo "=================================================="

curl -s -X POST http://localhost:3000/api/provider-dispatch | jq -r '
"Dispatch Status : \(.dispatchStatus)
Provider        : \(.provider)
Dispatched      : \(.result.dispatched)
Reason          : \(.result.reason)

Mission ID      : \(.result.missionPackage.missionId)
Objective       : \(.result.missionPackage.objective)
Governance      : \(.result.missionPackage.governance.status)
"
'
