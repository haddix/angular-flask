from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()



def do_search(terms):

    search_type = "match"
    if '"' in terms:
        search_type = "match_phrase"
        terms = terms.replace('"', "")

    query = {
              "size": 200,
              "query": {
                "bool": {
                  "should": [
                      {
                          search_type: {
                              "taglines": {
                                  "query": terms
                              }
                          }
                      }
                  ],
                  "must": [
                      {
                          "match": {
                              "kind": {
                                  "query": "movie"
                              }
                          }
                      },
                    {
                      search_type: {
                          "title": {
                              "query": terms
                          }
                      }
                    }
                  ]
                }
              },
              "highlight": {
                "pre_tags": ["<mark>"],
                "post_tags": ["</mark>"],
                "fields": {
                  "taglines": {},
                    "title":{}
                },
                "require_field_match" : False
              }
            }

    res = es.search(index="movies-taglines", body=query)
    result = res

    for item in result["hits"]["hits"]:
        if "taglines" in item["highlight"]:
            for highlight in item["highlight"]["taglines"]:
                tl = highlight.replace("<mark>", "").replace("</mark>", "")
                taglines = item["_source"]["taglines"]
                item["_source"]["taglines"] = [tagline.replace(tl, highlight) for tagline in taglines]
        if "title" in item["highlight"]:
         item["_source"]["title"] = item["highlight"]["title"][0]

        del item["highlight"]

    return result








def do_add(item):
    jsonObj = json.loads(item)
    print("ADDING ITEM")
    print(jsonObj)
    try:
        res = es.index(index="movies-taglines", body=jsonObj)
        print(res)
    except Exception as e:
        print(e)
        res = {"ERROR": e.message}
    return res