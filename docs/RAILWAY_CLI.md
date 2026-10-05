# Codex Atlas — Railway CLI Guide

Codex Atlas uses **one GitHub repository** and multiple Railway services.

Each service deploys the same codebase, but loads a different content pack through the `CODEX_PACK` environment variable.

Current production setup:

| Railway service | `CODEX_PACK` | Public site |
| --- | --- | --- |
| `human-body` | `human-body` | https://codex-human-body.up.railway.app |
| `finance` | `finance` | https://codex-finance.up.railway.app |
| `home` | `home` | https://codex-home.up.railway.app |
| `statistics` | `statistics` | `https://codex-statistics.up.railway.app` once created |

All services use:

```text
GitHub repository: EneaDim/codex-atlas
Branch:            main
Environment:       production
Start command:     npm start
```

---

## 1. Install and authenticate

Install the Railway CLI:

```bash
npm install -g @railway/cli
```

Check the installation and log in:

```bash
railway --version
railway login
railway whoami
```

For a terminal without a browser:

```bash
railway login --browserless
```

---

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
railway service list -e production
```

For most multi-service commands it is safer to specify the environment explicitly:

```text
-e production
```

---

# 3. Complete example — add a new Codex to Railway

This is the workflow to follow every time a new content pack is added to the repository.

The example below adds the **Statistics Codex**.

The three values that matter are:

```text
SERVICE_NAME=statistics
CODEX_PACK=statistics
DOMAIN_NAME=codex-statistics
```

For a future Codex, replace those values with the new names.

---

### Step 1 — Push the new Codex to GitHub

First make sure the new pack is committed to the shared repository.

```bash
cd ~/github/codex-atlas

git status
git add -A
git commit -m "Add Statistics Codex"
git push origin main
```

**What this does:**  
The new Statistics code and content are now available on the `main` branch that Railway will deploy.

If Git says there is nothing to commit, just run:

```bash
git push origin main
```

---

### Step 2 — Check the Railway project

```bash
railway status
railway service list -e production
```

**What this does:**  
Confirms that the terminal is linked to the correct Railway project and to the `production` environment.

---

### Step 3 — Create the new Railway service

```bash
railway add \
  --service statistics \
  --variables "CODEX_PACK=statistics"
```

**What this does:**  
Creates an empty Railway service named `statistics` and sets its initial content-pack variable.

If Railway replies:

```text
A service named "statistics" already exists in this project
```

do **not** create another one. Skip this command and continue with the next step.

---

### Step 4 — Connect the service to the shared GitHub repository

```bash
railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service statistics \
  -e production
```

**What this does:**  
Tells the `statistics` Railway service to deploy the same GitHub repository and the same `main` branch used by the other Codex sites.

Future pushes to `main` can then trigger deployments for this service automatically.

---

### Step 5 — Set or verify the content pack

Set the variable explicitly:

```bash
railway variable set \
  CODEX_PACK=statistics \
  -s statistics \
  -e production
```

Check it:

```bash
railway variable list \
  -s statistics \
  -e production \
  --kv
```

Expected output includes:

```text
CODEX_PACK=statistics
```

**What this does:**  
The shared server reads `CODEX_PACK` at runtime and knows that this Railway service must load the Statistics dataset instead of Human Body, Finance or Home.

---

### Step 6 — Check that Railway created the service instance

```bash
railway service list -e production
```

The list should now include:

```text
human-body
finance
home
statistics
```

**What this does:**  
Confirms that the service exists inside the `production` environment.

If `statistics` does not appear yet, wait for the first build or deploy to start and run the command again.

---

### Step 7 — Start the first deployment if necessary

Connecting GitHub normally starts a deployment automatically.

If it does not, deploy the local repository manually:

```bash
railway up \
  --service statistics \
  --environment production
```

**What this does:**  
Uploads the current local repository and deploys it specifically to the `statistics` service.

This command is a fallback for the first deployment; normal production updates should usually come from GitHub pushes.

---

### Step 8 — Inspect deployment status and logs

```bash
railway service list -e production
```

For the latest logs:

```bash
railway logs \
  -s statistics \
  -e production \
  -n 100
