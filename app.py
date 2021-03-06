from flask_cors import CORS
from flask import Flask, jsonify, send_from_directory, request
from src import map
from src import table
from src import graph
from src import search
from src import movie_graphs
from src import user

from random import seed
from random import random
# seed random number generator
seed(1)
app = Flask(__name__)
CORS(app)


def get_credentials():
    user_obj = {
        "dn":"NOT SSL USER",
        "cn":"NOT SSL USER"
    }
    return user_obj


@app.route('/angular-flask/get_user')
def get_user():
    return jsonify(user.get_user(get_credentials()))

@app.route('/angular-flask/set_user_favorites', methods=['GET', 'POST'])
def set_user_favorites():
    if request.method == 'POST':
        req = request.values
    else:
        req = request.args
    return jsonify(user.set_user_favorites(get_credentials(), req.get("movie")))


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
    return jsonify(graph.get_graphs(req.get("graph_type")))


@app.route('/angular-flask/do_search', methods=['GET', 'POST'])
def do_search():

    if request.method == 'POST':
        req = request.values
    else:
        req = request.args
    terms = req.get("terms")
    return jsonify(search.do_search(terms))


@app.route('/angular-flask/do_add', methods=['GET', 'POST'])
def do_add():
    print("DO ADD")
    if request.method == 'POST':
        req = request.values
    else:
        req = request.args
    item = req.get("item")
    return jsonify(search.do_add(item))


@app.route('/angular-flask/get_recommended', methods=['GET', 'POST'])
def get_recommended():
    print("get_recommended")
    return jsonify(search.find_recommended(user.get_user(get_credentials())))

@app.route('/angular-flask/movie_graphs', methods=['GET', 'POST'])
def get_movie_graphs():

    if request.method == 'POST':
        req = request.values
    else:
        req = request.args
    search_terms = req.get("search_terms")
    return jsonify(movie_graphs.get_graphs(search_terms))




@app.route('/')
def index():
    return send_from_directory("web-app", "index.html")


if __name__ == '__main__':
    app.debug = True
    app.run()