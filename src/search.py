from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()



def do_search(terms):
    query = {
              "size": 200,
              "query": {
                "bool": {
                  "should": [
                      {
                          "match": {
                              "title": {
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
                    "match": {
                      "taglines": {
                        "query": terms,
                        "analyzer": "synonym"
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
                  "taglines": {}
                },
                "require_field_match" : False
              }
            }

    res = es.search(index="movies-taglines", body=query)
    result = res
    for item in result["hits"]["hits"]:
        for highlight in item["highlight"]["taglines"]:
            tl = highlight.replace("<mark>", "").replace("</mark>", "")
            taglines = item["_source"]["taglines"]
            item["_source"]["taglines"] = [tagline.replace(tl, highlight) for tagline in taglines]

        del item["highlight"]

    return result