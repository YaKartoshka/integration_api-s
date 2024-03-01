import sys
from langchain_community.document_loaders import UnstructuredHTMLLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import Docx2txtLoader

def extract_text_html(file_path):
    loader = UnstructuredHTMLLoader(file_path)
    data = loader.load()
    print(data)

def extract_text_pdf(file_path):
    loader = PyPDFLoader(file_path)
    pages = loader.load_and_split()   
    print(pages[0])

def extract_text_docx(file_path):
    loader = Docx2txtLoader(file_path)
    data = loader.load()
    print(data)



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_pdf>")
        sys.exit(1)

    file_path = sys.argv[1]
    # fileName = sys.argv[2]
    # output_html_path = f"./pdf_extractor/files/{fileName}.html"
    extract_text_docx(file_path)