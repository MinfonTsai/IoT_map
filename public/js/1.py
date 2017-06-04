import urllib, json,urllib2
import requests
url = "http://127.0.0.1:4300/customer/last/2"
response = urllib.urlopen(url)
data = json.loads(response.read().decode('utf-8'))
for item in data:
	print len(data)
	print(item['address'].split(',')[0])
	print(item['address'].split(',')[1])

	url2 = "http://maps.googleapis.com/maps/api/geocode/json?latlng=24.95872,121.41926"
	headers = {'Accept-Language' : 'zh-tw'}
	request = urllib2.Request(url2, None, headers)
	response = urllib2.urlopen(request)

#response = urllib.urlopen(url2)
	data = json.loads(response.read())
#for item in data:
#        print(item['results']['address_components']['formatted_address'])
	#print(item['results'][0]['formatted_address'])	
#print(data['results'][0]['formatted_address'])

#	latitude = 24.95872
	latitude = item['address'].split(',')[0]
#	longitude = 121.41926
	longitude = item['address'].split(',')[1]
	sensor = 'true'
	base = "http://maps.googleapis.com/maps/api/geocode/json?"
	params = "latlng={lat},{lon}&sensor={sen}".format(lat=latitude,lon=longitude,sen=sensor)
	url = "{base}{params}".format(base=base, params=params)
	response = requests.get(url,headers={"Accept-Language": "zh-tw"})
	add=response.json()['results'][0]['formatted_address']
	print(add)

