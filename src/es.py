from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()

settings = {
  "settings": {
     "index" : {
        "analysis" : {
            "analyzer" : {
                "synonym" : {
                    "tokenizer" : "whitespace",
                    "filter" : ["synonym"]
                }
            },
            "filter" : {
                "synonym" : {
                    "type" : "synonym",
                    "format" : "wordnet",
                    "synonyms_path" : "analysis/wn_s.pl"
                }
            }
        }
     }
  }
}
#delete indexes first if they exist
try:
    es.indices.delete(index='movies', ignore=[400, 404])
    print("deleted movies")
    es.indices.delete(index='movies-ratings', ignore=[400, 404])
    print("deleted movies-ratings")
    es.indices.delete(index='movies-taglines', ignore=[400, 404])
    print("deleted movies-taglines")
    es.indices.delete(index='users', ignore=[400, 404])
    print("deleted users")
except Exception as e:
    print (e)

#create indexes
es.indices.create(index='movies', body=settings)
print ("created movies")
es.indices.create(index='movies-taglines', body=settings)
print ("created movies")
es.indices.create(index='movies-ratings')
print ("created movies")
es.indices.create(index='users')
print ("created movies")


# filepath = '../../imdb/movies.json'
# with open(filepath) as f:
#     content = f.readlines()
#     for line in content:
#         j = json.loads(line)
#         print(j)
#
#         res = es.index(index="movies", body=j)
#         print(res['result'])

        # res = es.get(index="test-index", id=1)
        # print(res['_source'])
#
# es.indices.refresh(index="test-index")
#
# res = es.search(index="test-index", body={"query": {"match_all": {}}})
# print("Got %d Hits:" % res['hits']['total']['value'])
# for hit in res['hits']['hits']:
#     print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])