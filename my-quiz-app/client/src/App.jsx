import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // Stores [{ id: 1, selected: "Paris" }]
  const [selectedOption, setSelectedOption] = useState("");
  const [finalScore, setFinalScore] = useState(null); // Stores { score: X, total: Y }

  useEffect(() => {
    fetch('http://localhost:3000/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  const handleNext = () => {
    const currentQ = questions[currentIndex];
    
    setUserAnswers([...userAnswers, { id: currentQ.id, selected: selectedOption }]);
    
    setCurrentIndex(currentIndex + 1);
    setSelectedOption("");
  };

  const handleSubmit = async () => {
    const currentQ = questions[currentIndex];
    
    const finalAnswersArray = [...userAnswers, { id: currentQ.id, selected: selectedOption }];

    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalAnswersArray)
    });

    const result = await response.json();
    setFinalScore(result); // Show final score
  };

  if (questions.length === 0) {
    return <h2>Loading questions...</h2>;
  }

  if (finalScore !== null) {
    return (
      <div className="quiz-container">
        <h1>Quiz Complete! </h1>
        <h2>Your Final Score: {finalScore.score} / {finalScore.total}</h2>
        <p>Thank you for playing!</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="quiz-container">
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <h3 className="question-text">{currentQ.text}</h3>
      
      <div className="options-container">
        {currentQ.options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type="radio"
              name="quiz-option"
              value={option}
              checked={selectedOption === option}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Requirement: Next button, replaced by Submit on the last question */}
      <button 
        disabled={!selectedOption} 
        onClick={isLastQuestion ? handleSubmit : handleNext}
        className="action-button"
      >
        {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
      </button>
    </div>
  );
}

export default App;