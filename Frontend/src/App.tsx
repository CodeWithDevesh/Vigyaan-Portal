import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Projects from "./pages/Projects";
import { AnimatePresence } from "framer-motion";
import Signup from "./components/auth/signup";
import LoginPage from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import { AuthProvider } from "./components/auth/AuthContext";
import NotVerified from "./components/auth/NotVerified";
import ChangePass from "./pages/Profile/changePass";
import ForgotPass from "./pages/Profile/forgotPass";
import Dashboard from "./pages/Dashboard";
import Contribute from "./pages/Contribute";
import CreateProject from "./pages/Projects/CreateProject";

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forgotPass" element={<ForgotPass />} />
              <Route path="/contribute/:projectId" element={<Contribute />} />
              <Route path="/create/project" element={<CreateProject />} />
              <Route
                path="*"
                element={
                  <div className="h-screen w-screen flex items-center justify-center">
                    <h1>404 Not Found</h1>
                  </div>
                }
              />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
