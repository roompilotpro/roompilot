# Rollback Runbook

## Overview

This runbook provides step-by-step procedures for rolling back deployments in the RoomPilot application. Use this guide during incidents to quickly restore service.

## When to Rollback

Initiate a rollback when:

- ✅ Critical bugs discovered in production
- ✅ Application health checks failing
- ✅ Database migration issues
- ✅ Performance degradation (>2x response time)
- ✅ High error rates (>5% of requests)
- ✅ Security vulnerabilities discovered
- ✅ User-reported critical issues

## Rollback Decision Matrix

| Severity | Symptoms | Action | Timeline |
|----------|----------|--------|----------|
| **P0 - Critical** | Service down, data loss risk, security breach | Immediate rollback | <5 minutes |
| **P1 - High** | Major features broken, >10% users affected | Rollback after investigation | <15 minutes |
| **P2 - Medium** | Minor features broken, <10% users affected | Consider rollback vs hotfix | <30 minutes |
| **P3 - Low** | UI issues, cosmetic bugs | Hotfix in next deployment | N/A |

## Rollback Methods

### Method 1: Automated Rollback (Recommended)

**Use When:** You have GitHub access and the deployment was done via CI/CD

**Time Required:** 2-5 minutes

**Steps:**

1. **Navigate to GitHub Actions**
   ```
   https://github.com/[your-org]/roompilot/actions/workflows/rollback.yml
   ```

2. **Click "Run workflow"**

3. **Fill in the form:**
   - **Environment:** Select `production` or `staging`
   - **Revision:** Leave empty (auto-selects previous) OR enter specific revision name
   - **Reason:** Provide clear reason (e.g., "Critical bug in payment processing - Error 500 on checkout")

4. **Click "Run workflow" button**

5. **Monitor Progress:**
   - Click on the running workflow
   - Watch each step complete
   - Rollback takes ~2-3 minutes

6. **Verify Rollback:**
   ```bash
   # Check health endpoint
   curl https://[your-service-url]/actuator/health

   # Check API functionality
   curl https://[your-service-url]/api/messages
   ```

