const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public')); 


const questions = [
    { id: 1, text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    { id: 2, text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
    { id: 3, text: "What is 5 + 7?", options: ["10", "11", "12", "13"], answer: "12" },
    { id: 4, text: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Homer"], answer: "William Shakespeare" },
    { id: 5, text: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], answer: "100°C" }
];


app.get('/questions', (req, res) => {
  
    const safeQuestions = questions.map(q => {
        return {
            id: q.id,
            text: q.text,
            options: q.options
        }; 
    });
    
    res.json(safeQuestions);
});


app.post('/submit', (req, res) => {
    const userAnswers = req.body; 
    let score = 0;

    
    userAnswers.forEach(userAns => {
        
        const realQuestion = questions.find(q => q.id === userAns.id);
        
        
        if (realQuestion && realQuestion.answer === userAns.selected) {
            score++;
        }
    });

    
    res.json({ score: score, total: questions.length });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});