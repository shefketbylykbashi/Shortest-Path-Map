from flask import Flask
from flask import jsonify
from crossdomain import *
import algorithms

app = Flask(__name__)


@app.route('/a-star', methods=['POST', 'OPTIONS', 'GET'])
@crossdomain(origin='*')
def astarRoute():
    if request.method == 'POST':
        print(request.form)
        return jsonify(algorithms.receiveAStar(request.form))
    else:
        return 'ok'


@app.route('/dijkstra', methods=['POST', 'OPTIONS', 'GET'])
@crossdomain(origin='*')
def dijkstraRoute():
    if request.method == 'POST':
        print(request.form)
        return jsonify(algorithms.receiveDijkstra(request.form))
    else:
        return 'ok'


if __name__ == "__main__":
    app.run(debug=True)
