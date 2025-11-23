# CI/CD Architecture Documentation

## Overview

RoomPilot uses a comprehensive CI/CD pipeline with GitHub Actions that provides automated testing, code quality enforcement, security scanning, and blue-green deployments with automatic rollback capabilities.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Pull Request Created                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CI Workflow (ci.yml)                      │
├─────────────────────────────────────────────────────────────┤
│ Backend (Parallel)          │ Frontend (Matrix: Node 18,20) │
│ • Enforcer check            │ • ESLint                       │
│ • Checkstyle                │ • Prettier check               │
│ • Compile                   │ • Vitest tests                 │
│ • Unit tests + JaCoCo       │ • Coverage report              │
│ • SpotBugs analysis         │ • Production build             │
│ • Code formatting check     │                                │
│ • Coverage upload           │ • Coverage upload              │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Security Scans (codeql.yml)                   │
├─────────────────────────────────────────────────────────────┤
│ • CodeQL analysis (Java + JavaScript)                        │
│ • SAST (Static Application Security Testing)                │
│ • Security vulnerability detection                           │
│ • Scheduled weekly scans                                     │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Merge to develop → Staging Deploy              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Deployment Workflow (deploy.yml)                │
├─────────────────────────────────────────────────────────────┤
│ 1. Verify: Full CI suite (lint, test, quality)              │
│ 2. Build & Scan: Docker build + Trivy security scan         │
│ 3. Deploy-Staging:                                           │
│    • Deploy with 0% traffic (candidate)                      │
│    • Run smoke tests                                         │
│    • Gradual rollout: 10% → 50% → 100%                      │
│    • Health checks at each stage                             │
│    • Auto-rollback on failure                                │
│ 4. Post-Deploy Tests: Integration tests                     │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          Merge to main → Production Deploy (Manual Gate)     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Production Deployment (deploy.yml)                │
├─────────────────────────────────────────────────────────────┤
│ 1. Manual Approval Required (GitHub Environment Protection)  │
│ 2. Verify: Full CI suite                                    │
│ 3. Build & Scan: Docker + Trivy                             │
│ 4. Deploy-Production:                                        │
│    • Deploy with 0% traffic (candidate)                      │
│    • Comprehensive smoke tests                               │
│    • Performance checks                                      │
│    • Gradual rollout: 10% → 25% → 50% → 75% → 100%         │
│    • Health monitoring at each stage (2min intervals)        │
│    • Auto-rollback on any failure                            │
│ 5. Final Validation                                          │
│ 6. Deployment Metrics Recording                              │
└─────────────────────────────────────────────────────────────┘
```

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Backend Jobs:**
- Maven Enforcer validation
- Checkstyle code style check
- Compilation
- Unit tests with JaCoCo coverage (80% threshold)
- SpotBugs static analysis
- Spotless code formatting check
- Coverage report upload to Codecov

**Frontend Jobs:**
- Parallel matrix strategy (Node.js 18 & 20)
- ESLint validation
- Prettier formatting check
- Vitest unit tests
- Coverage collection (80% threshold)
- Production build verification
- Artifact uploads

**Quality Gate:**
- All checks must pass before merge
- Coverage thresholds enforced
- No critical security vulnerabilities

**Execution Time:** 2-3 minutes

### 2. Security Scanning (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Scheduled weekly (Monday 6 AM UTC)

**Scans:**
- **CodeQL Analysis:** Advanced semantic code analysis
  - Java backend analysis
  - JavaScript frontend analysis
  - Security queries (SAST)
  - Quality queries

- **Results:** Uploaded to GitHub Security tab for tracking

**Execution Time:** 5-10 minutes

### 3. Dependency Management (`.github/dependabot.yml`)

**Automated Updates:**
- **Maven dependencies:** Weekly (backend)
- **npm dependencies:** Weekly (frontend)
- **GitHub Actions:** Weekly
- **Docker base images:** Weekly

**Configuration:**
- Max 10 PRs open per ecosystem
- Auto-labeled by dependency type
- Commit message conventions
- Auto-assigned reviewers

### 4. Deployment Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `develop` → Automatic staging deployment
- Push to `main` → Production deployment (manual approval required)
- Manual workflow dispatch

**Architecture:** Blue-Green Deployment with Gradual Traffic Shifting

#### Phase 1: Verification
```yaml
Jobs:
  - verify:
      - Backend quality checks (all CI jobs)
      - Frontend quality checks (all CI jobs)
