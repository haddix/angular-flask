from datetime import datetime
from elasticsearch import Elasticsearch
import json
from pprint import pprint

es = Elasticsearch()

filepath = '../../imdb/movies.json'
with open(filepath) as f:
    content = f.readlines()
    for line in content:
        j = json.loads(line)
        print(j)

        res = es.index(index="movies", body=j)
        print(res['result'])

        # res = es.get(index="test-index", id=1)
        # print(res['_source'])
#
# es.indices.refresh(index="test-index")
#
# res = es.search(index="test-index", body={"query": {"match_all": {}}})
# print("Got %d Hits:" % res['hits']['total']['value'])
# for hit in res['hits']['hits']:
#     print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])