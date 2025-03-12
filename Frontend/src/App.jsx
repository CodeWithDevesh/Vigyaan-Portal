import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Projects from "./pages/Projects";
import { AnimatePresence } from "framer-motion";
import Signup from "./components/auth/signup";
import LoginPage from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import UserDashboard from "./pages/Dashboard/User";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar
          closeOnClick={false}
          pauseOnHover
          draggable={false}
          theme="light"
        />
        <AnimatePresence>
          <Routes key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </>
  );
}

export default App;
