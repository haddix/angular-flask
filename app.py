from flask_cors import CORS
from flask import Flask, jsonify, send_from_directory
app = Flask(__name__)
CORS(app)


@app.route('/angular-flask/get_map')
def get_names():
    locations = {'locations':
             [
                 {"name": "home", "coords":[41.141649, -96.226552]}
             ]}
    return jsonify(locations)

@app.route('/get_people')
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