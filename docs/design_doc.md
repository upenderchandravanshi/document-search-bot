# Design Document for Document Search Bot

## 1. Introduction
This design document outlines the architecture and key design decisions for the **Document Search Bot** proof‑of‑concept. The system allows:

- **Admins** to upload, download, and delete resumes in PDF, DOCX, XLSX, and PPTX formats.
- **Users** (and Admins) to select one or all resumes and pose natural‑language queries, receiving relevant text snippets.

Key goals:
- Simple, modular architecture
- Extensible document handling pipeline
- Fast vector similarity search
- Secure role gating (Admin vs User)

---
## 2. High‑Level Architecture

\`\`\`mermaid
flowchart LR
    subgraph FE[Frontend (React + Vite + Tailwind)]
      A[Role Selector] --> B[File Uploader]
      A --> C[File Manager]
      A --> D[Query Interface]
    end

    subgraph BE[Backend (FastAPI)]
      B1[/upload/] --> H1[Save & parse]
      C1[/download/, /delete/] --> H1
      D1[/files/] --> FS[uploads/ dir]
      D1[/query/] --> VS[VectorStore]
      H1 --> VS
    end

    VS[FAISS + Embeddings]
    FS[File System]

    FE --> BE
\`\`\`

---
## 3. Component Breakdown

| Layer                | Module/File                         | Responsibility                              |
|----------------------|-------------------------------------|---------------------------------------------|
| **API**              | \`app.py\`                          | Defines HTTP routes and CORS, role checks   |
| **Document Handler** | \`document_handler/loader.py\`      | Loaders for PDF, DOCX, XLSX, PPTX; chunking |
| **Vector Engine**    | \`query_engine/vector_store.py\`    | Build/load FAISS index, similarity search   |
| **Frontend UI**      | \`src/App.jsx\`, \`src/main.jsx\`   | Role selector, upload/manage/query panels   |

---
## 4. Data & Control Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User/Admin
    participant FE as React UI
    participant BE as FastAPI
    participant DH as Loader
    participant VS as VectorStore
    participant FS as FileSystem

    U->>FE: select role & action
    FE->>BE: HTTP request (+ x-role)
    BE->>FS: save/read/delete file
    BE->>DH: parse & chunk
    DH->>VS: embed & index
    FE->>BE: query
    BE->>VS: similarity_search
    VS-->>BE: top chunks
    BE-->>FE: results
\`\`\`

---
## 5. Security & Roles

- **Admin**: Full CRUD on documents (upload, download, delete).
- **User**: Read/query only.
- Enforced via \`x-role\` HTTP header in FastAPI dependencies.
- POC uses a simple prompt‑based password (\`adminpass\`); replace with JWT/OAuth in prod.

---
## 6. Setup & Run

\`\`\`bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev                # http://localhost:5173
\`\`\`

---