7. **Confirm in Cloud Console:**
   - Visit [Google Cloud Run Console](https://console.cloud.google.com/run)
   - Verify serving revision matches expected version
   - Check traffic is 100% on rolled-back revision

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║                    ROLLBACK REPORT                         ║
╠════════════════════════════════════════════════════════════╣
║ Environment:      production                               ║
║ Service:          roompilot-api-production                 ║
║ Previous Rev:     roompilot-api-00042-abc                  ║
║ Current Rev:      roompilot-api-00041-xyz                  ║
║ Reason:           Critical bug in payment processing       ║
║ Initiated By:     developer@example.com                    ║
║ Status:           success                                  ║
║ Time:             2025-01-15 14:32:18 UTC                  ║
╚════════════════════════════════════════════════════════════╝
```

### Method 2: Manual Rollback via gcloud CLI

**Use When:** GitHub Actions unavailable or needs immediate action

**Time Required:** 1-2 minutes

**Prerequisites:**
- gcloud CLI installed and authenticated
- Access to GCP project

**Steps:**

1. **List Recent Revisions:**
   ```bash
   # Set variables
   export PROJECT_ID="[your-project-id]"
   export REGION="us-central1"
   export SERVICE_NAME="roompilot-api-production"

   # List revisions
   gcloud run revisions list \
     --service=$SERVICE_NAME \
     --region=$REGION \
     --platform=managed \
     --format="table(metadata.name,status.conditions[0].status,metadata.creationTimestamp,status.traffic)" \
     --limit=10
   ```

   **Example Output:**
   ```
   REVISION                        STATUS    CREATED              TRAFFIC
   roompilot-api-00042-abc         Ready     2025-01-15 14:30     100
   roompilot-api-00041-xyz         Ready     2025-01-15 12:00     0
   roompilot-api-00040-def         Ready     2025-01-14 10:15     0
   ```

2. **Identify Target Revision:**
   - Current serving revision: `roompilot-api-00042-abc` (100% traffic)
   - Previous stable revision: `roompilot-api-00041-xyz`

3. **Execute Rollback:**
   ```bash
   # Rollback to previous revision
   gcloud run services update-traffic $SERVICE_NAME \
     --region=$REGION \
     --platform=managed \
     --to-revisions=roompilot-api-00041-xyz=100
   ```

4. **Verify Rollback:**
   ```bash
   # Check traffic distribution
   gcloud run services describe $SERVICE_NAME \
     --region=$REGION \
     --platform=managed \
     --format="table(status.traffic[].revisionName,status.traffic[].percent)"

   # Get service URL
   SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
     --region=$REGION \
     --platform=managed \
     --format='value(status.url)')

   # Test health endpoint
   curl -f $SERVICE_URL/actuator/health || echo "Health check failed!"

   # Test API endpoint
   curl -f $SERVICE_URL/api/messages || echo "API test failed!"
   ```

5. **Monitor Logs:**
   ```bash
   # View real-time logs
   gcloud run services logs tail $SERVICE_NAME \
     --region=$REGION \
     --platform=managed
   ```

### Method 3: Git Revert (For Source-Level Rollback)

**Use When:** Need to rollback multiple deployments or specific commits

**Time Required:** 5-10 minutes (includes CI/CD)

**Steps:**

1. **Identify Problematic Commit:**
   ```bash
   git log --oneline -10
   ```

2. **Revert the Commit:**
   ```bash
   # Revert specific commit (creates new commit)
   git revert [commit-sha]

   # Or revert multiple commits
   git revert [oldest-commit]..[newest-commit]
   ```

3. **Push to Trigger Deployment:**
   ```bash
   # Push to develop (staging)
   git push origin develop

   # Or push to main (production, after testing)
   git push origin main
   ```

4. **Monitor Deployment:**
   - Watch GitHub Actions workflow
   - Verify staging deployment successful
   - Approve production deployment if needed

## Rollback Procedures by Component

### Backend API Rollback

**Automatic Rollback Triggers:**
- Health check failures (>3 consecutive)
- Smoke test failures during deployment
- Any deployment step failure

**Manual Rollback:**
1. Use Method 1 (Automated) or Method 2 (gcloud CLI)
2. Verify database state if migrations were involved
3. Check application logs for errors
4. Monitor metrics in Cloud Console

**Post-Rollback Verification:**
```bash
# Health check
curl https://[service-url]/actuator/health

# API functionality
curl https://[service-url]/api/messages

# Flyway migrations status
curl https://[service-url]/actuator/flyway

