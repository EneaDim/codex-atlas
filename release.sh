#!/usr/bin/env bash
set -euo pipefail

# Codex Atlas Railway release helper.
#
# Usage:
#   ./release.sh climate
#   ./release.sh climate survival nutrition
#
# The script deploys the current local working tree to Railway.
# Git commit/push is intentionally left to you after the Railway release.
#
# Optional environment overrides:
#   RAILWAY_ENVIRONMENT=production
#   RAILWAY_REPO=EneaDim/codex-atlas
#   RAILWAY_BRANCH=main
#   CODEX_DOMAIN_PREFIX=codex-
#   RELEASE_WAIT_SECONDS=300

ENVIRONMENT="${RAILWAY_ENVIRONMENT:-production}"
REPO="${RAILWAY_REPO:-EneaDim/codex-atlas}"
BRANCH="${RAILWAY_BRANCH:-main}"
DOMAIN_PREFIX="${CODEX_DOMAIN_PREFIX:-codex-}"
WAIT_SECONDS="${RELEASE_WAIT_SECONDS:-300}"

say() { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }
ok()  { printf '\033[1;32m✓\033[0m %s\n' "$*"; }
warn(){ printf '\033[1;33m!\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31mError:\033[0m %s\n' "$*" >&2; exit 1; }

command -v railway >/dev/null 2>&1 || die "Railway CLI not found. Install it with: npm install -g @railway/cli"
command -v node >/dev/null 2>&1 || die "Node.js is required."
command -v npm >/dev/null 2>&1 || die "npm is required."

[[ $# -gt 0 ]] || {
  cat <<'EOF'
Usage:
  ./release.sh <pack> [pack...]

Examples:
  ./release.sh climate
  ./release.sh climate survival nutrition

The Railway service name is the pack id.
The requested Railway domain is codex-<pack>.up.railway.app.
EOF
  exit 2
}

pack_exists() {
  local pack="$1"
  PACK_TO_CHECK="$pack" node --input-type=module - <<'NODE'
import { isPackId } from './src/packs/registry.js';
process.exit(isPackId(process.env.PACK_TO_CHECK) ? 0 : 1);
NODE
}

service_exists() {
  local service="$1"
  local json
  json="$(railway service list -e "$ENVIRONMENT" --json 2>/dev/null || true)"
  SERVICE_TO_CHECK="$service" node -e '
    const fs=require("fs");
    const name=process.env.SERVICE_TO_CHECK;
    let data;
    try { data=JSON.parse(fs.readFileSync(0,"utf8")); } catch { process.exit(1); }
    const seen=[];
    const walk=(v)=>{
      if(Array.isArray(v)) return v.forEach(walk);
      if(v && typeof v==="object"){
        if(typeof v.name==="string") seen.push(v.name);
        Object.values(v).forEach(walk);
      }
    };
    walk(data);
    process.exit(seen.includes(name) ? 0 : 1);
  ' <<<"$json"
}

current_service_domain() {
  local service="$1"
  local json
  json="$(railway domain list -s "$service" -e "$ENVIRONMENT" --json 2>/dev/null || true)"
  node -e '
    const fs=require("fs");
    let data;
    try { data=JSON.parse(fs.readFileSync(0,"utf8")); } catch { process.exit(0); }
    const hits=[];
    const walk=(v)=>{
      if(Array.isArray(v)) return v.forEach(walk);
      if(v && typeof v==="object") return Object.values(v).forEach(walk);
      if(typeof v==="string" && v.includes(".up.railway.app")) hits.push(v.replace(/^https?:\/\//,""));
    };
    walk(data);
    console.log(hits[0] || "");
  ' <<<"$json"
}

latest_deployment_status() {
  local service="$1"
  railway deployment list -s "$service" -e "$ENVIRONMENT" --json --limit 1 2>/dev/null |
    node -e '
      const fs=require("fs");
      let data;
      try { data=JSON.parse(fs.readFileSync(0,"utf8")); } catch { process.exit(0); }
      const first=Array.isArray(data) ? data[0] : (data.deployments?.[0] ?? data[0]);
      console.log(first?.status || first?.deploymentStatus || "");
    '
}

wait_for_deployment() {
  local service="$1"
  local elapsed=0
  local status=""
  while (( elapsed < WAIT_SECONDS )); do
    status="$(latest_deployment_status "$service")"
    case "$status" in
      SUCCESS)
        ok "$service deployment reached SUCCESS"
        return 0
        ;;
      FAILED|CRASHED|REMOVED)
        die "$service deployment ended with status $status. Check: railway logs -s $service -e $ENVIRONMENT --latest -n 100"
        ;;
      *)
        printf '  %-12s %s\r' "${status:-WAITING}" "$service"
        sleep 5
        elapsed=$((elapsed + 5))
        ;;
    esac
  done
  printf '\n'
  warn "Timed out waiting for $service after ${WAIT_SECONDS}s. Check with: railway deployment list -s $service -e $ENVIRONMENT"
  return 0
}

