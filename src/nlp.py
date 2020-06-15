from textblob import TextBlob

def get_nouns(txt):
    # txt = """Natural language processing (NLP) is a field of computer science, artificial intelligence, and computational linguistics concerned with the inter
    # actions between computers and human (natural) languages."""
    blob = TextBlob(txt)
    print("NLP Nouns Found")
    print(blob.noun_phrases)
    return blob.noun_phrases
