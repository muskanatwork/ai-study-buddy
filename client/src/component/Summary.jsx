
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SummaryQuiz() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("basic");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);

  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [showQuiz, setShowQuiz] = useState(false);

  const navigate = useNavigate();

  async function getSummary() {
    setLoading(true);
    setSummary("");
    setQuiz([]);
    setScore(null);
    setPercentage(null);
    setSubmitted(false);
    setAnswers({});
    setCurrentQuestion(0);
    setShowQuiz(false);

    const res = await fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, level }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  }

  async function startQuiz() {
    if (!selectedTime) return;

    setLoading(true);
    setScore(null);
    setPercentage(null);
    setSubmitted(false);
    setAnswers({});
    setCurrentQuestion(0);

    setTimeLeft(Number(selectedTime));
    setShowQuiz(true); 

    const res = await fetch("http://localhost:5000/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, level }),
    });

    const data = await res.json();
    setQuiz(data.quiz || []);

    setLoading(false);
  }

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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

    const total = quiz.length;
    const percent = Math.round((correct / total) * 100);

    setScore(correct);
    setPercentage(percent);
    setSubmitted(true);
    setTimeLeft(null);

    setShowQuiz(false);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        AI Study Buddy
      </h2>

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      >
        <option value="basic">Basic</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <button
        onClick={getSummary}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
      >
        Get Summary
      </button>

      {loading && <p className="text-center mt-4">Loading...</p>}

      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {summary && !showQuiz && !submitted && (
        <div>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full mt-4 p-3 border rounded-lg"
          >
            <option value="">Select Time</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
          </select>

          <button
            onClick={startQuiz}
            disabled={!selectedTime}
            className={`w-full mt-4 text-white p-3 rounded-lg ${
              selectedTime
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Start Quiz
          </button>

          <button
            onClick={openFlashcards}
            className="w-full mt-3 bg-purple-600 text-white p-3 rounded-lg"
          >
            Flash Cards
          </button>
        </div>
      )}

      {/* QUIZ */}
      {showQuiz && quiz.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <div className="text-center text-red-600 text-xl font-bold mb-4">
            ⏳ Time Left: {timeLeft}s
          </div>

          <h3 className="text-lg font-semibold mb-4">
            Question {currentQuestion + 1} / {quiz.length}
          </h3>

          <p className="font-medium">{quiz[currentQuestion].question}</p>

          {quiz[currentQuestion].options.map((opt, i) => (
            <label key={i} className="block ml-5 my-1">
              <input
                type="radio"
                name={`q-${currentQuestion}`}
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
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Previous
              </button>
            )}

            {currentQuestion < quiz.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-auto"
              >
                Next
              </button>
            )}

            {currentQuestion === quiz.length - 1 && (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg ml-auto"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* SCORE */}
      {submitted && (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-700">
            Successfully Completed Quiz!
          </h3>

          <p className="mt-3 text-xl font-semibold text-blue-700">
            Marks: {score} / {quiz.length}
          </p>

          <p className="text-xl font-semibold text-orange-600">
            Percentage: {percentage}%
          </p>
        </div>
      )}
    </div>
  );
}

export default SummaryQuiz;
