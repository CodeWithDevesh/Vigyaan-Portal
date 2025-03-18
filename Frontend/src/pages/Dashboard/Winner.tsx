import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../../helpers/api";
import { ChevronDown, PlusCircle } from "lucide-react";
import { ConfirmDialog } from "../../components/Confirm";
import { toast } from "react-toastify";
import { Link } from "react-router";

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
  requests: Request[];
  expanded?: boolean;
}

interface Request {
  createdAt: string;
  requested_by: { _id: string; name: string; email: string };
  project_id: { _id: string; title: string; description: string };
  status: string;
  request_date: string;
  _id: string;
}

const WinnersDashboard = () => {
  const [loadedProjects, setLoadedProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [load, setLoad] = useState(true);

  

  // Fetch winner's projects and requests
  useEffect(() => {
    const blah = async () => {
      try {
        const response = await api.get(`/requests`);
        setRequests(response.data.requests);
        const response2 = await api.get(`/me/projects`);
        setLoadedProjects(response2.data.response);
      } catch (err) {
        console.log(err);
      }
      setLoad(false);
    };

    if (load) blah();
  }, [load]);

  useEffect(() => {
    const updatedProjects = loadedProjects.map((project) => {
      const projectRequests = requests.filter(
        (request) => request.project_id._id === project._id
      );
      return { ...project, requests: projectRequests };
    });
    setProjects(updatedProjects);
  }, [loadedProjects]);

  const approveRequest = async (requestId: string) => {
    try {
      await api.post(`/requests/${requestId}/approve`);
      toast.success("Request Approved");
    } catch (err) {
      console.log(err);
      toast.error("Error approving request");
    }
    setLoad(true);
  };
  const denyRequest = async (requestId: string) => {
    try {
      await api.post(`/requests/${requestId}/deny`);
      toast.success("Request Denied");
    } catch (err) {
      console.log(err);
      toast.error("Error denying request");
    }
    setLoad(true);
  };

  return (
    <div className="mt-[120px] min-h-[80vh] w-screen">
      <div className="w-[90vw] max-w-5xl m-auto space-y-5">
        <h1 className="text-4xl text-center font-bold text-primary">
          Dashboard
        </h1>
        <div className="bg-white flex flex-col items-stretch p-3 gap-3 sm:gap-5">
          <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold font-rubik">Projects</h2>
          <Link className="mr-3" to={"/newProject"}><PlusCircle size={30} color="green"/></Link>
          </div>
          <div className="w-full flex flex-col gap-3 items-center">
            {projects.length === 0 && (<p>You haven't added any projects yet</p>)}
            {projects?.map((project: any) => (
              <div
                key={project._id}
                className="w-full overflow-hidden flex flex-col gap-2 items-center border-2 border-black rounded-xl "
              >
                <div
                  className="flex w-full justify-between p-3"
                  onClick={() => {
                    project.expanded = !project.expanded;
                    setProjects([...projects]);
                  }}
                >
                  <h1 className="font-semibold text-lg">{project.title}</h1>
                  <button>
                    <ChevronDown size={20} />
                  </button>
                </div>
                {project.expanded && (
                  <div
                    className={`transition-all overflow-hidden w-full p-3 pt-0`}
                  >
                    <h2 className="font-semibold text-md mb-2">Requests</h2>
                    <ul className="space-y-2">
                      {project.requests.map((request: Request) => (
                        <li
                          key={request._id}
                          className="border border-black p-2 rounded-lg flex flex-col justify-between items-stretch gap-1 sm:flex-row sm:items-center"
                        >
                          <div className="">
                            <h3 className="font-semibold text-sm">
                              {request.requested_by.name}
                            </h3>
                            <p className="text-xs">
                              {request.requested_by.email}
                            </p>
                          </div>
                          <div className="space-x-1 self-end sm:self-auto">
                            <ConfirmDialog
                              message={`Are you sure you want to approve ${request.requested_by.name}'s request`}
                              buttonName="Approve"
                              buttonStyle="bg-green-600 hover:bg-green-700"
                              onConfirm={() => {
                                approveRequest(request._id);
                              }}
                            ></ConfirmDialog>
                            <ConfirmDialog
                              message={`Are you sure you want to deny ${request.requested_by.name}'s request`}
                              buttonName="Deny"
                              buttonStyle="bg-red-600 hover:bg-red-700"
                              onConfirm={() => {
                                denyRequest(request._id);
                              }}
                            ></ConfirmDialog>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnersDashboard;
