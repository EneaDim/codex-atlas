# Railway release helper

`release.sh` automates the Railway setup/deploy steps for one or more Codex packs.

It deliberately **does not commit or push Git changes**. The script releases the current local working tree first; you decide when to commit and push afterwards.

## Quick use

Release one pack:

```bash
./release.sh climate
```

Release several packs in sequence:

```bash
./release.sh climate survival nutrition
```

Redeploy **all registered Codex** with one command:

```bash
./release.sh all
```

`all` expands automatically from `src/packs/registry.js`, so future packs are included without editing the script.

For each pack the script:

1. runs `npm run check`;
2. verifies that the pack exists in `src/packs/registry.js`;
3. checks whether the Railway service already exists;
4. creates it when missing;
5. connects it to `EneaDim/codex-atlas@main`;
6. sets `CODEX_PACK=<pack>`;
7. deploys the current local working tree with `railway up --detach`;
8. waits for the deployment status;
9. creates a Railway-provided domain if missing;
10. tries to rename it to `codex-<pack>.up.railway.app`;
11. prints the Git commands you can run afterwards.

Example for a renderer-wide update:

```bash
./release.sh all

git status
git add -A
git commit -m "Update Codex Atlas"
git push origin main
```

## Expected domains

| Service / pack | Site |
| --- | --- |
| `human-body` | https://codex-human-body.up.railway.app |
| `finance` | https://codex-finance.up.railway.app |
| `home` | https://codex-home.up.railway.app |
| `statistics` | https://codex-statistics.up.railway.app |
| `climate` | https://codex-climate.up.railway.app |
| `survival` | https://codex-survival.up.railway.app |
| `nutrition` | https://codex-nutrition.up.railway.app |

The final hostname depends on Railway domain availability. If a requested `codex-*` hostname is already taken, the script keeps the generated Railway hostname and prints a warning.

## Requirements

- Node.js 20+
- npm
- Railway CLI
- repository linked to the correct Railway project

Check the context before a release:

```bash
railway status
railway environment list
railway service list -e production
```

## Configuration

Defaults:

```text
Railway environment: production
GitHub repository:   EneaDim/codex-atlas
GitHub branch:       main
Domain prefix:       codex-
Wait timeout:        300 seconds
```

Override them with environment variables:

```bash
RAILWAY_ENVIRONMENT=staging ./release.sh climate
RAILWAY_REPO=EneaDim/codex-atlas ./release.sh climate
RAILWAY_BRANCH=main ./release.sh climate
CODEX_DOMAIN_PREFIX=my-codex- ./release.sh climate
RELEASE_WAIT_SECONDS=600 ./release.sh climate
```

## Why deploy before Git push?

`railway up` uploads the current local working tree directly, so a brand-new pack can be tested on Railway before you publish the commit to GitHub.

The service is also connected to the shared GitHub `main` branch. After you are satisfied:

```bash
git add -A
git commit -m "Add Climate Codex"
git push origin main
```

Future pushes can then use Railway's normal GitHub deployment flow.

## If something fails

Service status:

```bash
railway service list -e production
```

Recent deployment:

```bash
railway deployment list -s climate -e production --limit 3
```

Logs:

```bash
railway logs -s climate -e production --latest -n 100
```

Variables:

```bash
railway variable list -s climate -e production --kv
```

Domains:

```bash
railway domain list -s climate -e production
```

For the complete manual workflow and troubleshooting, see [RAILWAY_CLI.md](RAILWAY_CLI.md).

## NVM / stale Railway CLI path

If the script reports an error similar to:

```text
/home/<user>/.nvm/versions/node/<old-version>/bin/railway: No such file or directory
```

Bash is usually holding a stale executable path from a previous NVM/Node version.

The release helper clears Bash's command cache and resolves the current Railway executable from `PATH` before running. If the CLI is genuinely missing from the active Node installation, run:

```bash
hash -r
npm install -g @railway/cli
railway --version
```

Then rerun the release. The workflow is idempotent: existing services/domains are detected and reused.
