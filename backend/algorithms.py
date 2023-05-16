import json
import heapq
import math


class Graph:
    node = []  # nyjet
    adj = []  # lista e fqinjesise
    idxStart = 0
    idxEnd = 0

    def __init__(self, _node, _edge, _start, _end):  # konstruktori
        self.node = []  # lista e nyjeve
        self.adj = [[] for i in _node]  # krijimi i listes se fqinjesise per secilen nyje
        for n in _node:
            self.node.append((n['lat'], n['lng']))  # mbushje e listes me te dhenat per nyjet , formati => [(gjersi,gjatesi), (gjeresia,gjatesi)...]
        for e in _edge:
            self.adj[e['a']].append((e['b'], self.calcDist(e['a'], e['b'])))  # mbushja e listes se fqinjesise me te dhena, formati [[per nyjen O: (destinacioni , pesha),()],[()]]
            self.adj[e['b']].append((e['a'], self.calcDist(e['a'], e['b'])))
        self.idxStart = _start
        self.idxEnd = _end

    def calcDist(self, a, b):
        return 111 * math.sqrt(
            (self.node[a][0] - self.node[b][0]) * (self.node[a][0] - self.node[b][0]) +
            (self.node[a][1] - self.node[b][1]) * (self.node[a][1] - self.node[b][1]))

        # implementimi i algoritmit astar per shortest path

    def astar(self):
        dist = [-1 for i in self.node]
        pre = [i for i in range(len(self.node))]
        pq = []  # elementet : [0] => vlera totale A* ,[1] => distanca aktuale , [2] => indeksi destinacionit , [3] => indeksi i nyjes paraardhese

        heapq.heappush(pq, (0, 0, self.idxStart, self.idxStart))
        while (len(pq) > 0):
            top = heapq.heappop(pq)
            if dist[top[2]] == -1:
                dist[top[2]] = top[1]
                pre[top[2]] = top[3]
                if top[2] == self.idxEnd:
                    break
                for n in self.adj[top[2]]:
                    heapq.heappush(pq, (top[1] + n[1] + self.calcDist(self.idxEnd, n[0]), top[1] + n[1], n[0], top[2]))

        last = self.idxEnd
        route = [last]
        while last != self.idxStart:
            last = pre[last]
            route = [last] + route
        return {
            'route': route,
            'distance': dist[self.idxEnd]
        }

    def dijkstra(self):
        dist = [-1 for i in self.node]
        pre = [i for i in range(len(self.node))]
        pq = []
        # elementet e pq (struktura):
        #   [0] => distanca aktuale
        #   [1] => indexi i destinacionit
        #   [2] => indexi i nyjes paraprake
        heapq.heappush(pq, (0, self.idxStart, self.idxStart))
        while len(pq) > 0:
            top = heapq.heappop(pq)
            if dist[top[1]] == -1:
                dist[top[1]] = top[0]
                pre[top[1]] = top[2]
                if top[1] == self.idxEnd:
                    break
                for n in self.adj[top[1]]:
                    heapq.heappush(pq, (top[0] + n[1], n[0], top[1]))
        last = self.idxEnd
        route = [last]
        while last != self.idxStart:
            last = pre[last]
            route = [last] + route
        return {
            'route': route,
            'distance': dist[self.idxEnd]
        }


def receiveAStar(req):
    g = Graph(
        json.loads(req['node']),
        json.loads(req['edge']),
        json.loads(req['start']),
        json.loads(req['end'])
    )  # response qe presim
    return g.astar()


def receiveDijkstra(req):
    g = Graph(
        json.loads(req['node']),
        json.loads(req['edge']),
        json.loads(req['start']),
        json.loads(req['end'])
    )
    return g.dijkstra()
