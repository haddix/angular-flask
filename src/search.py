from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()



def do_search(terms):
    query = {
          "query": {
            "match": {
              "title": terms
            }
          }
        }
    print (query)
    res = es.search(index="movies-taglines", body=query)
    result = res
    return result