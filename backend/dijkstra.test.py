import algorithms

def main():
	g = algorithms.dijkstra.Graph(
		[
			{ 'lat':  0, 'lng': 0 },
			{ 'lat':  4, 'lng': 1 },
			{ 'lat': -2, 'lng': 0 },
			{ 'lat': 2, 'lng': 2 },
			{ 'lat': 4, 'lng': -1 },
			{ 'lat': -2, 'lng': 0 }
		], [
			{ 'a': 1, 'b': 3 },
			{ 'a': -1, 'b': 0 },
			{ 'a': -2, 'b': -2 },
			{ 'a': 0, 'b': 3 },
			{ 'a': 5, 'b': -5 }
		], 0, 1
	)
	print(g.dijkstra())

main()