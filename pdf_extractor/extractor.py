import sys
from spire.pdf.common import *
from spire.pdf import *

def extract_text_to_html(pdf_file_path, output_html_path):
    # Create an object of the PdfDocument class
    doc = PdfDocument()

    # Load the PDF file
    doc.LoadFromFile(pdf_file_path)

    # Save the content to an HTML file
    doc.SaveToFile(output_html_path, FileFormat.HTML)

    # Close the document
    doc.Close()

if __name__ == "__main__":
    # Check if the PDF file path is provided
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_pdf>")
        sys.exit(1)

    pdf_file_path = sys.argv[1]
    fileName = sys.argv[2]
    output_html_path = f"./pdf_extractor/files/{fileName}.html"
    extract_text_to_html(pdf_file_path, output_html_path)