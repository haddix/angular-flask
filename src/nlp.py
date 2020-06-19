import nltk

def get_nouns(text):
    text = nltk.word_tokenize(text)
    pos_tagged = nltk.pos_tag(text)
    results = filter(lambda x: x[1] == 'NN', pos_tagged)
    nouns = []
    for item in list(results):
        print(item)
        nouns.append(item[0])

    print(nouns)
    return nouns

# get_nouns("I love hte star wars movie")



# from textblob import TextBlob
#
# def get_nouns(txt):
#     # txt = """Natural language processing (NLP) is a field of computer science, artificial intelligence, and computational linguistics concerned with the inter
#     # actions between computers and human (natural) languages."""
#     blob = TextBlob(txt)
#     print("NLP Nouns Found")
#     print(blob.noun_phrases)
#     return blob.noun_phrases
