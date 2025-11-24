



import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SummaryQuiz() {
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const navigate = useNavigate();

  async function getSummary() {
    setLoading(true);
    setSummary("");
    setQuiz([]);
    setScore(null);
    setAnswers({});
    setCurrentQuestion(0);

    const res = await fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setSummary(data.summary);

    setLoading(false);
  }

  async function startQuiz() {
    setLoading(true);
    setQuiz([]);
    setScore(null);
    setAnswers({});
    setCurrentQuestion(0);

    const res = await fetch("http://localhost:5000/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setQuiz(data.quiz || []);

    setLoading(false);
  }

  // Navigate to Flashcards Page
  function openFlashcards() {
    navigate("/flashcards", { state: { topic } });
  }

  function handleOptionSelect(qIndex, option) {
    setAnswers({ ...answers, [qIndex]: option });
  }

  function handleSubmit() {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) correct++;
    });
    setScore(correct);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        AI Summary + Quiz
      </h2>

      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={getSummary}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Get Summary
      </button>

      {loading && <p className="text-center mt-4 text-gray-600">Loading...</p>}

      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Summary:</h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* START QUIZ + FLASHCARD BUTTONS */}
      {summary && !quiz.length && (
        <div>
          <button
            onClick={startQuiz}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
          >
            Start Quiz
          </button>

          <button
            onClick={openFlashcards}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
          >
            Flash Cards
          </button>
        </div>
      )}

      {quiz.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Question {currentQuestion + 1} / {quiz.length}
          </h3>

          <p className="font-medium text-gray-800">
            {quiz[currentQuestion].question}
          </p>

          {quiz[currentQuestion].options.map((opt, i) => (
            <label key={i} className="block ml-5 my-1 cursor-pointer">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === opt}
                onChange={() => handleOptionSelect(currentQuestion, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}

          <div className="mt-4 flex justify-between">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Previous
              </button>
            )}

            {currentQuestion < quiz.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-auto"
              >
                Next
              </button>
            )}

            {currentQuestion === quiz.length - 1 && (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg ml-auto"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {score !== null && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
          <h3 className="text-xl font-bold text-blue-700">
            Your Score: {score} / {quiz.length}
          </h3>
        </div>
      )}
    </div>
  );
}

export default SummaryQuiz;
