import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const WinnersDashboard = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch winner's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `https://your-backend-api.com/projects/winner/${userId}`
        );
        setProjects(response.data.projects);
      } catch (err) {
        setError("Failed to load projects.");
      }
      setLoading(false);
    };

    fetchProjects();
  }, [userId]);

  // Handle project removal
  const removeProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to remove this project?"))
      return;

    try {
      await axios.delete(
        `https://your-backend-api.com/projects/delete/${projectId}`,
        {
          headers: { Authorization: `Bearer ${userId}` },
        }
      );

      setProjects(projects.filter((project) => project._id !== projectId));
      toast.success("Project removed successfully!");
    } catch (err) {
      toast.error("Failed to remove project.");
    }
  };

  return (
    <div className="mt-[120px] min-h-[80vh] w-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🏆 Winner's Dashboard</h2>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {projects.length === 0 ? (
              <p className="text-gray-600">No projects added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="text-sm text-gray-600">
                      {project.description.slice(0, 100)}...
                    </p>
                    <button
                      onClick={() => removeProject(project._id)}
                      className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg"
                    >
                      ❌ Remove Project
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => navigate("/create-project")}
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          ➕ Add New Project
        </button>
      </div>
    </div>
  );
};

export default WinnersDashboard;