```

**What this does:**  
Lets you verify that the build completed and that the Node server started correctly.

Wait until the service is `Online` before configuring the final public URL.

---

### Step 9 — Generate a Railway public domain

```bash
railway domain \
  -s statistics \
  -e production
```

Then list it:

```bash
railway domain list \
  -s statistics \
  -e production
```

**What this does:**  
Creates the Railway-provided `*.up.railway.app` domain for the Statistics service.

Railway allows one Railway-provided domain per service.

---

### Step 10 — Rename the generated Railway domain

Suppose Railway generated:

```text
statistics-production-xxxx.up.railway.app
```

Rename it:

```bash
railway domain update \
  statistics-production-xxxx.up.railway.app \
  --domain codex-statistics \
  -s statistics \
  -e production
```

Check the result:

```bash
railway domain list \
  -s statistics \
  -e production
```

The desired final address is:

```text
https://codex-statistics.up.railway.app
```

**What this does:**  
Keeps the same Railway service and simply gives its Railway-provided hostname a cleaner name.

The requested hostname must be globally available.

---

## 4. Full copy/paste example

For a brand-new `statistics` service, the complete sequence is:

```bash
cd ~/github/codex-atlas

# 1. Publish the new Codex
git status
git add -A
git commit -m "Add Statistics Codex"
git push origin main

# 2. Confirm Railway context
railway status
railway service list -e production

# 3. Create the service
railway add \
  --service statistics \
  --variables "CODEX_PACK=statistics"

# 4. Connect it to GitHub
railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service statistics \
  -e production

# 5. Set the pack explicitly
railway variable set \
  CODEX_PACK=statistics \
  -s statistics \
  -e production

# 6. Verify it
railway variable list \
  -s statistics \
  -e production \
  --kv

railway service list -e production

# 7. Only if an automatic first deploy did not start
railway up \
  --service statistics \
  --environment production

# 8. Inspect logs
railway logs \
  -s statistics \
  -e production \
  -n 100

# 9. Create and inspect the domain
railway domain \
  -s statistics \
  -e production

railway domain list \
  -s statistics \
  -e production
```

After `railway domain list`, copy the actual generated domain and rename it:

```bash
railway domain update \
  <CURRENT_RAILWAY_DOMAIN> \
  --domain codex-statistics \
  -s statistics \
  -e production
```

Finally:

```bash
railway domain list \
  -s statistics \
  -e production
```

---

# 5. Generic template for the next Codex

Assume you later add a pack called:

```text
economics
```

Use exactly the same pattern:

```bash
cd ~/github/codex-atlas

git add -A
git commit -m "Add Economics Codex"
git push origin main

railway add \
  --service economics \
  --variables "CODEX_PACK=economics"

railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service economics \
  -e production

railway variable set \
  CODEX_PACK=economics \
  -s economics \
  -e production

railway variable list \
  -s economics \
  -e production \
  --kv

railway service list -e production

railway domain \
  -s economics \
  -e production

railway domain list \
  -s economics \
  -e production
```

Then rename the generated domain:

```bash
railway domain update \
  <CURRENT_RAILWAY_DOMAIN> \
  --domain codex-economics \
  -s economics \
  -e production
```

That is the full pattern:

```text
new content pack in src/packs/
        ↓
git push
        ↓
new Railway service
        ↓
same GitHub repository
        ↓
CODEX_PACK=<pack-id>
        ↓
Railway domain
```

---

## 6. Existing services and variables

Current expected variables:

```bash
railway variable set CODEX_PACK=human-body -s human-body -e production
railway variable set CODEX_PACK=finance -s finance -e production
railway variable set CODEX_PACK=home -s home -e production
railway variable set CODEX_PACK=statistics -s statistics -e production
```

Verify them:

```bash
railway variable list -s human-body -e production --kv
railway variable list -s finance -e production --kv
railway variable list -s home -e production --kv
railway variable list -s statistics -e production --kv
```

---

## 7. Existing public domains

List all service domains individually:

```bash
railway domain list -s human-body -e production
railway domain list -s finance -e production
railway domain list -s home -e production
railway domain list -s statistics -e production
```

Expected naming convention:

```text
https://codex-human-body.up.railway.app
https://codex-finance.up.railway.app
https://codex-home.up.railway.app
https://codex-statistics.up.railway.app
```

---

## 8. Normal day-to-day deployment

Once the services already exist and are connected to GitHub, you normally do **not** repeat the service setup.

For normal code or content updates:

```bash
cd ~/github/codex-atlas

