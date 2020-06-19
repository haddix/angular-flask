import nltk
text = nltk.word_tokenize("""It's Back! (re-release) 
            May the Force be with you (re-release)
            The force will be with you (re-release)
            Somewhere, in space, this could all be happening right now.
            A long time ago in a galaxy far, far away...
            Coming to your galaxy this summer""")
pos_tagged = nltk.pos_tag(text)

nouns = filter(lambda x:x[1]=='NN',pos_tagged)
print(list(nouns))