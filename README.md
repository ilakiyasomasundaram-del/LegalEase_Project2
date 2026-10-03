# LegalEase – AI-Powered Legal Document Generator

A beginner-friendly full-stack college project for generating structured legal-document drafts from guided forms.

## Features
- Rental Agreement
- Employment Agreement
- NDA
- Affidavit
- Authorization Letter
- General Legal Notice
- SQLite + Prisma persistence
- AI service abstraction with local fallback templates
- Editable document preview
- PDF download
- Print
- Document history
- Responsive UI
- Legal disclaimer

## Run

### 1. Install root dependencies
```bash
npm install
```

### 2. Install application dependencies
```bash
npm run install:all
```

### 3. Configure server
Copy `server/.env.example` to `server/.env`.

### 4. Setup database
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 5. Start both apps
From the root:
```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## Optional AI
Set `OPENAI_API_KEY` in `server/.env`. If it is empty, LegalEase uses local templates and still works.

## Disclaimer
LegalEase creates informational document drafts and does not provide legal advice. Documents should be reviewed by a qualified legal professional before use.
