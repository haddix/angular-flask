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
        print(res)
        if res["hits"]["total"]["value"] > 0:
            print("GOT EXISTING USER")
            user_obj = res["hits"]["hits"][0]["_source"]
        else:
            print("CREATING A NEW USER")
            es.index(index="users", body=user_obj, id=user_obj["dn"])
    except Exception as e:
        print(e)
        print("CREATING A NEW USER")
        es.index(index="users", body=user_obj, id=user_obj["dn"])

    user_obj = find_recommended(user_obj)

    return user_obj


def set_user(user_obj):
    print ("SET USER")
    es.index(index="users", body=user_obj, id=user_obj["dn"])

def set_user_favorites(userObj, movie):
    userObj = get_user(userObj)
    movie = json.loads(movie)
    title = movie["title"].replace("<mark>", "").replace("</mark>", "")
    text = ""
    for tagline in movie["taglines"]:
        text = text + " " + tagline.replace("<mark>", "").replace("</mark>", "")

    title = title.lower().replace(".", "")
    text = text.lower().replace(".", "")

    if "favorites" not in userObj:
        userObj["favorites"] = []

    if title not in userObj["favorites"]:
        userObj["favorites"].append(title)


    if "favorite_nouns" not in userObj:
        userObj["favorite_nouns"] = []

    nouns = nlp.get_nouns(text)
    for noun in nouns:
        if noun not in userObj["favorite_nouns"]:
            userObj["favorite_nouns"].append(noun)

    nouns = nlp.get_nouns(title)
    for noun in nouns:
        if noun not in userObj["favorite_nouns"]:
            userObj["favorite_nouns"].append(noun)

    print(userObj)
    set_user(userObj)
    return userObj




def find_recommended(userObj):
    print("FIND RECOMMENDED")
    if "favorite_nouns" not in userObj:
        userObj["favorite_nouns"] = []

    nouns = userObj["favorite_nouns"]

    should = []

    for noun in nouns:
        tagline = {
          "match_phrase": {
            "taglines": {
              "query": noun
            }
          }
        }

        title = {
            "match_phrase": {
                "taglines": {
                    "query": noun
                }
            }
        }

        should.append(tagline)
        should.append(title)


    query = {
              "size": 200,
              "query": {
                "bool": {
                  "should": should
                }
              }
            }

    if len(userObj["favorite_nouns"]) > 0:
        res = es.search(index="movies-taglines", body=query)
        result = res

        userObj["recommended"] = result["hits"]["hits"]

    return userObj