```

#### Phase 2: Build & Security Scan
```yaml
Jobs:
  - build-and-scan:
      - Docker image build with Cloud Build
      - Trivy vulnerability scanning
      - Upload scan results to GitHub Security
      - Fail on critical vulnerabilities
```

#### Phase 3: Staging Deployment
```yaml
Jobs:
  - deploy-staging:
      Environment: staging
      Automatic: Yes (on merge to develop)

      Steps:
        1. Capture current revision (for rollback)
        2. Deploy new revision with --no-traffic (0%)
        3. Run smoke tests on candidate URL
           - Health check (/actuator/health)
           - API endpoint tests (/api/messages)
        4. Gradual traffic migration:
           - 10% traffic → Wait 60s → Monitor
           - 50% traffic → Wait 60s → Monitor
           - 100% traffic → Final validation
        5. Post-deployment health check
        6. Auto-rollback on any failure

      Rollback Triggers:
        - Smoke test failures
        - Health check failures (>3 consecutive)
        - Any step failure

      Monitoring: Health checks between each traffic shift
```

#### Phase 4: Production Deployment
```yaml
Jobs:
  - deploy-production:
      Environment: production
      Automatic: No (manual approval required)

      Steps:
        1. GitHub Environment Protection Gate
           - Required reviewers approval
           - Manual trigger
        2. Capture current revision
        3. Deploy new revision with --no-traffic (0%)
        4. Comprehensive smoke tests:
           - Health check with 10 retries
           - API endpoint validation
           - Performance check (response time < 2s warning)
        5. Gradual traffic migration with extended monitoring:
           - 10% traffic → Wait 120s → Health check
           - 25% traffic → Wait 120s → Health check
           - 50% traffic → Wait 120s → Health check
           - 75% traffic → Wait 120s → Health check
           - 100% traffic → Final validation
        6. Final validation (5 attempts)
        7. Record deployment metrics
        8. Auto-rollback on any failure

      Rollback Triggers:
        - Smoke test failures
        - Health check failures
        - Performance degradation
        - Any monitoring failure

      Resources:
        - CPU: 2 cores
        - Memory: 1Gi
        - Min instances: 1 (warm start)
        - Max instances: 50
```

**Deployment Timeline:**
- **Staging:** ~4 minutes (2 traffic shifts)
- **Production:** ~10 minutes (4 traffic shifts + extended monitoring)

### 5. Rollback Workflow (`.github/workflows/rollback.yml`)

**Trigger:** Manual workflow dispatch only

**Inputs:**
- `environment`: staging or production
- `revision`: Specific revision name (optional, defaults to previous)
- `reason`: Rollback justification (required)

**Process:**
```yaml
Jobs:
  1. validate:
      - Validate environment and inputs
      - Determine target service name
      - Identify target revision

  2. rollback:
      Environment: Requires approval matching deployment environment
      Steps:
        1. Get current serving revision
        2. List all available revisions
        3. Determine target revision (specified or auto-detect previous)
        4. Verify target revision exists and is valid
        5. Backup current traffic configuration
        6. Execute rollback (100% traffic to target)
        7. Wait for stabilization (15s)
        8. Verify rollback success
        9. Health check on rolled-back revision
        10. Record rollback metrics
        11. Generate rollback report

  3. post-rollback-tests:
      - Integration test suite
      - Health validation
      - API functionality tests
```

**Rollback Report:**
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

## Required GitHub Secrets

### Cloud Infrastructure
| Secret | Description | Example |
|--------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | `roompilot-prod-12345` |
| `GCP_SA_KEY` | Service account JSON key | Full JSON content |
| `GCP_REGION` | Cloud Run region | `us-central1` |
| `ARTIFACT_REGISTRY_REPO` | Docker repository name | `roompilot-repo` |
| `SERVICE_NAME_STAGING` | Staging service name | `roompilot-api-staging` |
| `SERVICE_NAME_PRODUCTION` | Production service name | `roompilot-api-prod` |
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://...` |

### Optional (Monitoring & Notifications)
| Secret | Description | Required |
|--------|-------------|----------|
| `CODECOV_TOKEN` | Code coverage reporting | Optional |
| `SLACK_WEBHOOK_URL` | Deployment notifications | Optional |

