#!/bin/bash

echo "=================================================="
echo "EOS ENGINEERING MISSION QUEUE"
echo "=================================================="

curl -s http://localhost:3000/api/mission-queue | jq -r '
"Queue Status       : \(.queueStatus)
Total Missions     : \(.totalMissions)
Ready For Dispatch : \(.readyForDispatch)
In Progress        : \(.inProgress)
Awaiting Approval  : \(.awaitingApproval)
Completed          : \(.completed)

--------------------------------------------------
MISSIONS
--------------------------------------------------",
(.missions[] | "
\(.missionId)
Title    : \(.title)
Source   : \(.sourceEcr)
Priority : \(.priority)
Status   : \(.status)
Approval : \(.approval)
")
'
