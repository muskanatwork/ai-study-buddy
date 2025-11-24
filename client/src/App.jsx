import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SummaryQuiz from './component/Summary'
import Login from './pages/Login'
import Signup from './pages/Signup'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
            <SummaryQuiz />

{/* <Login/>
<Signup/> */}
    </>
  )
}

export default App