## Environment Protection Rules

### Staging Environment
- **Deployment:** Automatic on merge to `develop`
- **Required Reviewers:** None
- **Wait Timer:** None
- **Branch Restrictions:** `develop` branch only

### Production Environment
- **Deployment:** Manual approval required
- **Required Reviewers:** 1+ team members
- **Wait Timer:** 0 minutes
- **Branch Restrictions:** `main` branch only
- **Prevent Self-Review:** Enabled

## Deployment Strategy Details

### Blue-Green Deployment

**Concept:** Two identical production environments (Blue = Current, Green = New)

**Implementation:**
1. **Green Deployment:** New revision deployed with `--no-traffic`
2. **Validation:** Smoke tests run against green revision's unique URL
3. **Traffic Shift:** Gradual migration from blue to green
4. **Monitoring:** Health checks at each traffic percentage
5. **Rollback:** Instant revert to blue if issues detected
6. **Completion:** Blue revision kept available for emergency rollback

**Benefits:**
- Zero-downtime deployments
- Instant rollback capability
- A/B testing possible
- Reduced risk with gradual rollout
- Production-like testing before full traffic

### Gradual Traffic Rollout

**Staging (3 stages, ~3 minutes):**
```
Current → 10% new → 50% new → 100% new
  0%        90%        50%        0%
Wait        60s        60s
```

**Production (5 stages, ~9 minutes):**
```
Current → 10% new → 25% new → 50% new → 75% new → 100% new
  100%      90%        75%        50%        25%        0%
Wait        120s       120s       120s       120s
```

**Monitoring at Each Stage:**
- HTTP health endpoint check
- Response time validation
- Error rate monitoring
- Container instance health

### Automatic Rollback

**Triggered by:**
1. Failed smoke tests on candidate revision
2. Health check failures (3+ consecutive)
3. Response time degradation (>2s warning threshold)
4. Any workflow step failure during deployment

**Rollback Process:**
1. Detect failure condition
2. Immediately route 100% traffic to previous revision
3. Verify previous revision is serving traffic
4. Run health checks on rolled-back revision
5. Mark deployment as failed
6. Notify team (if configured)

**Recovery Time Objective (RTO):** <30 seconds

## Code Quality Gates

### Backend (Java/Spring Boot)

**Enforced Checks:**
- **Checkstyle:** Google Java Style Guide compliance
- **SpotBugs:** Static bug detection (max effort, low threshold)
- **JaCoCo Coverage:** 80% minimum (lines & branches)
- **Spotless:** Consistent code formatting
- **Maven Enforcer:** Dependency convergence

**Thresholds:**
```xml
<coverage>
  <line>80%</line>
  <branch>80%</branch>
</coverage>
```

### Frontend (React/Vite)

**Enforced Checks:**
- **ESLint:** React hooks rules, refresh rules
- **Prettier:** Consistent formatting
- **Vitest Coverage:** 80% minimum
- **Build:** Production bundle verification

**Thresholds:**
```javascript
{
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
}
```

## Security Scanning

### 1. CodeQL (SAST)
- **Schedule:** Weekly + on every PR
- **Languages:** Java, JavaScript
- **Query Suites:** security-extended, security-and-quality
- **Integration:** Results in GitHub Security tab

### 2. Trivy (Container Scanning)
- **Timing:** Every deployment before traffic
- **Scan Target:** Built Docker image
- **Severity Filter:** CRITICAL, HIGH
- **Action:** Fail deployment on critical vulnerabilities
- **Output:** SARIF format uploaded to GitHub Security

### 3. Dependabot (Dependency Scanning)
- **Frequency:** Weekly (Monday 6 AM UTC)
- **Scope:** Maven, npm, GitHub Actions, Docker
- **Auto-PRs:** Max 10 per ecosystem
- **Versioning:** Semantic versioning for npm

## Monitoring & Observability

### Deployment Metrics

**Collected Metrics:**
```yaml
Environment: production | staging
Status: success | failure
Revision: roompilot-api-00042-abc
Image: us-central1-docker.pkg.dev/.../image:sha
Timestamp: 2025-01-15T14:32:18Z
Duration: 4m 32s
Traffic Stages: 5
Rollbacks: 0
```

