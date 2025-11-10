# CI/CD Pipeline Setup Guide

## Overview
This repository uses GitHub Actions for continuous integration and deployment to Heroku.

## Pipeline Structure

### 🔄 Workflow Triggers
- **Push to branches**: ALL branches (tests run on every push)
- **Pull requests**: ALL branches (tests run on every PR)
- **Deployment**: Only from `main` branch (requires manual approval)

### 📋 Jobs

#### Build and Test (Runs on all pushes/PRs)
- ✅ Installs dependencies
- ✅ Runs ESLint (code quality checks)
- ✅ Runs frontend unit tests
- ✅ Builds the React application
- ✅ Uploads build artifacts and coverage reports
- 🔜 Backend integration tests (coming soon)
- 🔜 End-to-end tests with Playwright (coming soon)

**Note:** Deployment is handled automatically by Heroku when you push to `main` branch.

## 🔧 Heroku Setup

For automatic deployments from GitHub:

1. Go to your Heroku Dashboard: https://dashboard.heroku.com/apps/cyo-rugs-frontend
2. Click **Deploy** tab
3. Choose **GitHub** as deployment method
4. Connect your repository
5. Enable **Automatic Deploys** from `main` branch
6. *(Optional)* Enable **Wait for CI to pass before deploy** - This ensures tests pass before Heroku deploys

That's it! No GitHub secrets needed. 🎉

## 🚀 How It Works

### For Feature Development:
```bash
# Working on a feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# GitHub Actions will:
# ✅ Run tests and build
# ✅ Verify code quality
# ❌ Will NOT deploy (not main branch)
```

### For Production Deployment:
```bash
# Merge to main
git checkout main
git merge feature/new-feature
git push origin main

# What happens:
# 1. ✅ GitHub Actions runs all tests and builds
# 2. ✅ If tests pass, Heroku automatically deploys
# 3. 🚀 Your app is live!
```

## 📊 Viewing Results

### Build Status Badge
Add this to your README.md:
```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/cyo-rugs/actions/workflows/ci-cd.yml/badge.svg)
```

### Test Coverage
- Coverage reports are uploaded as artifacts
- Available for 30 days after each run
- Download from: Actions → [Workflow Run] → Artifacts

### Deployment Status
- Check the **Environments** section in your repo
- Shows deployment history and status
- URL: https://cyo-rugs-frontend.herokuapp.com

## 🔧 Troubleshooting

### Build Fails
- Check the Actions tab for detailed logs
- Common issues:
  - Linting errors: Fix code style issues
  - Test failures: Fix failing tests
  - Build errors: Check for syntax or import errors

### Deployment Fails
- Verify Heroku secrets are correct
- Check Heroku app name matches
- Ensure Heroku API key hasn't expired
- Check Heroku app logs: `heroku logs --tail -a cyo-rugs-frontend`

### Health Check Fails
- Wait a few minutes for Heroku to fully start
- Check if app is sleeping (free tier)
- Verify database is connected
- Check environment variables in Heroku

## 📝 Adding New Tests

As you add more tests, uncomment the relevant sections in `.github/workflows/ci-cd.yml`:

### Backend Tests
```yaml
- name: Run backend integration tests
  run: npm run test:backend
```

### E2E Tests
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```

## 🎯 Next Steps

1. ✅ Add GitHub secrets (HEROKU_API_KEY, HEROKU_APP_NAME, HEROKU_EMAIL)
2. ✅ Set up production environment with manual approval
3. ✅ Test the pipeline by pushing to a branch
4. 🔜 Add unit tests for React components
5. 🔜 Add backend integration tests
6. 🔜 Add E2E tests with Playwright
7. 🔜 Configure test coverage thresholds

## 💡 Best Practices

- Always create feature branches from `develop`
- Run tests locally before pushing: `npm test`
- Keep `main` branch stable and deployable
- Use meaningful commit messages
- Review build logs after each push
- Monitor production after deployments

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Heroku Deployment Documentation](https://devcenter.heroku.com/articles/github-integration)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)


