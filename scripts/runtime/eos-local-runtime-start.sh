#!/bin/bash

set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

EOS_ROOT="$HOME/EOS/EOS/EOS"

cd "$EOS_ROOT" || exit 1

echo "======================================================================="
echo " EOS Managed Local Runtime Startup"
echo " Objective 10.x.2"
echo "======================================================================="
echo "Started: $(date)"
echo ""

echo "1. Validating runtime environment..."
echo "-----------------------------------------------------------------------"
npm run eos:environment:validate

echo ""
echo "PASS: Runtime environment validated."

echo ""
echo "2. Stopping any existing EOS runtime..."
echo "-----------------------------------------------------------------------"
npm run eos:stop || true

echo ""
echo "3. Starting EOS runtime..."
echo "-----------------------------------------------------------------------"
npm run eos:start

echo ""
echo "4. Verifying EOS operational status..."
echo "-----------------------------------------------------------------------"
npm run eos:status

echo ""
echo "5. Generating machine-readable runtime status..."
echo "-----------------------------------------------------------------------"
./scripts/runtime/eos-runtime-manager.sh

echo ""
echo "======================================================================="
echo " EOS Managed Runtime Startup Complete"
echo "======================================================================="
echo "Completed: $(date)"
