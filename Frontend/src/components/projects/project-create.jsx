import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookText,
  Code,
  FileText,
  ImageIcon,
  AlertCircle,
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

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      setIsSubmitting(false);
      return;
    }

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
      setFormErrors({});
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

      <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full max-w-sm overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className={`h-1 bg-primary transition-all duration-500 ease-in-out`}
            style={{ width: `${formProgress}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Create New Project</h2>
          <p className="text-sm text-gray-600 mt-1">
            Submit your innovative project to Vigyaan Portal
          </p>
        </div>

        {/* Error Message */}
        {Object.keys(formErrors).length > 0 && (
          <div className="bg-red-50 p-3 mx-6 rounded-md flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-sm text-red-600">Please fix the errors in the form</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Enter a URL for your project image"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;