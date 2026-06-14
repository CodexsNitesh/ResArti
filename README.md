# AI Resume Analyzer

An AI-powered Resume Analysis Platform that evaluates resumes, provides ATS optimization recommendations, identifies skill gaps, and delivers personalized feedback using Google's Gemini AI.

The application enables users to upload PDF resumes, analyze their content, and receive actionable insights to improve job application success.

---

## Features

### Resume Analysis

* Upload PDF resumes
* Automatic text extraction
* AI-powered resume evaluation
* ATS compatibility assessment
* Resume quality scoring

### AI-Powered Insights

* Skill gap identification
* Missing keyword detection
* Resume strengths and weaknesses
* Personalized improvement suggestions
* Content optimization recommendations

### User Experience

* Real-time analysis results
* Clean and responsive UI
* Fast resume processing
* Interactive feedback system

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer
* PDF-Parse

### AI

* Google Gemini AI
* Natural Language Processing
* Resume Content Analysis

---

## System Architecture

```text
User Uploads Resume (PDF)
            │
            ▼
      React Frontend
            │
            ▼
      Express Backend
            │
            ▼
      PDF Extraction
            │
            ▼
      Gemini AI Analysis
            │
            ▼
   Resume Evaluation Engine
            │
            ▼
 ATS Feedback + Suggestions
            │
            ▼
       User Dashboard
```

---

## Project Structure

```text
ai-resume-analyzer/

├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## How It Works

### Step 1: Upload Resume

Users upload a PDF resume through the web interface.

### Step 2: Text Extraction

The backend extracts structured text from the uploaded PDF document.

### Step 3: AI Analysis

Gemini AI analyzes:

* Skills
* Experience
* Education
* Projects
* Resume Structure
* ATS Readiness

### Step 4: Feedback Generation

The system generates:

* Resume Score
* Improvement Suggestions
* Missing Keywords
* Skill Gap Analysis
* ATS Optimization Tips

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Workflow

### Upload Resume

```http
POST /upload
```

### Analyze Resume

```http
POST /analyze
```

### Retrieve Analysis

```http
GET /analysis/:id
```

---

## Key Learning Outcomes

This project demonstrates:

* Generative AI Integration
* Prompt Engineering
* Full-Stack Development
* PDF Processing
* REST API Development
* MongoDB Data Management
* AI-Powered Document Analysis
* ATS Optimization Workflows

---

## Future Enhancements

* Job Description Matching
* Resume vs JD Comparison
* Interview Question Generation
* Resume Version Tracking
* Cover Letter Generation
* Multi-Format Resume Support
* Authentication & User Accounts

---

## License

This project is licensed under the MIT License.

---

## Author

**Nitesh Pandit**

AI Engineer | Full-Stack Developer

Building AI-powered applications using React, Node.js, FastAPI, LangChain, Vector Databases, and Large Language Models.

GitHub: https://github.com/CodexsNitesh
