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
import { AuthProvider, AuthContext } from "./components/auth/AuthContext";
import Otp from "./components/auth/otp";
import NotVerified from "./components/auth/NotVerified";
import { useContext } from "react";
import ChangePass from "./pages/Profile/changePass";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <Navbar />
        {<NotVerified />}
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/changePass" element={<ChangePass />} />
              <Route path="/userdashboard" element={<UserDashboard />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
