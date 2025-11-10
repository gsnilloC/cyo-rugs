# NPM Registry Configuration

## Problem
GitHub Actions was failing because npm was trying to use company Artifactory instead of public npm registry.

## Solution
We've implemented multiple safeguards to ensure the public npm registry is used:

### 1. `.npmrc` File
Created at project root with:
```
registry=https://registry.npmjs.org/
```

### 2. GitHub Actions Configuration
Updated `.github/workflows/ci-cd.yml` to:
- Set registry URL in Node.js setup
- Explicitly configure npm registry
- Clean npm cache before install
- Pass `--registry` flag to npm ci

### 3. Steps Taken
```yaml
- name: Setup Node.js
  with:
    registry-url: 'https://registry.npmjs.org/'

- name: Configure npm registry
  run: npm config set registry https://registry.npmjs.org/

- name: Clean npm cache
  run: npm cache clean --force

- name: Install dependencies
  run: npm ci --registry=https://registry.npmjs.org/
```

## Testing
After committing these changes, the pipeline should:
1. ✅ Use public npm registry
2. ✅ Successfully install dependencies
3. ✅ Run tests without registry issues

## Local Development
The `.npmrc` file also ensures your local development uses the public registry, avoiding any Artifactory issues on your work machine.

