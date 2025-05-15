import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import Welcome from "./pages/Welcome";

const Home = () => {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <div>
      <h2>Home</h2>
      {user ? (
        <>
          <div>Welcome, {user.name} ({user.role})</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <div>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
