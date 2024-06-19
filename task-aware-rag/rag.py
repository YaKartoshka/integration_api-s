import os
import voyageai
from openai import OpenAI
import config as conf

vo = voyageai.Client(api_key=conf.VOYAGE_API_KEY)

def get_documents():
    pre = "./documents"
    documents = []
    files = os.listdir(pre)
    for file in files:
        file_path = os.path.join(pre, file)
        if os.path.isfile(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    documents.append(content)
            except Exception as e:
                print(f"Error reading file {file}: {e}")
        
    return documents


def rerank_documents(query):
    documents = get_documents()
    documents_reranked = vo.rerank(query, documents, model="rerank-lite-1", top_k=3)
    print(documents_reranked)
    for r in documents_reranked.results:
        print(f"Document: {r.document}")
        print(f"Relevance Score: {r.relevance_score}")
        print(f"Index: {r.index}")
    
    return documents_reranked.results


def query_answer(query):
    reranked_documents = rerank_documents(query)
    client = OpenAI(api_key=conf.OPENAI_API_KEY)
    prompt = f"Based on the information: '{reranked_documents[0]}', generate a response of {query}"

    response = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )

    print(response.choices[0].message.content)


if __name__=="__main__":
    query = "Порядок оплаты услуг специалиста жестового языка?"
    query_answer(query)
   
