import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function FlashCards() {
  const location = useLocation();
  const topic = location.state?.topic || "";
  const [flashcards, setFlashcards] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  async function fetchFlashcards() {
    const res = await fetch("http://localhost:5000/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setFlashcards(data.flashcards || []);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        FlashCards: {topic}
      </h2>

      <div className="space-y-6">
        {flashcards.map((card, index) => (
          <div
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full h-40 cursor-pointer perspective"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
                openIndex === index ? "rotate-y-180" : ""
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 bg-gray-100 p-4 rounded-lg shadow-lg flex items-center justify-center backface-hidden">
                <h3 className="font-bold text-xl text-gray-800 text-center">
                  {card.title}
                </h3>
              </div>

              {/* Back */}
              <div className="absolute inset-0 bg-blue-100 p-4 rounded-lg shadow-lg rotate-y-180 backface-hidden flex items-center justify-center">
                <p className="text-gray-800 text-center">
                  {card.description}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlashCards;
