from flask_cors import CORS
from flask import Flask, jsonify, send_from_directory
from src import map
app = Flask(__name__)
CORS(app)


@app.route('/angular-flask/get_map')
def get_map():
    locations = {'locations':
             [
                 {"name": "jason", "coords":[41.141649, -96.226552]},
                 {"name": "anthony", "coords": [41.141649, -96.226552]},
                 {"name": "caleb", "coords": [41.141649, -96.226552]}
             ]}
    return jsonify(map.get_map_data())

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