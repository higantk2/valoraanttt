import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AgentDetail from "./pages/AgentDetail";
import TopAgents from "./pages/TopAgents";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Weapons from "./pages/Weapons"; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/:agentUuid"
          element={
            <ProtectedRoute>
              <AgentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-agents"
          element={
            <ProtectedRoute>
              <TopAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* --- NEW WEAPONS ROUTE --- */}
        <Route
          path="/weapons"
          element={
            <ProtectedRoute>
              <Weapons />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;