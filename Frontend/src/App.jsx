import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Projects from "./pages/Projects";
import { AnimatePresence } from "framer-motion";
import Signup from "./components/auth/signup";
import LoginPage from "./pages/Login";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <AnimatePresence>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </>
  );
}

export default App;
