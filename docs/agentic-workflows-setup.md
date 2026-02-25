# Agentic Workflows Setup Guide

## Overview

This repository uses GitHub Actions workflows that leverage GitHub Copilot CLI for intelligent automation tasks. These workflows are centralized in the [CaroByte/agentic-repo-workflows](https://github.com/CaroByte/agentic-repo-workflows) repository.

## Available Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| 📚 Continuous Documentation | Analyzes code changes and updates documentation automatically | Pull request (code file changes) |
| 🏷️ Smart Issue & PR Labeler | Automatically labels issues and PRs based on content analysis | Issue/PR opened or edited |
| ✍️ Issue Quality Enhancer | Improves issue descriptions and formatting | Issue opened |
| 🏷️✨ Label Beautifier | Standardizes and improves repository labels | Manual trigger |
| 💡 Copilot Suggester | Provides suggestions for improvements | Manual trigger |

## Required Setup

### COPILOT_PAT Secret (Required)

All agentic workflows require a `COPILOT_PAT` secret to authenticate with the GitHub Copilot CLI.

#### Steps to Configure:

1. **Create a Personal Access Token (PAT)**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select the following scopes:
     - `repo` - Full control of private repositories
     - `workflow` - Update GitHub Action workflows
   - The token must belong to a user with Copilot access

2. **Add the Secret to the Repository**
   - Go to Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `COPILOT_PAT`
   - Value: Paste your PAT
   - Click "Add secret"

### Troubleshooting

#### `startup_failure` Conclusion

If workflows show `startup_failure` as their conclusion:

1. **Missing Secret**: The most common cause is the `COPILOT_PAT` secret not being configured
2. **Invalid Secret**: The PAT may have expired or lacks required permissions
3. **Reusable Workflow Access**: Ensure the repository can access the `CaroByte/agentic-repo-workflows` repository

#### Workflow Not Triggering

1. Check that the workflow files are present in `.github/workflows/`
2. Verify the trigger conditions match your actions
3. Review the GitHub Actions tab for any error messages

## Security Considerations

- The `COPILOT_PAT` should have minimal required permissions
- Consider using organization-level secrets if managing multiple repositories
- Regularly rotate the PAT for security
- The workflows include author verification to limit execution to repository owners

## Support

For issues with the reusable workflows, check the [agentic-repo-workflows](https://github.com/CaroByte/agentic-repo-workflows) repository.
