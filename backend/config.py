import os
##from dotenv import load_dotenv

##load_dotenv()  # loads OPENAI_API_KEY

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
VECTOR_STORE_DIR = os.path.join(BASE_DIR, "vector_store")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_STORE_DIR, exist_ok=True)