import os
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
from config import VECTOR_STORE_DIR

# Embedding model
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Try loading existing FAISS index, else None
try:
    store = FAISS.load_local(VECTOR_STORE_DIR, embedding, allow_dangerous_deserialization=True)
except:
    store = None

def add_documents(docs: List[Document]):
    global store
    if store is None:
        store = FAISS.from_documents(docs, embedding)
    else:
        store.add_documents(docs)
    store.save_local(VECTOR_STORE_DIR)

def similarity_search(query: str, k: int = 3) -> List[Document]:
    if store is None:
        return []
    return store.similarity_search(query, k=k)
