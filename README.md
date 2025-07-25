# Document Search Bot

A proof-of-concept application enabling Admins to upload, manage, and delete candidate resumes in multiple document formats (PDF, DOCX, XLSX, PPTX), and allowing both Admins and Users to perform natural-language queries against the uploaded documents.

## Features

- **Role-based access**: Admin vs User (password-protected Admin mode)
- **Document management** (Admin only): Upload, download, delete resumes
- **Document formats** supported: PDF, Word, Excel, PowerPoint
- **Natural language search**: Select one or all resumes and query via LLM-powered vector search (FAISS + HuggingFace embeddings)
- **Responsive React UI** with Tailwind CSS and Heroicons

## Repository Structure

```
document-search-bot/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── document_handler/
│   │   ├── loader.py
│   └── query_engine/
│       ├── vector_store.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       └── App.jsx
├── data/
│   └── sample_docs/
├── docs/
│   ├── design_doc.md
│   ├── test_cases.md
│   └── test_report.md
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+ and pip
- Node.js 16+ and npm

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Role Toggle: Select _User_ to query only, or _Admin_ (enter password `adminpass`) to manage documents.
2. Upload resumes (Admin): Choose a file and click _Upload_.
3. Manage resumes (Admin): Download or delete from the list.
4. Query resumes (Admin & User): Select one or all resumes, enter a question, and click _Search_.
