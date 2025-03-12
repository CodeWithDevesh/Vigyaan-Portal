import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import {
  BookText,
  Code,
  FileText,
  ImageIcon,
  AlertCircle,
  Send,
} from "lucide-react";

const CreateProject = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    problem_statement: "",
    branch: "",
    image: "",
  });
  const [formProgress, setFormProgress] = useState(0);

  const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "BT"];

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = ["title", "problem_statement", "branch"];
    const filledFields = requiredFields.filter((field) => formData[field].trim() !== "");
    setFormProgress((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.problem_statement.trim()) errors.problem_statement = "Problem statement is required";
    if (!formData.branch) errors.branch = "Branch is required";
    return errors;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);

      // Show toast for validation errors
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const result = await response.json();

      toast.success("Project created successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });

      // Reset form after success
      setFormData({
        title: "",
        problem_statement: "",
        branch: "",
        image: "",
      });

      // Redirect or handle success (e.g., navigate to project details)
      console.log("Project created:", result);
    } catch (error) {
      toast.error("Failed to create project. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] w-screen mt-[100px] flex items-center justify-center bg-opacity-50">
      <ToastContainer />

      <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <motion.div
            className="h-1 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary text-center">Create New Project</h1>
          <p className="text-sm text-gray-600 text-center">
            Submit your innovative project to Vigyaan Portal
          </p>
        </div>

        {/* Form Errors */}
        {Object.keys(formErrors).length > 0 && (
          <div className="bg-red-50 p-3 mx-6 rounded-md flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-sm text-red-600">Please fix the errors in the form</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Project Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Project Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter an innovative project title"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            {formErrors.title && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-1">
            <label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
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
            {formErrors.branch && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.branch}
              </p>
            )}
          </div>

          {/* Problem Statement */}
          <div className="space-y-1">
            <label htmlFor="problem_statement" className="text-sm font-medium text-gray-700">
              Problem Statement
            </label>
            <div className="relative">
              <div className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="problem_statement"
                name="problem_statement"
                value={formData.problem_statement}
                onChange={handleInputChange}
                placeholder="Describe the problem your project aims to solve..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black min-h-[100px]"
                required
              />
            </div>
            {formErrors.problem_statement && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.problem_statement}
              </p>
            )}
          </div>

          {/* Image URL (Optional) */}
          <div className="space-y-1">
            <label htmlFor="image" className="text-sm font-medium text-gray-700">
              Image URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter a URL for your project image"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setFormData({ title: "", problem_statement: "", branch: "", image: "" })}
              disabled={isSubmitting}
              className="py-2 px-4 rounded-md bg-gray-200 text-black font-medium hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;