import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "@/helpers/api";
import { toast } from "react-toastify";
import { ConfirmDialog } from "./ConfirmDialog";

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

function Contribute() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [message, setMessage] = useState("");

  //TODO: Delayed navigate to login if user is not logged in
  //TODO: Fetch project details using projectId
  //TODO: use backends request endpoint to create a request to contribute to the project

  useEffect(() => {
    api
      .get(`/projects/${projectId}`)
      .then((response) => {
        setProject(response.data.response);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const submit = () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    api
      .post(`/requests`, {
        project_id: projectId,
        message,
        subject: `Request to contribute to ${project?.title}`,
      })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Request sent successfully");
        } else {
          toast.error("Failed to send request");
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send request");
      });
  };

  return (
    <div className="min-h-[80vh] w-screen my-[100px]">
      <div className="flex flex-col justify-center items-center w-[90vw] max-w-4xl m-auto gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-rubik text-center">
          {project?.title}
        </h1>
        <div className="w-full flex flex-col justify-center items-stretch sm:items-center gap-2">
          <img
            className="w-full max-w-sm object-center self-center"
            src={project?.image}
            alt=""
          />
          <h2 className="font-roboto"> {project?.description}</h2>
        </div>
        <div className="w-full flex flex-col justify-center items-stretch gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-rubik text-center">
            Problem
          </h1>
          <h2>{project?.problem_statement}</h2>
          <h2 className="text-right mr-2 font-semibold font-rubik">
            Branch: {project?.branch}
          </h2>
        </div>

        <div className="w-full flex flex-col justify-center items-stretch gap-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-rubik text-center">
            Request Access
          </h1>
          <h2>Describe how you will contribute to this project.</h2>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg" htmlFor="message">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="border-2 rounded-xl p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start by introducing yourself first..."
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <ConfirmDialog
              onConfirm={() => {
                submit();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
