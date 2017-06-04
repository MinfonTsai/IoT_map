# -*- coding: UTF-8 -*-

import sys
import threading, time
from polyline import decode
import re
from socketIO_client import SocketIO
import json
import linecache
import random
import requests

FILE_N = 'gpsrun.txt'
lines_sum = len(open(FILE_N,'rU').readlines())
lat=''
lng=''

print lines_sum
for i in range(1,lines_sum):
	addr_str = linecache.getline(FILE_N, i)
	points=decode(addr_str)

	for point in points:
		lat = point[1]
		lng = point[0]
		break

	print lat,lng


	url = 'http://35.162.175.19:4300/customers/add'
	payload = {'address': '123.1,456.7'}
	headers = {'Content-Type': 'application/json; charset=utf-8','Accept':'application/json'}

	payload['address']=str(lat)+','+str(lng)
	payload['name']='PinTester2'

	print payload
# POST with form-encoded data
	r = requests.post(url, data=json.dumps(payload), headers=headers)
	print r.status_code
