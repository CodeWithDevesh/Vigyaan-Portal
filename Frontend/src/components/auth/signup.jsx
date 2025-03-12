import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
const server = import.meta.env.VITE_SERVER_URL;

// Heroicons (import as needed)
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const Signup = ({ onClose = () => {} }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    sem: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "BT"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    // Simple check for college email
    return email.endsWith(".edu") || email.includes("ac.in");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (step === 1) {
        // Validate email
        if (!validateEmail(formData.email)) {
          throw new Error("Please use your college email address");
        }

        axios
          .post(`${server}/vigyaanportal/v1/auth/signup`, formData)
          .then((res) => {
            console.log(res);
            
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // Simulate OTP verification (replace this with your actual API call)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        console.log("OTP verified:", otp);

        // Show success message and close modal
        alert("Registration successful: Your account has been created!");
        onClose(); // Call the onClose function to close the modal
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-screen mt-[100px] flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full max-w-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-1 bg-primary transition-all duration-500 ease-in-out ${
              step === 1 ? "w-1/2" : "w-full"
            }`}
          ></div>
        </div>

        {/* Modal Header */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">
            {step === 1 ? "Create an Account" : "Verify Your Email"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {step === 1
              ? "Join Vigyaan Portal to explore and collaborate on innovative projects"
              : "Enter the 6-digit verification code sent to your email"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 p-3 mx-6 rounded-md flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Branch and Semester Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="branch"
                    className="text-sm font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookIcon />
                    </div>
                    <select
                      id="branch"
                      value={formData.branch}
                      onChange={(e) =>
                        handleSelectChange("branch", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="sem"
                    className="text-sm font-medium text-gray-700"
                  >
                    Semester
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCapIcon />
                    </div>
                    <select
                      id="sem"
                      value={formData.sem}
                      onChange={(e) =>
                        handleSelectChange("sem", e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                      required
                    >
                      <option value="">Select</option>
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 text-lg font-rubik gap-2">
                <p>Already have an account...</p>
                <Link to={"/login"} className="underline">
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* OTP Notification */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <div>
                    <h4 className="font-medium text-black">
                      Verification Required
                    </h4>
                    <p className="text-sm text-gray-600">
                      We've sent a 6-digit code to{" "}
                      <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Field */}
              <div className="space-y-1">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="otp"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black text-center text-lg tracking-widest"
                  required
                />
                <p className="text-sm text-gray-500 text-center">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-black hover:text-gray-800"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {isLoading
                ? "Processing..."
                : step === 1
                ? "Continue"
                : "Verify & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
