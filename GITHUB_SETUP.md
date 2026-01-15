# GitHub Repository Setup Guide

This guide will help you push your ecommerce-nestjs-microservices project to GitHub.

## Prerequisites

- Git installed and configured
- GitHub account
- GitHub CLI or web browser access

## Step-by-Step Instructions

### Step 1: Create a GitHub Repository

**Option A: Using GitHub Web Interface (Recommended for beginners)**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `ecommerce-nestjs-microservices` (or your preferred name)
   - **Description**: "E-Commerce System built with NestJS Microservices, PostgreSQL, RabbitMQ, and Next.js"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**
5. **Copy the repository URL** (you'll need it in Step 3)
   - HTTPS: `https://github.com/YOUR_USERNAME/ecommerce-nestjs-microservices.git`
   - SSH: `git@github.com:YOUR_USERNAME/ecommerce-nestjs-microservices.git`

**Option B: Using GitHub CLI**

```bash
gh repo create ecommerce-nestjs-microservices --public --source=. --remote=origin --push
```

### Step 2: Stage and Commit Your Files

From the project root (`ecommerce-nestjs-microservices`), run:

```bash
# Check what files will be added
git status

# Add all files (respects .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: E-Commerce System with NestJS Microservices

- Product & Order Management Service
- Customer Management Service  
- PostgreSQL integration with TypeORM migrations
- RabbitMQ event-driven communication
- Next.js frontend with cart and checkout
- Swagger API documentation
- Multi-environment configuration support
- Docker Compose setup"
```

### Step 3: Add Remote and Push

```bash
# Add GitHub repository as remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-nestjs-microservices.git

# Verify remote was added
git remote -v

# Push to GitHub (first time)
git push -u origin main
```

**Note**: If your default branch is `master` instead of `main`:
```bash
git branch -M main
git push -u origin main
```

### Step 4: Verify

1. Go to your GitHub repository page
2. You should see all your files
3. Check that sensitive files (`.env`, `node_modules`, `dist`) are NOT visible

## Troubleshooting

### Authentication Issues

**If you get authentication errors:**

1. **Use Personal Access Token (PAT)**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Use token as password when pushing

2. **Or use SSH**:
   ```bash
   # Generate SSH key if you don't have one
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to GitHub: Settings → SSH and GPG keys → New SSH key
   # Then use SSH URL:
   git remote set-url origin git@github.com:YOUR_USERNAME/ecommerce-nestjs-microservices.git
   ```

### Branch Name Issues

If you get "main branch doesn't exist":
```bash
git branch -M main
git push -u origin main
```

### Large Files Warning

If you see warnings about large files:
```bash
# Check for large files
git ls-files | xargs ls -la | sort -k5 -rn | head -10

# Remove large files from git history if needed (use git-filter-repo or BFG)
```

## What Gets Pushed

✅ **Included**:
- Source code (`.ts`, `.tsx` files)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (README, markdown files)
- Docker Compose files
- Example environment files (`.env.example`)

❌ **Excluded** (via `.gitignore`):
- `node_modules/` - Dependencies
- `dist/` - Build outputs
- `.env` - Environment variables (sensitive)
- `.env.local` - Local overrides
- Log files
- IDE files

## Next Steps After Pushing

1. **Add repository description and topics** on GitHub
2. **Create a LICENSE file** if needed
3. **Set up GitHub Actions** for CI/CD (optional)
4. **Add collaborators** if working in a team
5. **Create issues and milestones** for project tracking

## Quick Reference Commands

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/your-feature-name
```

## Best Practices

1. **Never commit sensitive data**: Double-check `.env` files are gitignored
2. **Write meaningful commit messages**: Describe what and why
3. **Commit frequently**: Small, logical commits are better
4. **Use branches**: Create feature branches for new work
5. **Keep README updated**: Document changes and new features

