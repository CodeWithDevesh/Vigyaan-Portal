import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const WinnersDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch winner's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/projects`);
        console.log(response.data);
        setProjects(response.data.response);
      } catch (err) {
        setError("Failed to load projects.");
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Handle project removal
  const removeProject = async (_projectId: string) => {
    if (!window.confirm("Are you sure you want to remove this project?"))
      return;

    //TODO: Remove project from backend
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
