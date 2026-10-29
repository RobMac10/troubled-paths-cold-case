"""Builds maps.js: two schematic SVG maps from Natural Earth 1:50m country outlines (public domain).
Run: python3 tools/make_maps.py /path/to/ne_50m_admin_0_countries.geojson > maps.js"""
import json, sys, math
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

src = json.load(open(sys.argv[1]))
geoms = [shape(f['geometry']).buffer(0) for f in src['features']]
land = unary_union(geoms)

def build(lon0, lon1, lat0, lat1, width, tol, kx=1.0):
    # equirectangular; kx scales longitude (cos of mid latitude)
    sx = width / ((lon1 - lon0) * kx)
    height = (lat1 - lat0) * sx
    clip = land.intersection(box(lon0 - 1, lat0 - 1, lon1 + 1, lat1 + 1)).simplify(tol, preserve_topology=True)
    def P(lon, lat): return ((lon - lon0) * kx * sx, (lat1 - lat) * sx)
    polys = []
    def addpoly(poly):
        rings = [poly.exterior] + list(poly.interiors)
        d = ''
        for r in rings:
            pts = [P(x, y) for x, y in r.coords]
            d += 'M' + 'L'.join('%.1f %.1f' % p for p in pts) + 'Z'
        polys.append(d)
    if clip.geom_type == 'Polygon': addpoly(clip)
    else:
        for g in clip.geoms: addpoly(g)
    return dict(w=width, h=round(height, 1), land=''.join(polys), lon0=lon0, lon1=lon1, lat0=lat0, lat1=lat1, kx=kx, sx=sx)

world = build(-32, 165, -42, 62, 1000, 0.12)
east = build(29.5, 37.5, 28.3, 33.4, 1000, 0.01, kx=math.cos(math.radians(31)))
out = {}
for k, m in (('world', world), ('east', east)):
    out[k] = dict(w=m['w'], h=m['h'], land=m['land'], lon0=m['lon0'], lon1=m['lon1'], lat0=m['lat0'], lat1=m['lat1'], kx=m['kx'], sx=m['sx'])
print('window.TPMAPS=' + json.dumps(out, separators=(',', ':')) + ';')
