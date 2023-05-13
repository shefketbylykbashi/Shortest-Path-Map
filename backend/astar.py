import json
import heapq
import math

class Graph:
    node = [] #nyjet
    adj = [] #lista e fqinjesise
    idxStart = 0 
    idxEnd = 0   


    def __init__(self, _node, _edge, _start, _end): #konstruktori
        self.node = [] # lista e nyjeve
        self.adj = [[] for i in _node] # krijimi i listes se fqinjesise per secilen nyje
        for n in _node:
            self.node.append((n['lat'], n['lng'])) #mbushje e listes me te dhenat per nyjet , formati => [(gjersi,gjatesi), (gjeresia,gjatesi)...]
        for e in _edge:
            self.adj[e['a']].append((e['b'], self.calcDist(e['a'], e['b']))) #mbushja e listes se fqinjesise me te dhena ,formati [[pernyjenO(destinacioni , pesha),()],[()]]
            self.adj[e['b']].append((e['a'], self.calcDist(e['a'], e['b'])))
        self.idxStart = _start
        self.idxEnd = _end
    

    def calcDist(self, a, b):
        return 111 * math.sqrt(
			(self.node[a][0] - self.node[b][0]) * (self.node[a][0] - self.node[b][0]) +
			(self.node[a][1] - self.node[b][1]) * (self.node[a][1] - self.node[b][1])) 
    

    #inplementimi i algoritmit astar per shortest path
    def astar(self):
        return{}
 
 
def receive(req):
	g = Graph(
		json.loads(req['node']),
		json.loads(req['edge']),
		json.loads(req['start']),
		json.loads(req['end'])
	) #responsi qe presum 
	return g.astar()


