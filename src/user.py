from elasticsearch import Elasticsearch
import json
from src import nlp
es = Elasticsearch()


def get_user(user_obj):
    dn = user_obj["dn"]
    query = {
        "query": {
            "match": {
                "dn": dn
            }
        }
    }
    try:
        res = es.search(index="users", body=query)
        if res["hits"]["total"] > 0:
            print("GOT EXISTING USER")
            user_obj = res["hits"]["hits"][0]["_source"]
        else:
            print("CREATING A NEW USER")
            es.index(index="users", body=user_obj)
    except Exception as e:
        es.index(index="users", body=user_obj, id=user_obj["dn"])

    return user_obj


def set_user(user_obj):
    es.index(index="users", body=user_obj, id=user_obj["dn"])

def set_user_favorites(userObj, movie):
    userObj = get_user(userObj)
    movie = json.loads(movie)
    title = movie["title"].replace("<mark>", "").replace("</mark>", "")
    text = title
    for tagline in movie["taglines"]:
        text = text + " " + tagline.replace("<mark>", "").replace("</mark>", "")

    nouns = nlp.get_nouns(text)


    if "favorites" not in userObj:
        userObj["favorites"] = []

    if title not in userObj["favorites"]:
        userObj["favorites"].append(title)


    if "favorite_nouns" not in userObj:
        userObj["favorite_nouns"] = []

    for noun in nouns:
        if noun not in userObj["favorite_nouns"]:
            userObj["favorite_nouns"].append(noun)

    print(userObj)
    set_user(userObj)
    return userObj