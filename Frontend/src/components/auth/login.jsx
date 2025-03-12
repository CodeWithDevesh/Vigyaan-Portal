import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Heroicons
import {
  CheckCircleIcon,
  GraduationCapIcon,
  BookIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../icons";
// const server = import.meta.env.VITE_SERVER_URL;

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${server}/vigyaanportal/v1/auth/login`, {
        email,
        password,
      });

      if (response.data.ok) {
        localStorage.setItem("token", response.data.token);
        toast.success("Logged in successfully!", {
          position: "top-center",
        });
        setTimeout(() => navigate("/"), 1500); // Delay for toast visibility
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred during login.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access Vigyaan Portal to explore and collaborate on innovative projects
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              College Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon />
              </div>
              <input
                id="email"
                type="email"
                placeholder="your.email@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-400 transition duration-200"
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signup" className="text-black hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default LoginForm;