import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";
import ProjectCard from "@/components/projects/Card";
import SearchBar from "@/components/Search";
import { ArrowDownWideNarrow } from "lucide-react";

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
  branch: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/projects`);
        console.log(response.data);
        setProjects(response.data.response);
      } catch (err) {
        setError("Failed to load projects.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) =>
      Object.values(project).some((value) => {
        return value?.toString().toLowerCase().includes(search.toLowerCase());
      })
    );
    setFilteredProjects(filtered);
  }, [search, projects]);

  return (
    <div className="mt-[120px] min-h-[80vh] w-screen">
      <h1 className="text-5xl font-bold font-rubik underline text-primary text-center mb-6">
        Projects
      </h1>

      {/* <div className="max-w-sm justify-self-end mr-6 mb-10">
          <Input
            id="search"
            icon={<Search size={20} />}
            placeholder="Search"
            type="text"
            onChange={(e) => {
              setSearch(e.target.value);
              }}
              value={search}
              />
              </div> */}
      <div className="max-w-4xl mx-auto p-6 rounded-lg">
        <div className="mb-8 w-full justify-self-start px-2 flex justify-between items-center">
          <SearchBar
            onSearch={(e) => {
              setSearch(e);
            }}
          />
          <div className="flex gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowDownWideNarrow size={20} />
              </div>
              <select
                name="Branch"
                id="barnch"
                className="pl-10 pr-3 py-2 bg-transparent border-2 border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                defaultValue={"ALL"}
              >
                <option value="ALL">ALL</option>
                <option value="IT">IT</option>
                <option value="CSE">CSE</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowDownWideNarrow size={20} />
              </div>
              <select
                name="Status"
                id="status"
                className="pl-10 pr-3 py-2 border-2 border-black rounded-xl focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                defaultValue={"ALL"}
              >
                <option value="ALL">ALL</option>
                <option value="available">Available</option>
                <option value="taken">Taken</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <p className="text-gray-600">No Projects</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    problemId={project.problemId}
                    status={project.status}
                    branch={project.branch}
                    problem_statement={project.problem_statement}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
