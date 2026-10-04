# Codex Atlas — Railway CLI Guide

This guide assumes one Railway project with three services:

- `human-body`
- `finance`
- `home`

All three services use the same GitHub repository and branch. The content pack is selected with `CODEX_PACK`.

## 1. Install and authenticate

```bash
npm install -g @railway/cli
railway --version
railway login
railway whoami
```

For a terminal without a browser:

```bash
railway login --browserless
```

## 2. Link the local repository to the Railway project

From the repository root:

```bash
cd ~/github/codex-atlas
railway link
```

Select the existing Codex Atlas Railway project and the `production` environment.

Useful checks:

```bash
railway status
railway environment list
railway service status --all -e production
```

Railway services are environment-scoped at runtime. A service can exist in a project while its service instance is missing from the environment currently targeted by the CLI.

## 3. Switch or explicitly select the environment

Interactive:

```bash
railway environment
```

Select production directly:

```bash
railway environment production
```

For scripts, prefer passing the environment explicitly:

```bash
-e production
```

## 4. Verify the three services

```bash
railway service status --all -e production
```

The output should contain:

```text
human-body
finance
home
```

If one is missing, do not create duplicates immediately. First verify whether it exists in another environment:

```bash
railway environment list
railway service status --all -e <environment-name>
```

## 5. Connect each service to GitHub

If the service source is not already connected:

```bash
railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service human-body

railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service finance

railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service home
```

Once a service is connected to the GitHub branch, pushes to `main` can trigger automatic deployments.

## 6. Set the content pack variables

```bash
railway variable set CODEX_PACK=human-body -s human-body -e production
railway variable set CODEX_PACK=finance -s finance -e production
railway variable set CODEX_PACK=home -s home -e production
```

Verify:

```bash
railway variable list -s human-body -e production --kv
railway variable list -s finance -e production --kv
railway variable list -s home -e production --kv
```

Expected values:

```text
human-body → CODEX_PACK=human-body
finance    → CODEX_PACK=finance
home       → CODEX_PACK=home
```

## 7. Deploy manually from the CLI

GitHub auto-deploy is the normal production workflow. To force a deployment from the local directory:

```bash
railway up --service human-body --environment production
railway up --service finance --environment production
railway up --service home --environment production
```

Check status:

```bash
railway service status --all -e production
```

Check logs:

```bash
railway service logs -s human-body -e production
railway service logs -s finance -e production
railway service logs -s home -e production
```

Or view only the latest lines:

```bash
railway logs -s finance -e production -n 100
```

## 8. Public domains

First list existing domains:

```bash
railway domain list -s human-body -e production
railway domain list -s finance -e production
railway domain list -s home -e production
```

Generate a Railway domain for services that do not yet have one:

```bash
railway domain -s human-body -e production
railway domain -s finance -e production
railway domain -s home -e production
```

Each service must have its own public domain.

### Rename Railway-provided domains

After listing the generated hostname, rename it to a clearer globally available label.

Example:

```bash
railway domain update codex-atlas-production.up.railway.app \
  --domain human-body-codex \
  -s human-body \
  -e production
```

For Finance and Home, replace `<CURRENT_DOMAIN>` with the domain returned by `railway domain list`:

```bash
railway domain update <CURRENT_DOMAIN> \
  --domain finance-codex \
  -s finance \
  -e production

railway domain update <CURRENT_DOMAIN> \
  --domain home-codex \
  -s home \
  -e production
```

If a hostname is already taken, choose another label.

## 9. Troubleshooting: `ServiceInstance not found`

This normally points to a service/environment mismatch, not to the public domain itself.

Run:

```bash
railway status
railway environment list
railway service status --all -e production
```

Then force the environment when managing the domain:

```bash
railway domain list -s finance -e production
railway domain -s finance -e production

railway domain list -s home -e production
railway domain -s home -e production
```

If the error remains, check every environment:

```bash
railway service status --all -e production
railway service status --all -e staging
```

Use only environments that actually exist in `railway environment list`.

If `finance` or `home` is present in the Railway project but absent from `production`, fix the service/environment assignment before creating another service. Avoid creating duplicates just to solve the domain error.

After the correct service instance is available, deploy it and then create the domain:

```bash
railway up -s finance -e production
railway domain -s finance -e production
```

Repeat for `home`.

## 10. Existing Human Body domain

At the time this guide was written, Human Body already had:

```text
https://codex-atlas-production.up.railway.app
```

This is valid. Rename it only if you want a cleaner naming convention.

## 11. Day-to-day Git workflow

```bash
cd ~/github/codex-atlas
git status
git add -A
git commit -m "Update Codex Atlas"
git push origin main
```

If all three services are connected to the same GitHub `main` branch, Railway can automatically redeploy all three while preserving the service-specific variables.

## 12. Useful operational commands

Project and services:

```bash
railway status
railway service status --all
railway open
```

Variables:

```bash
railway variable list -s finance -e production --kv
```

Logs:

```bash
railway logs -s finance -e production -n 100
```

Redeploy the latest deployment:

```bash
railway service redeploy -s finance -e production
```

Restart:

```bash
railway service restart -s finance -e production
```

Domains:

```bash
railway domain list -s finance -e production
```

## 13. `railway.json` deprecation warning

The warning about `railway.json` is separate from the domain problem.

Railway's legacy Config as Code is deprecated. Existing legacy services keep working only until the announced cutoff, so migrate the repository to the current Infrastructure as Code format.

From the repository root:

```bash
railway config migrate
```

Then inspect the generated configuration:

```bash
railway config plan
```

Apply only after reviewing the plan:

```bash
railway config apply
```

Commit the migration:

```bash
git add -A
git commit -m "Migrate Railway configuration to IaC"
git push origin main
```

Do the domain/service cleanup first, then migrate the config so the two changes are easy to debug independently.

## 14. Recommended final state

```text
Railway project: Codex Atlas
Environment:     production

service: human-body
CODEX_PACK=human-body
public domain: human-body-codex.up.railway.app

service: finance
CODEX_PACK=finance
public domain: finance-codex.up.railway.app

service: home
CODEX_PACK=home
public domain: home-codex.up.railway.app
```

The exact Railway-provided hostname depends on global availability.

## Official references

- Railway CLI: https://docs.railway.com/cli
- Services: https://docs.railway.com/services
- Environments: https://docs.railway.com/environments
- Domains: https://docs.railway.com/networking/domains/working-with-domains
- Infrastructure as Code: https://docs.railway.com/infrastructure-as-code
