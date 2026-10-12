#!/usr/bin/env python3
"""One-off: turn entries.json into content/entries/*.md (front matter + verbatim body)."""
import json,re,sys,os
src=sys.argv[1] if len(sys.argv)>1 else '/workspace/orem/entries.json'
out=os.path.join(os.path.dirname(__file__),'..','content','entries')
d=json.load(open(src))
def slug(rem): return rem.lower().replace('█','redacted')
def q(s): return json.dumps(s or '',ensure_ascii=False)
def aliases(name):
    m=re.search(r'\((.*)\)\s*$',name)
    return [a.strip() for a in re.split(r';|/',m.group(1)) if a.strip()] if m else []
for f in os.listdir(out):
    if f.endswith('.md'): os.remove(os.path.join(out,f))
for e in d['entries']:
    fm=['---',f'rem: {q(e["rem"])}',f'name: {q(e["name"])}','aliases:']+[f'  - {q(a)}' for a in aliases(e['name'])]
    if not aliases(e['name']): fm[-1]='aliases: []'
    t=e.get('type') or ''
    fm+=[f'type: {q(e.get("type",""))}',f'category: {q(e["category"])}',f'object_class: {q(e["object_class"])}',
         f'source: {q(e["catalogue_source"])}',f'source_id: {q(e["catalogue_source_id"])}',
         f'explicit: {"true" if e["explicit"].startswith("EXPLICIT") or e["explicit"].startswith("Y") else "false"}',
         f'notes: {q(e.get("notes",""))}',f'image: {q(e.get("image",""))}','---','']
    body=['## Catalogue record','<!-- type: quote -->',e['quote'],'']
    for s in e.get('full_text') or []:
        meta=f"<!-- type: {s['type']} | source: {s['source']} | translated: {'yes' if s.get('translated_from_italian') else 'no'} -->"
        body+=[f"## {s['section'].replace(chr(10),' ').strip()}",meta,s['text'],'']
    if not e.get('full_text'): body+=['## Source note','<!-- type: note -->','Only a brief mention exists in the sources; the catalogue quote above is verbatim from: '+e['catalogue_source']+'.','']
    open(os.path.join(out,slug(e['rem'])+'.md'),'w').write('\n'.join(fm+body))
print(len(d['entries']))
