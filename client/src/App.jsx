import SummaryQuiz from "./component/Summary";
import Flashcards from "./pages/FlashCards";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SummaryQuiz />} />
      <Route path="/flashcards" element={<Flashcards />} />
    </Routes>
  );
}

export default App;
