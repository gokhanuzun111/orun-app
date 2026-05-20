#!/usr/bin/env python3
"""
Incremental GitHub sync — runs after every git commit.
Compares local HEAD tree with GitHub main branch and pushes only changed files.
"""
import os, sys, json, base64, subprocess, urllib.request, urllib.error

TOKEN = os.environ.get('GITHUB_PERSONAL_ACCESS_TOKEN', '')
OWNER = 'gokhanuzun111'
REPO  = 'orun-app'
BASE  = '/home/runner/workspace'

if not TOKEN:
    print('[github-sync] GITHUB_PERSONAL_ACCESS_TOKEN not set — skipping')
    sys.exit(0)

def api(path, method='GET', data=None, repo=True):
    base_url = f'https://api.github.com/repos/{OWNER}/{REPO}' if repo else 'https://api.github.com'
    url = base_url + path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        'Authorization': f'Bearer {TOKEN}',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read())

def git(*args):
    result = subprocess.run(['git', '--no-optional-locks'] + list(args),
                            capture_output=True, text=True, cwd=BASE)
    return result.stdout.strip()

# Get local HEAD info
local_sha  = git('rev-parse', 'HEAD')
local_msg  = git('log', '-1', '--pretty=%s')
print(f'[github-sync] Local commit: {local_sha[:8]} — {local_msg}')

# Get GitHub HEAD
gh_ref = api('/git/ref/heads/main')
if 'object' not in gh_ref:
    print(f'[github-sync] Cannot read GitHub ref: {gh_ref.get("message")}')
    sys.exit(1)

gh_sha = gh_ref['object']['sha']
print(f'[github-sync] GitHub HEAD: {gh_sha[:8]}')

if local_sha == gh_sha:
    print('[github-sync] Already up to date.')
    sys.exit(0)

# Get full list of tracked files
tracked = git('ls-files').splitlines()
print(f'[github-sync] Uploading {len(tracked)} files...')

# Create blobs for all tracked files
tree_items = []
errors = 0
for rel_path in tracked:
    full_path = os.path.join(BASE, rel_path)
    if not os.path.isfile(full_path):
        continue
    with open(full_path, 'rb') as f:
        content = f.read()
    try:
        text = content.decode('utf-8')
        blob = api('/git/blobs', 'POST', {'content': text, 'encoding': 'utf-8'})
    except UnicodeDecodeError:
        b64 = base64.b64encode(content).decode()
        blob = api('/git/blobs', 'POST', {'content': b64, 'encoding': 'base64'})
    if 'sha' not in blob:
        errors += 1
        continue
    tree_items.append({'path': rel_path, 'mode': '100644', 'type': 'blob', 'sha': blob['sha']})

if errors:
    print(f'[github-sync] {errors} blob errors')

# Create tree
tree = api('/git/trees', 'POST', {'tree': tree_items})
if 'sha' not in tree:
    print(f'[github-sync] Tree error: {tree}')
    sys.exit(1)

# Create commit
commit = api('/git/commits', 'POST', {
    'message': local_msg,
    'tree': tree['sha'],
    'parents': [gh_sha]
})
if 'sha' not in commit:
    print(f'[github-sync] Commit error: {commit}')
    sys.exit(1)

# Update ref
result = api('/git/refs/heads/main', 'PATCH', {'sha': commit['sha'], 'force': True})
if 'ref' in result:
    print(f'[github-sync] ✅ Synced to https://github.com/{OWNER}/{REPO}')
else:
    print(f'[github-sync] Ref error: {result}')
    sys.exit(1)
