import json
import urllib


f = open('all sens','r')

for i in range(0,100):
	x = int(f.readline())
	y = urllib.urlopen('https://www.govtrack.us/api/v2/person/'+str(x)).read()
	y = json.loads(y)
	z = str(x)+'.json'
	zx = open(z,'w')
	json.dump(y['committeeassignments'],zx)
	zx.close()

