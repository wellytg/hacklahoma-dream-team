import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import WelcomeScreen from './components/onboarding/WelcomeScreen'
import QuestionScreen from './components/onboarding/QuestionScreen'
import CompletionScreen from './components/onboarding/CompletionScreen'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/onboarding/question/:id" element={<QuestionScreen />} />
        <Route path="/onboarding/complete" element={<CompletionScreen />} />
        <Route path="/dashboard" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Coming Soon</h1>
              <p className="text-gray-600">This is where your personalized dashboard will be.</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
