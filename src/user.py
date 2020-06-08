from elasticsearch import Elasticsearch
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
        es.index(index="users", body=user_obj)


    return user_obj