git status
git add -A
git commit -m "Update Codex Atlas"
git push origin main
```

**What this does:**  
Railway services connected to the `main` branch can automatically rebuild from the new commit while keeping their own `CODEX_PACK` variables.

---

## 9. Manual deployment

To manually deploy one service from the current local directory:

```bash
railway up \
  --service statistics \
  --environment production
```

Other examples:

```bash
railway up -s human-body -e production
railway up -s finance -e production
railway up -s home -e production
```

Use manual deployment mainly for debugging or when GitHub auto-deploy did not trigger.

---

## 10. Logs and status

List all services:

```bash
railway service list -e production
```

Latest service logs:

```bash
railway logs -s statistics -e production -n 100
```

Other examples:

```bash
railway logs -s human-body -e production -n 100
railway logs -s finance -e production -n 100
railway logs -s home -e production -n 100
```

---

## 11. Troubleshooting — `ServiceInstance not found`

If a command such as:

```bash
railway domain -s statistics -e production
```

returns:

```text
ServiceInstance not found
```

first check the environment:

```bash
railway status
railway environment list
railway service list -e production
```

If the service exists in the Railway project but is missing from `production`, do **not** immediately create a duplicate service.

First connect its GitHub source:

```bash
railway service source connect \
  --repo EneaDim/codex-atlas \
  --branch main \
  --service statistics \
  -e production
```

Then start the service if necessary:

```bash
railway up \
  --service statistics \
  --environment production
```

Check again:

```bash
railway service list -e production
```

Only create the public domain after the service instance appears in the environment.

---

## 12. Useful Railway commands

Project:

```bash
railway status
railway open
railway environment list
```

Services:

```bash
railway service list -e production
```

Variables:

```bash
railway variable list -s statistics -e production --kv
```

Logs:

```bash
railway logs -s statistics -e production -n 100
```

Redeploy:

```bash
railway service redeploy -s statistics -e production
```

Restart:

```bash
railway service restart -s statistics -e production
```

Domains:

```bash
railway domain list -s statistics -e production
```

---

## 13. Railway configuration migration

The repository may still show a warning that `railway.json` / `railway.toml` Config as Code is deprecated.

This is independent from service creation or public domains.

When you decide to migrate:

```bash
railway config migrate
```

Inspect the generated Infrastructure as Code configuration:

```bash
railway config plan
```

Apply it only after reviewing the plan:

```bash
railway config apply
```

Commit the migration:

```bash
git add -A
git commit -m "Migrate Railway configuration to IaC"
git push origin main
```

Keep infrastructure migration separate from adding a new Codex whenever possible; it makes problems easier to diagnose.

---

## 14. Recommended production state

```text
Railway project: Codex Atlas
Environment:     production

human-body
  CODEX_PACK=human-body
  https://codex-human-body.up.railway.app

finance
  CODEX_PACK=finance
  https://codex-finance.up.railway.app

home
  CODEX_PACK=home
  https://codex-home.up.railway.app

statistics
  CODEX_PACK=statistics
  https://codex-statistics.up.railway.app
```

The exact Railway-provided hostname depends on global domain availability.

---

## Official Railway references

- CLI: https://docs.railway.com/cli
- Add service: https://docs.railway.com/cli/add
- Services: https://docs.railway.com/cli/service
- Variables: https://docs.railway.com/cli/variable
- Domains: https://docs.railway.com/cli/domain
- Environments: https://docs.railway.com/cli/environment
- Infrastructure as Code: https://docs.railway.com/infrastructure-as-code
