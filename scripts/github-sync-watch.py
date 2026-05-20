#!/usr/bin/env python3
"""
Continuous GitHub sync watcher.
Polls local git HEAD every 30 seconds and pushes changes to GitHub when detected.
"""
import os, sys, json, base64, subprocess, urllib.request, urllib.error, time

TOKEN = os.environ.get('GITHUB_PERSONAL_ACCESS_TOKEN', '')
OWNER = 'gokhanuzun111'
REPO  = 'orun-app'
BASE  = '/home/runner/workspace'
POLL_INTERVAL = 30  # seconds

if not TOKEN:
    print('[github-sync] GITHUB_PERSONAL_ACCESS_TOKEN not set — exiting')
    sys.exit(1)

def api(path, method='GET', data=None):
    url = f'https://api.github.com/repos/{OWNER}/{REPO}{path}'
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
        try:
            return json.loads(e.read())
        except:
            return {'error': str(e)}
    except Exception as e:
        return {'error': str(e)}

def git(*args):
    result = subprocess.run(['git', '--no-optional-locks'] + list(args),
                            capture_output=True, text=True, cwd=BASE)
    return result.stdout.strip()

def sync(local_sha, gh_sha):
    local_msg = git('log', '-1', '--pretty=%s', local_sha)
    print(f'[github-sync] Syncing: {local_sha[:8]} — {local_msg}')

    tracked = git('ls-files').splitlines()
    EXCLUDED = {'.replit', 'replit.nix'}
    tree_items = []
    errors = 0

    for rel_path in tracked:
        if rel_path in EXCLUDED:
            continue
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

    tree = api('/git/trees', 'POST', {'tree': tree_items})
    if 'sha' not in tree:
        print(f'[github-sync] Tree error: {tree}')
        return False

    commit = api('/git/commits', 'POST', {
        'message': local_msg,
        'tree': tree['sha'],
        'parents': [gh_sha]
    })
    if 'sha' not in commit:
        print(f'[github-sync] Commit error: {commit}')
        return False

    result = api('/git/refs/heads/main', 'PATCH', {'sha': commit['sha'], 'force': True})
    if 'ref' in result:
        print(f'[github-sync] ✅ Synced! https://github.com/{OWNER}/{REPO} ({len(tree_items)} files, {errors} errors)')
        return True
    else:
        print(f'[github-sync] Ref error: {result}')
        return False

print(f'[github-sync] Watching for changes every {POLL_INTERVAL}s...')
print(f'[github-sync] Target: https://github.com/{OWNER}/{REPO}')

last_synced_sha = None

while True:
    try:
        local_sha = git('rev-parse', 'HEAD')

        # Get GitHub HEAD
        gh_ref = api('/git/ref/heads/main')
        gh_sha = gh_ref.get('object', {}).get('sha', '')

        if not gh_sha:
            print(f'[github-sync] Cannot read GitHub ref: {gh_ref.get("message", "unknown")}')
        elif local_sha != gh_sha and local_sha != last_synced_sha:
            success = sync(local_sha, gh_sha)
            if success:
                last_synced_sha = local_sha
        else:
            print(f'[github-sync] Up to date ({local_sha[:8]})')

    except Exception as e:
        print(f'[github-sync] Error: {e}')

    time.sleep(POLL_INTERVAL)
