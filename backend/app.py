import os
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from config import UPLOAD_DIR
from document_handler.loader import load_and_split
from query_engine.vector_store import add_documents, similarity_search

app = FastAPI()

# CORS so React can call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_resume(
    file: UploadFile = File(...),
    x_role: str = Header(...)
):
    if x_role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")

    # save the file
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # split & add to vector store
    docs = load_and_split(path)
    add_documents(docs)

    return {"message": f"{file.filename} uploaded."}


@app.get("/download/{filename}")
def download_resume(
    filename: str,
    x_role: str = Header(...)
):
    if x_role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Not found.")
    return FileResponse(path=path, filename=filename)


@app.delete("/delete/{filename}")
def delete_resume(
    filename: str,
    x_role: str = Header(...)
):
    if x_role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Not found.")
    os.remove(path)
    return {"message": f"{filename} deleted."}


@app.get("/files/")
def list_files(x_role: str = Header(...)):
    # both admin and user can list
    return {"files": os.listdir(UPLOAD_DIR)}


@app.post("/query/")
def query_resumes(
    query: str = Form(...),
    filename: str = Form(None)
):
    # run vector search
    docs = similarity_search(query)
    # if a specific resume is selected, filter by source metadata
    if filename:
        docs = [
            d for d in docs
            if os.path.basename(d.metadata.get("source", "")) == filename
        ]
    return {"results": [d.page_content for d in docs]}
