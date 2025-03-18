import { useParams } from "react-router-dom";

function Contribute() {
  const {projectId} = useParams<{projectId: string}>();

  //TODO: Delayed navigate to login if user is not logged in
  //TODO: Fetch project details using projectId
  //TODO: use backends request endpoint to create a request to contribute to the project


  return (
    <div className="min-h-[80vh] w-screen mt-[100px]">
      <div>
        <h1>Contribute to Project {projectId}</h1>
      </div>
    </div>
  )
}

export default Contribute
