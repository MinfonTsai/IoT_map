# -*- coding: UTF-8 -*-

import sys
import threading, time
from polyline import decode
import re
from socketIO_client import SocketIO
import json
import linecache
import random


#print 'Number of arguments:', len(sys.argv), 'arguments.'
#print 'Argument List:', str(sys.argv)

if len(sys.argv) == 1:
	size = 10
else:
	size = int(sys.argv[1])

if size < 1:
	size = 10

#print size


FILE_N = 'gpsrun.txt'
lines_sum = len(open(FILE_N,'rU').readlines())

random_list = []# [1,2,3,4,5,6,7,8,9,10]

for i in range(1, size+1, 1):
	#random_list[i]=random.randint(2,lines_sum-1)
	random_list.append(random.randint(2,lines_sum-1))

print random_list

#exit()


def get_rand_except(random_list, start, stop):
	while True:
		v = random.randint(start, stop)
		if v not in random_list:
			break;
	return v


class LineProc (threading.Thread):
	def __init__(self, sn, sl, detail):
		super(LineProc, self).__init__()
		self.sn = sn
		self.detail = detail
		self.sl  = sl
	def run(self):
		while True:
			line=get_rand_except(random_list, 2, lines_sum-1)
			addr_str = linecache.getline(FILE_N, line)
			points=decode(addr_str)

			for point in points:
				self.detail['coords'][0]['lat'] = point[1]
				self.detail['coords'][0]['lng'] = point[0]
				print 'Send[', self.sn, '] =>',self.detail
				socketIO.emit('send:coords', self.detail )
				#socketIO.wait_for_callbacks(seconds=1)
				time.sleep(2)
			if (self.sn==1):
				time.sleep(self.sl)
			else:
				time.sleep(random.randint(15,60))

with SocketIO('127.0.0.1', 12800) as socketIO:
	for i in range(1, size+1, 1):
        	LineProc(i, 15, { "id": str(i)+"122334455", "coords": [{ "lat": 8, "lng": 8, "acr": 15 }]}).start()


