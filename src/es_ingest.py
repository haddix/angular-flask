from datetime import datetime
from elasticsearch import Elasticsearch, helpers
import json
import uuid
from pprint import pprint

'''
indexes:
movies
movies-taglines
movies-ratings
'''

es = Elasticsearch()

index_name = "movies"
filepath = '../../imdb/movies.json'


bucket = []
with open(filepath) as f:
    content = f.readlines()
    for line in content:
        jobj = {
            "_index": index_name,
            "_id": uuid.uuid4(),
            "_source": json.loads(line)
        }
        bucket.append(jobj)

helpers.bulk(es, bucket, chunk_size=500, request_timeout=200)

es.indices.refresh(index=index_name)