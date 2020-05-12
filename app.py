from flask_cors import CORS
from flask import Flask, jsonify, send_from_directory
from src import map
from src import table
app = Flask(__name__)
CORS(app)


@app.route('/angular-flask/get_map')
def get_map():

    return jsonify(map.get_map_data())


@app.route('/angular-flask/get_table')
def get_table():

    return jsonify(table.get_table())


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