from flask_cors import CORS
from flask import Flask, jsonify, send_from_directory, request
from src import map
from src import table
from src import graph
app = Flask(__name__)
CORS(app)


@app.route('/angular-flask/get_map')
def get_map():

    return jsonify(map.get_map_data())


@app.route('/angular-flask/get_table')
def get_table():

    return jsonify(table.get_table())

@app.route('/angular-flask/get_graphs', methods=['GET', 'POST'])
def get_graphs():

    if request.method == 'POST':
        req = request.values
    else:
        req = request.args
    print req.get("graph_type")
    return jsonify(graph.get_graphs(req.get("graph_type")))


@app.route('/angular-flask/get_people')
def get_people():
    people = {"people": [
        {'name': 'fred', 'age': 10},
        {'name': 'john', 'age': 20},
        {'name': 'paul', 'age': 30},
        {'name': 'greg', 'age': 40},
    ]}
    return jsonify(people)




@app.route('/')
def index():
    return send_from_directory("web-app", "index.html")


if __name__ == '__main__':
    app.debug = True
    app.run()