### Health Checks

**Endpoints Monitored:**
- `/actuator/health` - Application health
- `/api/messages` - API functionality
- `/actuator/info` - Build information

**Validation:**
- HTTP 200 response code
- Response time <2s (warning threshold)
- Valid JSON response structure

### Coverage Reporting

**Codecov Integration:**
- Separate flags for backend/frontend
- PR comments with coverage diff
- Coverage badges in README
- Historical trend tracking

## Performance Targets

### CI Pipeline
- **PR Checks:** <5 minutes
- **Security Scans:** <10 minutes
- **Deployment (Staging):** <5 minutes
- **Deployment (Production):** <10 minutes
- **Rollback:** <1 minute

### Deployment Reliability
- **Success Rate Target:** >98%
- **Mean Time to Deploy (MTTD):** <5 minutes (staging), <10 minutes (production)
- **Mean Time to Recover (MTTR):** <1 minute (automated rollback)
- **Change Failure Rate Target:** <5%

### Current Performance
✅ Automated tests run on every PR
✅ Linting and code quality checks enforced
✅ Automated deployment to staging on merge to develop
✅ Manual approval gate for production deployment
✅ <5 minute deployment time (staging), <10 minutes (production)
✅ Automated rollback capability on failure

## Best Practices

### 1. Branch Strategy
```
main (production)
├── develop (staging)
│   ├── feature/user-auth
│   ├── feature/api-v2
│   └── bugfix/cors-issue
```

### 2. Commit Messages
```
feat(backend): Add user authentication endpoint
fix(frontend): Resolve CORS issues in API client
chore(deps): Update Spring Boot to 3.2.1
test(backend): Add integration tests for messages API
```

### 3. PR Workflow
1. Create feature branch from `develop`
2. Implement changes with tests
3. Push and create PR to `develop`
4. Wait for CI checks (auto-run)
5. Address any failures
6. Request code review
7. Merge to `develop` (auto-deploys to staging)
8. Test on staging environment
9. Create PR from `develop` to `main`
10. Approve production deployment
11. Monitor production rollout

### 4. Emergency Procedures

**Critical Production Issue:**
1. Immediately trigger manual rollback workflow
2. Provide rollback reason in workflow input
3. Wait for rollback approval
4. Monitor rollback completion
5. Verify system stability
6. Investigate root cause
7. Prepare hotfix
8. Test hotfix in staging
9. Deploy hotfix to production

**Failed Deployment:**
1. Check GitHub Actions logs
2. Review deployment step that failed
3. Check Cloud Run logs if deployment started
4. Automatic rollback should trigger
5. Fix issue locally
6. Re-run CI checks
7. Retry deployment

## Troubleshooting

### Common CI Failures

**Coverage Below Threshold:**
```
JaCoCo coverage check failed: 75% < 80%
```
**Solution:** Add more unit tests to increase coverage

**Checkstyle Violations:**
```
Checkstyle violations: 12 errors
```
**Solution:** Run `./mvnw spotless:apply` to auto-fix formatting

**SpotBugs Issues:**
```
SpotBugs found 3 HIGH priority bugs
```
**Solution:** Review SpotBugs report and fix identified issues

### Deployment Issues

**Trivy Security Scan Failed:**
```
CRITICAL vulnerabilities found in base image
```
**Solution:** Update base image in Dockerfile or add vulnerability exceptions

**Smoke Tests Failed:**
```
Health check failed after 5 attempts
```
**Solution:** Check application logs, database connectivity, environment variables

**Traffic Shift Failed:**
```
Health check failed at 50% traffic
```
**Solution:** Review metrics, check for resource constraints, investigate errors

## Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check security scan results
- Review deployment metrics
- Update documentation if needed

### Monthly Tasks
- Review and update coverage thresholds
- Analyze deployment success rates
- Review and optimize CI performance
- Update security scanning policies

### Quarterly Tasks
- Review IAM permissions
- Update base Docker images
- Review and update dependencies
- Conduct security audit

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Codecov Documentation](https://docs.codecov.com/)
- [CodeQL Documentation](https://codeql.github.com/docs/)

---

**Last Updated:** 2025-01-15
**Pipeline Version:** 2.0
**Maintained By:** RoomPilot Engineering Team
