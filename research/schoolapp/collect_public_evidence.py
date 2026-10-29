"""Archive public page/client assets only; never authenticate or query school records."""
import concurrent.futures
import hashlib
import json
import pathlib
import re
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent / 'evidence'
BASE = 'https://www.schoolapp.pk'
# Routes explicitly referenced by the public dashboard/layout client bundles.
ROUTES = ['/students', '/teachers', '/teacher-attendance', '/classes', '/attendance',
          '/exams', '/results', '/fees', '/fee-structure', '/promotion', '/library',
          '/timetable', '/reports', '/accounting', '/birthdays', '/id-cards',
          '/certificates', '/families', '/parents', '/notifications', '/subscription',
          '/settings', '/support', '/parent-portal']


def fetch(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as response:
        return response.read(), dict(response.headers)


def collect(route):
    name = route.strip('/')
    try:
        data, headers = fetch(route)
        (ROOT / (name + '.html')).write_bytes(data)
        (ROOT / (name + '-headers.json')).write_text(json.dumps(headers, indent=2), encoding='utf-8')
        assets = sorted(set(re.findall(r'(?:src|href)="([^" ]+\.js)"', data.decode())))
        for asset in assets:
            target = ROOT / asset.rsplit('/', 1)[1]
            if not target.exists():
                content, _ = fetch(asset)
                target.write_bytes(content)
        return {'route': route, 'status': 'public shell archived; no authenticated execution', 'assets': assets}
    except Exception as exc:
        return {'route': route, 'error': str(exc)}


if __name__ == '__main__':
    ROOT.mkdir(parents=True, exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        index = list(executor.map(collect, ROUTES))
    (ROOT / 'route-index.json').write_text(json.dumps(index, indent=2), encoding='utf-8')
    summaries = {}
    for item in index:
        entries = []
        for asset in item.get('assets', []):
            f = ROOT / asset.rsplit('/', 1)[1]
            text = f.read_text(encoding='utf-8', errors='replace')
            strings = re.findall(r'"((?:[^"\\]|\\.)*)"', text)
            entries.append({'asset': asset, 'sha256': hashlib.sha256(f.read_bytes()).hexdigest(),
                            'strings': [s for s in strings if 3 < len(s) < 350]})
        summaries[item['route']] = entries
    (ROOT / 'route-strings.json').write_text(json.dumps(summaries, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps([{'route': i['route'], 'assets': len(i.get('assets', [])), 'error': i.get('error')} for i in index]))
