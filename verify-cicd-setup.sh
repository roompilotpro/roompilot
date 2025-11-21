#!/bin/bash

# CI/CD Setup Verification Script
# This script verifies that all CI/CD components are properly configured

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          RoomPilot CI/CD Setup Verification                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0

# Check if required files exist
echo "🔍 Checking required files..."

FILES=(
    ".github/workflows/ci.yml"
    ".github/workflows/deploy.yml"
    ".github/workflows/rollback.yml"
    ".github/workflows/codeql.yml"
    ".github/dependabot.yml"
    "backend/checkstyle.xml"
    "backend/spotbugs-exclude.xml"
    "frontend/vitest.config.js"
    "frontend/.prettierrc.json"
    "codecov.yml"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
        ((ERRORS++))
    fi
done
echo ""

# Check backend dependencies
echo "🔍 Checking backend configuration..."
if grep -q "maven-checkstyle-plugin" backend/pom.xml; then
    echo "  ✅ Checkstyle plugin configured"
else
    echo "  ❌ Checkstyle plugin NOT configured"
    ((ERRORS++))
fi

if grep -q "spotbugs-maven-plugin" backend/pom.xml; then
    echo "  ✅ SpotBugs plugin configured"
else
    echo "  ❌ SpotBugs plugin NOT configured"
    ((ERRORS++))
fi

if grep -q "jacoco-maven-plugin" backend/pom.xml; then
    echo "  ✅ JaCoCo plugin configured"
else
    echo "  ❌ JaCoCo plugin NOT configured"
    ((ERRORS++))
fi
echo ""

# Check frontend dependencies
echo "🔍 Checking frontend configuration..."
if grep -q "vitest" frontend/package.json; then
    echo "  ✅ Vitest configured"
else
    echo "  ❌ Vitest NOT configured"
    ((ERRORS++))
fi

if grep -q "@testing-library/react" frontend/package.json; then
    echo "  ✅ React Testing Library configured"
else
    echo "  ❌ React Testing Library NOT configured"
    ((ERRORS++))
fi

if grep -q "prettier" frontend/package.json; then
    echo "  ✅ Prettier configured"
else
    echo "  ❌ Prettier NOT configured"
    ((ERRORS++))
fi

if [ -d "frontend/node_modules" ]; then
    echo "  ✅ Dependencies installed"
else
    echo "  ⚠️  Dependencies NOT installed (run: cd frontend && npm install)"
    ((ERRORS++))
fi
echo ""

# Check test files
echo "🔍 Checking test files..."
if [ -f "frontend/src/components/MessageCard.test.jsx" ]; then
    echo "  ✅ Frontend tests present"
else
    echo "  ⚠️  Frontend test examples missing"
fi
echo ""

# Check documentation
echo "🔍 Checking documentation..."
DOCS=(
    "docs/2_cicd_architecture.md"
    "docs/3_rollback_runbook.md"
    "CICD_SETUP.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ MISSING: $doc"
        ((ERRORS++))
    fi
done
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! CI/CD setup is complete."
    echo ""
    echo "Next steps:"
    echo "  1. Add required GitHub Secrets (see CICD_SETUP.md)"
    echo "  2. Configure GitHub Environment Protection rules"
    echo "  3. Create a test PR to verify CI pipeline"
    echo ""
    echo "📚 Documentation:"
    echo "  - Quick Start: CICD_SETUP.md"
    echo "  - Architecture: docs/2_cicd_architecture.md"
    echo "  - Rollback: docs/3_rollback_runbook.md"
    exit 0
else
    echo "❌ Found $ERRORS issue(s). Please review above."
    exit 1
fi
