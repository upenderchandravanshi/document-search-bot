import os
from typing import List
from langchain_community.document_loaders import (
    PyPDFLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredExcelLoader,
    UnstructuredPowerPointLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

def load_and_split(file_path: str) -> List[Document]:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext in {".docx", ".doc"}:
        loader = UnstructuredWordDocumentLoader(file_path)
    elif ext in {".xlsx", ".xls"}:
        loader = UnstructuredExcelLoader(file_path)
    elif ext in {".pptx", ".ppt"}:
        loader = UnstructuredPowerPointLoader(file_path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(docs)
