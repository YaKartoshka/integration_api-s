from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai.embeddings import OpenAIEmbeddings
import config as conf


def similiarity_parsing_default():
    text_splitter = SemanticChunker(OpenAIEmbeddings(api_key=conf.OPENAI_API_KEY))

    with open('test.txt') as f:
        state_of_the_union = f.read()

    docs = text_splitter.create_documents([state_of_the_union])
    print(docs[0].page_content)


def similiarity_parsing_percentile():
    text_splitter = SemanticChunker(OpenAIEmbeddings(api_key=conf.OPENAI_API_KEY), breakpoint_threshold_type="percentile") #percentile method

    with open('test.txt') as f:
        state_of_the_union = f.read()

    docs = text_splitter.create_documents([state_of_the_union])
    print(docs[0].page_content)


def similiarity_parsing_standard_dev():
    text_splitter = SemanticChunker(OpenAIEmbeddings(api_key=conf.OPENAI_API_KEY), breakpoint_threshold_type="standard_deviation") #standard_deviation method

    with open('test.txt') as f:
        state_of_the_union = f.read()

    docs = text_splitter.create_documents([state_of_the_union])
    print(docs[0].page_content)


def similiarity_parsing_interquartile():
    text_splitter = SemanticChunker(OpenAIEmbeddings(api_key=conf.OPENAI_API_KEY), breakpoint_threshold_type="interquartile") #interquartile method

    with open('test.txt') as f:
        state_of_the_union = f.read()

    docs = text_splitter.create_documents([state_of_the_union])
    print(docs[0].page_content)



if __name__=="__main__":
    similiarity_parsing_default()
    # similiarity_parsing_percentile()
    # similiarity_parsing_standard_dev()
    # similiarity_parsing_interquartile()
   
