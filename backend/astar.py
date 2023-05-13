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
            self.node.append((n['lat'], n['lng'])) #mbushje e listes me te dhenat per nyjet , formati => [(gjatesi ,gjeresia), (gjatesi ,gjeresia)...]
        for e in _edge:
            self.adj[e['a']].append((e['b'], self.calcDist(e['a'], e['b']))) #mbushja e listes se fqinjesise me te dhena ,formati [[(),()],[()]]
            self.adj[e['b']].append((e['a'], self.calcDist(e['a'], e['b'])))
            self.idxStart = _start
            self.idxEnd = _end
    

    def calcDist(self, a, b):
        return


    def astar():
        return{}

