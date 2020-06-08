from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()

def get_graphs(search_terms):
    graphs = {"graph_data":[]}
    graphs["graph_data"].append(get_types())
    return graphs

def get_types():
    query = {
              "size": 0,
              "aggregations": {
                "movie_type": {
                  "terms": {
                    "field": "kind.keyword"
                  }
                }
              }
            }
    res = es.search(index="movies", body=query)
    result = {"graph":"pie", "name": "Film Type", "data":[]}
    data = [
        {
            "name": "Germany",
            "value": 8940000
        },
        {
            "name": "USA",
            "value": 5000000
        },
        {
            "name": "France",
            "value": 7200000
        },
        {
            "name": "UK",
            "value": 6200000
        }
    ]
    for item in res["aggregations"]["movie_type"]["buckets"]:
        result["data"].append({"name":item["key"], "value":item["doc_count"]})

    return result