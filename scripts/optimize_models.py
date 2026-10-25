import json,struct,io
from pathlib import Path
from PIL import Image
root=Path('animal-ar-360/dist/assets/models')
for key in ['dog','elephant','lion','giraffe']:
 source=Path('candidate-'+('elephant-original' if key=='elephant' else key)+'.glb');b=source.read_bytes();ln=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+ln]);old=b[28+ln:]
 j.pop('animations',None)
 used=set()
 for mesh in j.get('meshes',[]):
  for primitive in mesh['primitives']:
   used.update(primitive.get('attributes',{}).values())
   if 'indices' in primitive:used.add(primitive['indices'])
   for target in primitive.get('targets',[]):used.update(target.values())
 for skin in j.get('skins',[]):
  if 'inverseBindMatrices' in skin:used.add(skin['inverseBindMatrices'])
 amap={oldid:newid for newid,oldid in enumerate(sorted(used))}
 for mesh in j.get('meshes',[]):
  for primitive in mesh['primitives']:
   primitive['attributes']={k:amap[v] for k,v in primitive.get('attributes',{}).items()}
   if 'indices' in primitive:primitive['indices']=amap[primitive['indices']]
   for target in primitive.get('targets',[]):
    for k in target:target[k]=amap[target[k]]
 for skin in j.get('skins',[]):
  if 'inverseBindMatrices' in skin:skin['inverseBindMatrices']=amap[skin['inverseBindMatrices']]
 j['accessors']=[j['accessors'][i] for i in sorted(used)]
 needed={a['bufferView'] for a in j['accessors'] if 'bufferView' in a}
 for a in j['accessors']:
  for part in a.get('sparse',{}).values():
   if isinstance(part,dict) and 'bufferView' in part:needed.add(part['bufferView'])
 needed.update(im['bufferView'] for im in j.get('images',[]) if 'bufferView' in im)
 vmap={oldid:newid for newid,oldid in enumerate(sorted(needed))}
 for a in j['accessors']:
  if 'bufferView' in a:a['bufferView']=vmap[a['bufferView']]
  for part in a.get('sparse',{}).values():
   if isinstance(part,dict) and 'bufferView' in part:part['bufferView']=vmap[part['bufferView']]
 for im in j.get('images',[]):
  if 'bufferView' in im:im['bufferView']=vmap[im['bufferView']]
 j['bufferViews']=[j['bufferViews'][i] for i in sorted(needed)]
 if key=='dog':
  for m in j.get('materials',[]):
   ext=m.get('extensions',{}).pop('KHR_materials_pbrSpecularGlossiness',None)
   if ext:
    p={'baseColorFactor':ext.get('diffuseFactor',[1,1,1,1]),'metallicFactor':0,'roughnessFactor':0.88}
    if 'diffuseTexture' in ext:p['baseColorTexture']=ext['diffuseTexture']
    m['pbrMetallicRoughness']=p
  for k in ['extensionsUsed','extensionsRequired']:
   if k in j:j[k]=[x for x in j[k] if x!='KHR_materials_pbrSpecularGlossiness']
 replacements={}
 for im in j.get('images',[]):
  if 'bufferView' not in im:continue
  vi=im['bufferView'];v=j['bufferViews'][vi];image=Image.open(io.BytesIO(old[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]))
  image.thumbnail((1536,1536),Image.Resampling.LANCZOS);out=io.BytesIO()
  alpha='A' in image.getbands() and image.getchannel('A').getextrema()[0]<255
  if alpha:image.convert('RGBA').save(out,format='PNG',optimize=True);im['mimeType']='image/png'
  else:image.convert('RGB').save(out,format='JPEG',quality=90,optimize=True);im['mimeType']='image/jpeg'
  replacements[vi]=out.getvalue()
 new=bytearray()
 for i,v in enumerate(j['bufferViews']):
  while len(new)%4:new.append(0)
  data=replacements.get(i,old[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']]);v['byteOffset']=len(new);v['byteLength']=len(data);new.extend(data)
 while len(new)%4:new.append(0)
 if key=='giraffe':
  for node in j['nodes']:
   if node.get('name') in ['Circle','Circle_0']:
    node.pop('mesh',None);node['children']=[]
  j['materials'][1]['pbrMetallicRoughness']['metallicFactor']=0
  j['materials'][1]['pbrMetallicRoughness']['roughnessFactor']=0.85
  j['materials'][2]['pbrMetallicRoughness']['metallicFactor']=0
  j['materials'][2]['pbrMetallicRoughness']['roughnessFactor']=0.3
 j['buffers'][0]['byteLength']=len(new);js=json.dumps(j,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
 result=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(new))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(new),0x004e4942)+new
 (root/(key+'.glb')).write_bytes(result);print(key,len(b),'->',len(result))