# Check specific endpoints
curl https://[service-url]/swagger-ui/index.html
```

### Frontend Rollback (Vercel)

**Automatic:** Vercel doesn't auto-rollback, manual action required

**Steps:**

1. **Via Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select RoomPilot project
   - Click "Deployments" tab
   - Find previous working deployment
   - Click three dots (⋮) → "Promote to Production"

2. **Via Vercel CLI:**
   ```bash
   # List recent deployments
   vercel ls roompilot

   # Promote specific deployment
   vercel promote [deployment-url]
   ```

3. **Via Git:**
   ```bash
   # Revert frontend changes
   cd frontend
   git revert [commit-sha]
   git push origin main
   # Vercel auto-deploys
   ```

**Verification:**
- Visit https://roompilot.vercel.app
- Check browser console for errors (F12)
- Verify API calls working
- Test critical user flows

### Database Rollback

⚠️ **WARNING:** Database rollbacks are complex and risky!

**Flyway Migration Issues:**

1. **Failed Migration (Never Applied):**
   ```bash
   # Migration failed, safe to retry
   # Fix migration SQL file
   # Redeploy application (Flyway will retry)
   ```

2. **Partially Applied Migration:**
   ```sql
   -- Connect to database
   psql $DATABASE_URL

   -- Check migration status
   SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;

   -- If migration marked as failed
   -- Option 1: Fix and mark as repaired
   -- Option 2: Create new migration to undo changes
   ```

3. **Need to Undo Applied Migration:**
   ```sql
   -- NEVER delete from flyway_schema_history
   -- Instead, create new "undo" migration
   -- Example: V003__undo_add_user_table.sql

   DROP TABLE IF EXISTS users;
   ```

**Best Practice:** Always test migrations in staging first!

## Communication During Rollback

### Incident Response Checklist

- [ ] **Detect Issue:** Monitoring alert or user report
- [ ] **Assess Severity:** Use decision matrix above
- [ ] **Notify Team:** Slack/Email with severity and impact
- [ ] **Initiate Rollback:** Follow appropriate method
- [ ] **Monitor Progress:** Track rollback completion
- [ ] **Verify System:** Run health checks and tests
- [ ] **Communicate Resolution:** Notify stakeholders
- [ ] **Document Incident:** Post-mortem analysis

### Status Updates

**Initial Alert:**
```
🚨 INCIDENT: Production deployment issue detected
Severity: P1
Impact: Payment processing returning 500 errors
Action: Initiating rollback to previous version
ETA: 5 minutes
```

**Progress Update:**
```
🔄 UPDATE: Rollback in progress
Status: Traffic shifted to previous revision
Current: 100% on revision roompilot-api-00041-xyz
Next: Verifying health checks
```

**Resolution:**
```
✅ RESOLVED: Rollback completed successfully
Duration: 3 minutes
Current Version: roompilot-api-00041-xyz
Status: All systems operational
Next Steps: Root cause analysis scheduled
```

## Post-Rollback Actions

### 1. Immediate Verification (0-5 minutes)

- [ ] Health checks passing
- [ ] API endpoints responding
- [ ] Error rates back to normal
- [ ] Response times acceptable
- [ ] No new errors in logs

### 2. Extended Monitoring (5-30 minutes)

- [ ] Monitor for 30 minutes minimum
- [ ] Check error rates in Cloud Console
- [ ] Review application logs
- [ ] Verify database queries successful
- [ ] Monitor user reports/support tickets

### 3. Root Cause Analysis (Within 24 hours)

**Template:**

```markdown
# Post-Mortem: [Incident Title]

## Summary
- **Date:** 2025-01-15
- **Duration:** 14:30 - 14:35 UTC (5 minutes)
- **Severity:** P1
- **Impact:** Payment processing unavailable, ~100 users affected

## Timeline
- 14:30 - Issue detected (monitoring alert)
- 14:31 - Team notified
- 14:32 - Rollback initiated via GitHub Actions
- 14:34 - Rollback completed
- 14:35 - Service verified healthy

## Root Cause
[Detailed explanation of what caused the issue]

## Resolution
[What fixed the issue]

## Action Items
- [ ] Add integration test for payment flow
- [ ] Improve staging environment to catch this
- [ ] Update monitoring to detect earlier
- [ ] Document lessons learned

