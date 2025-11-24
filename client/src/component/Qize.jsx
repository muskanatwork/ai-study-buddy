import { useState } from "react";

function Quiz() {
  const [topic, setTopic] = useState("");     // Topic input
  const [questions, setQuestions] = useState([]); // Quiz questions
  const [current, setCurrent] = useState(0);  // Current question number
  const [clicked, setClicked] = useState(null); // Selected option
  const [score, setScore] = useState(0);      // Score
  const [done, setDone] = useState(false);    // Quiz complete or not

  // Quiz fetch karne ka function
  const getQuiz = async () => {
    const res = await fetch("http://localhost:5000/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();

    // Gemini kabhi kabhi JSON na bhi de — fallback
    const quizList = data.quiz.raw ? [] : data.quiz;

    setQuestions(quizList);
    setCurrent(0);
    setClicked(null);
    setScore(0);
    setDone(false);
  };

  // Next button click
  const handleNext = () => {
    if (clicked === null) return;

    const correct = questions[current].answer;

    if (clicked === correct) {
      setScore(score + 1);
    }

    // Next question
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setClicked(null);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">AI Quiz</h2>

      {/* Topic input */}
      <input
        type="text"
        placeholder="Enter topic (e.g., JavaScript Arrays)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />

      <button
        onClick={getQuiz}
        className="w-full bg-purple-600 text-white p-2 rounded mb-6"
      >
        Generate Quiz
      </button>

      {/* Jab tak quiz load nahi hota */}
      {questions.length === 0 && <p>No quiz loaded...</p>}

      {/* Quiz complete hone par */}
      {done && (
        <div className="text-center">
          <h3 className="text-xl font-bold">Quiz Completed 🎉</h3>
          <p className="text-lg mt-2">
            Score: {score}/{questions.length}
          </p>
        </div>
      )}

      {/* Quiz chal raha ho */}
      {!done && questions.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-3">
            {questions[current].question}
          </h3>

          {questions[current].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setClicked(idx)}
              className={`w-full p-3 mb-2 rounded text-left border ${
                clicked === idx ? "bg-purple-500 text-white" : "bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}

          <button
            onClick={handleNext}
            className="w-full bg-green-600 text-white p-2 rounded mt-4"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default Quiz;