say "Validating repository"
npm run check
ok "Repository checks passed"

say "Checking Railway context"
railway status >/dev/null
ok "Railway project is linked"

released=()

for pack in "$@"; do
  service="$pack"
  desired_domain="${DOMAIN_PREFIX}${pack}"

  pack_exists "$pack" || die "Unknown CODEX_PACK '$pack'. Add it to src/packs/registry.js first."

  say "Releasing $pack"

  if service_exists "$service"; then
    ok "Service '$service' already exists"
  else
    railway add --service "$service" --variables "CODEX_PACK=$pack"
    ok "Created Railway service '$service'"
  fi

  say "Connecting $service to $REPO@$BRANCH"
  if railway service source connect \
      --repo "$REPO" \
      --branch "$BRANCH" \
      --service "$service" \
      -e "$ENVIRONMENT"; then
    ok "GitHub source connected"
  else
    warn "Source connect returned a non-zero exit code. Continuing because the service may already be connected."
  fi

  say "Setting CODEX_PACK=$pack"
  railway variable set "CODEX_PACK=$pack" \
    -s "$service" \
    -e "$ENVIRONMENT" \
    --skip-deploys
  ok "Service variable set"

  say "Deploying current local working tree"
  railway up \
    --service "$service" \
    --environment "$ENVIRONMENT" \
    --detach
  wait_for_deployment "$service"

  say "Ensuring public Railway domain"
  domain="$(current_service_domain "$service")"
  if [[ -z "$domain" ]]; then
    railway domain -s "$service" -e "$ENVIRONMENT" >/dev/null
    sleep 2
    domain="$(current_service_domain "$service")"
  fi

  if [[ -z "$domain" ]]; then
    warn "Could not detect a Railway-provided domain for $service."
  elif [[ "$domain" == "${desired_domain}.up.railway.app" ]]; then
    ok "Domain already named $domain"
  else
    say "Renaming $domain → ${desired_domain}.up.railway.app"
    if railway domain update "$domain" \
        --domain "$desired_domain" \
        -s "$service" \
        -e "$ENVIRONMENT"; then
      domain="${desired_domain}.up.railway.app"
      ok "Domain renamed"
    else
      warn "Could not rename the domain (the requested hostname may already be taken). Keeping $domain."
    fi
  fi

  printf '\n  %s\n  https://%s\n' "$service" "${domain:-<domain not detected>}"
  released+=("$service")
done

say "Release complete"
printf 'Released services: %s\n' "${released[*]}"

cat <<EOF

Railway is done. Git is intentionally separate.

Suggested next commands:
  git status
  git add -A
  git commit -m "Add ${released[*]} Codex"
  git push origin $BRANCH

Check all services:
  railway service list -e $ENVIRONMENT
EOF
