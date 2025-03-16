import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";
import ProjectCard from "@/components/projects/Card";

interface Project {
  _id: string;
  title: string;
  image: string;
  assigned_to: string;
  created_by: string;
  createdAt: string;
  description: string;
  problemId: string;
  problem_statement: string;
  updatedAt: string;
  status: string;
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
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    problemId={project._id}
                    status={project.status}
                    created_by="Admin"
                    branch="Master"
                    assigned_to="Admin"
                  />
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
