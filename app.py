#!/usr/bin/env python
from flask import Flask, jsonify, send_from_directory
app = Flask(__name__)


@app.route('/angular-flask/get_map')
def get_names():
    names = {'names':
             [
                 'fred',
                 'john',
                 'paul',
                 'greg'
             ]}
    return jsonify(names)

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