## Prevention
[How to prevent this from happening again]
```

### 4. Fix and Redeploy (After analysis)

1. **Reproduce Issue Locally:**
   ```bash
   # Checkout problematic code
   git checkout [failed-commit]

   # Run locally
   ./start-dev.sh

   # Reproduce issue
   ```

2. **Implement Fix:**
   ```bash
   # Create fix branch
   git checkout develop
   git pull
   git checkout -b hotfix/payment-processing

   # Make fixes with tests
   # ...

   # Commit
   git commit -m "fix: Resolve payment processing error"
   ```

3. **Test Thoroughly:**
   ```bash
   # Run all tests
   cd backend
   ./mvnw test

   cd ../frontend
   npm test
   ```

4. **Deploy to Staging:**
   ```bash
   git push origin hotfix/payment-processing
   # Create PR to develop
   # Merge to develop (auto-deploys to staging)
   ```

5. **Verify on Staging:**
   - Test the specific issue that caused rollback
   - Run full integration tests
   - Monitor for 1 hour minimum

6. **Deploy to Production:**
   ```bash
   # Create PR from develop to main
   # Get approval
   # Merge to main
   # Approve production deployment in GitHub Actions
   ```

## Rollback Testing

### Quarterly Rollback Drills

**Purpose:** Ensure team knows procedures and systems work

**Schedule:** First Monday of each quarter

**Procedure:**
1. Deploy test change to staging
2. Wait 5 minutes
3. Execute rollback using Method 1
4. Verify rollback successful
5. Document any issues encountered
6. Update runbook if needed

### Pre-Production Checklist

Before deploying to production:

- [ ] Changes tested locally
- [ ] All CI checks passing
- [ ] Deployed to staging successfully
- [ ] Staging tested for 24+ hours
- [ ] No critical issues in staging
- [ ] Rollback plan identified
- [ ] Team aware of deployment
- [ ] Monitoring ready

## Troubleshooting Rollback Issues

### Rollback Workflow Fails

**Symptom:** GitHub Actions rollback workflow fails

**Diagnosis:**
1. Check workflow logs in GitHub Actions
2. Look for permission errors
3. Verify secrets are configured
4. Check GCP service account permissions

**Solution:**
```bash
# Fallback to manual rollback (Method 2)
gcloud run services update-traffic [SERVICE] \
  --region [REGION] \
  --to-revisions [PREVIOUS-REVISION]=100
```

### Previous Revision Not Available

**Symptom:** No previous revision to rollback to

**Cause:** First deployment or old revisions deleted

**Solution:**
1. Deploy last known good commit manually
2. Use git to find last stable version:
   ```bash
   git log --grep="deploy" --oneline
   git checkout [last-good-commit]
   ```
3. Trigger manual deployment

### Health Checks Fail After Rollback

**Symptom:** Rolled back version also unhealthy

**Diagnosis:**
- Infrastructure issue (database, network)
- Database migration incompatibility
- Environment variable mismatch

**Solution:**
1. Check database connectivity
2. Verify environment variables
3. Check Cloud Run logs
4. May need to rollback database migrations

### Database Migration Conflicts

**Symptom:** Application won't start after rollback

**Error:** `Migration checksum mismatch` or `Migration version conflict`

**Solution:**
1. **DO NOT** delete from flyway_schema_history
2. Options:
   - Deploy version compatible with current DB schema
   - Create new migration to fix schema
   - Restore database from backup (last resort)

## Emergency Contacts

**During Business Hours:**
- Primary: Team Slack #incidents channel
- Secondary: team@roompilot.com

**After Hours:**
- On-call engineer: [PagerDuty/On-call system]
- Escalation: [Manager contact]

## Tools and Resources

### Quick Links

- [GitHub Actions - Rollback Workflow](https://github.com/[org]/roompilot/actions/workflows/rollback.yml)
- [Google Cloud Run Console](https://console.cloud.google.com/run)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Database Console](https://console.neon.tech)
- [CI/CD Architecture Docs](./2_cicd_architecture.md)

### Required Access

- GitHub repository (write access)
- GCP project (Cloud Run admin)
- Vercel project (admin)
- Neon database (admin)

### Commands Cheat Sheet

```bash
# List revisions
gcloud run revisions list --service=[SERVICE] --region=[REGION]

# Rollback
gcloud run services update-traffic [SERVICE] \
  --region=[REGION] \
  --to-revisions=[REVISION]=100

# Check logs
gcloud run services logs tail [SERVICE] --region=[REGION]

# Get service URL
gcloud run services describe [SERVICE] --region=[REGION] --format='value(status.url)'

# Test health
curl [SERVICE-URL]/actuator/health

# Git revert
git revert [COMMIT-SHA]
git push origin [BRANCH]
```

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-15 | 1.0 | Initial rollback runbook | DevOps Team |

---

**⚠️ REMEMBER:** In an emergency, rolling back quickly is more important than perfect documentation. Rollback first, document later!

**📞 If unsure, ask for help in #incidents channel immediately.**
