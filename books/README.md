# Study Corner PDF Upload Guide

Place the library PDFs in `books/mybooks` using the exact filenames below. The Study Corner page reads these paths from `study-corner.js`, so using the same filenames activates both "Read Online" and "Download PDF" without any code changes.

## Current Book Files

```text
mybooks/Backend Developer Interview Mastery.pdf
mybooks/JAVASCRIPT FOR WEB DEVELOPMENT MASTER BOOK.pdf
mybooks/MASTER ENGLISH EASILY.pdf
mybooks/Fresher to Job-Ready Data Analyst.pdf
mybooks/English.pdf
mybooks/BOOK 3 Advanced Backend & System Design1.pdf
mybooks/BOOK 1 PYTHON BACKEND FOUNDATIONS1.pdf
mybooks/BOOK 2 Backend Development & Databases.pdf
mybooks/Python Engineering.pdf
mybooks/Python for Backend Development.pdf
mybooks/Backend Engineering to AI Systems.pdf
mybooks/PYTHON DSA.pdf
```

## Add Or Update Books

1. Copy the PDF into the `books/mybooks` folder.
2. Open `study-corner.js`.
3. Add or edit an entry in the `studyBooks` array.
4. Set `source` to `books/your-file-name.pdf`.
5. Update `title`, `author`, `category`, `tags`, `description`, and `size`.

The PDF reader detects page count when a PDF is opened. Highlights, notes, and drawings are stored in the visitor's browser localStorage.
