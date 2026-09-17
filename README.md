# QuizMaster - Online Quiz System

## Setup & Run

1. Install Node.js (v14+)
2. Run: `npm install`
3. Run: `npm start`
4. Open: http://localhost:3000

## Login
- Username: any name
- Password: 1234

## Project Structure
```
quiz-project/
├── public/
│   ├── index.html      # Login page
│   ├── quiz.html       # Quiz page
│   ├── result.html     # Result page
│   └── style.css       # Styles
├── data/
│   ├── questions.json  # Question bank
│   └── db.json         # JSON database
├── db.js               # Database helper
├── server.js           # Express server
├── package.json
└── README.md
```

## API Endpoints
- POST /login - Authenticate user
- GET /questions - Fetch questions
- POST /submit-score - Submit and save score
