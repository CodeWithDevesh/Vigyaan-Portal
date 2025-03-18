import { AuthContext } from "@/components/auth/AuthContext";
import { ConfirmDialog } from "@/components/Confirm";
import Input from "@/components/Input";
import { api } from "@/helpers/api";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function CreateProject() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const branches = ["CSE", "IT", "ECE", "ME", "EE"];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problemId, setProblemId] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [branch, setBranch] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      timeoutRef.current = setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      if (user.role != "winner") {
        navigate("/home");
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, navigate]);

  const createProject = async () => {
    if (!title) toast.error("Title is required");
    if (!description) toast.error("Description is required");
    if (!problemId) toast.error("Problem ID is required");
    if (!problemStatement) toast.error("Problem Statement is required");
    if (!branch) toast.error("Branch is required");
    if (!image) toast.error("Image is required");
    if (
      !title ||
      !description ||
      !problemId ||
      !problemStatement ||
      !branch ||
      !image
    )
      return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("problemId", problemId);
    formData.append("problem_statement", problemStatement);
    formData.append("branch", branch);
    formData.append("file", image as Blob);

    api
      .post("/projects", formData)
      .then((res) => {
        if (res.data.ok) {
          toast.success("Project Created Successfully");
          navigate("/projects");
        } else {
          toast.error("Failed to create project");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || "Failed to create project");
      });
  };

  return (
    <div className="my-[100px] h-full">
      <div className="max-w-5xl min-h-[50vh] w-[90vw] mx-auto flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full overflow-hidden">
          <div className="p-6">
            <h2 className="text-center text-xl font-bold text-primary">
              Create a Project
            </h2>
            <p className="text-center text-sm text-gray-600 mt-1">
              Enter project details below
            </p>
          </div>
          <form className="p-6 pt-0 space-y-2 flex justify-center flex-col items-stretch">
            <Input
              label="Title"
              placeholder=""
              value={title}
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              id="title"
            />
            <Input
              label="Description"
              placeholder=""
              value={description}
              type="text"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              id="description"
              textBox
            />
            <Input
              label="Problem ID"
              placeholder=""
              value={problemId}
              type="text"
              onChange={(e) => {
                setProblemId(e.target.value);
              }}
              id="pid"
            />
            <Input
              label="Problem Statement"
              placeholder=""
              value={problemStatement}
              type="text"
              onChange={(e) => {
                setProblemStatement(e.target.value);
              }}
              id="ps"
              textBox
            />

            <div className="space-y-1">
              <label
                htmlFor="branch"
                className="text-sm font-medium text-gray-700"
              >
                Branch
              </label>
              <div className="relative">
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => {
                    setBranch(e.target.value);
                  }}
                  className="text-xs lg:text-lg w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
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

            <Input
              label="Image"
              placeholder=""
              type="file"
              accept="image/*"
              onChange={(e) => {
                console.log(e.target.files);
                setImage(e.target.files?.[0] || null);
              }}
              id="img"
            />

            <ConfirmDialog
              message="You can't edit project details later..."
              buttonName="Create Project"
              buttonStyle="w-full mt-3 max-w-sm self-center"
              onConfirm={createProject}
            ></ConfirmDialog>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
