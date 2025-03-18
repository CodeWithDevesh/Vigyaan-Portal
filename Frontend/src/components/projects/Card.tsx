import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import ProjectCardTrigger from "./CardTrigger";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProjectCardProps {
  projectId: string;
  problemId: string;
  title: string;
  description: string;
  image: string;
  status: string;
  branch: string;
  problem_statement: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectId,
  problemId,
  problem_statement,
  title,
  description,
  image,
  status,
  branch,
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col sm:flex-row w-full h-full space-x-2 select-none border-primary border-3 rounded-3xl bg-white py-2 px-3 hover:scale-105 transition-all shadow-[0px_10px_10px_rgba(0,0,0,0.4)]">
          <ProjectCardTrigger
            title={title}
            image={image}
            description={description}
            status={status}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] font-roboto">
        <DialogTitle></DialogTitle>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <img
            className="h-48 max-w-80 rounded-2xl object-contain"
            src={image}
            alt=""
          />
          <div className="space-y-5 pr-1">
            <div>
              <h1 className="text-2xl font-bold font-rubik">Problem:</h1>
              <h2 className="font-bold font-rubik text-righ">{problemId}</h2>
              <h2 className="font-bold font-rubik text-righ">
                Branch: {branch}
              </h2>
              <p>{problem_statement}</p>
            </div>
            <div>
              <h1 className="font-bold text-2xl font-rubik">{title}</h1>
              <p>{description}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          {!user && <p className="text-red-500">Login to contribute</p>}
          {user?.role === "user" && status === "available" && (
            <Button className="bg-primary text-white" onClick={() => {navigate(`/contribute/${projectId}`)}}>Contribute</Button>
          )}
          {user?.role === "user" && status === "taken" && (
            <Button className="bg-primary text-white" disabled>
              Taken
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCard;
