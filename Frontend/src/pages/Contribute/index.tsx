import { useParams } from "react-router-dom";

function Contribute() {
  const {projectId} = useParams<{projectId: string}>();

  return (
    <div>
      <div>
        <h1>Contribute to Project {projectId}</h1>
      </div>
    </div>
  )
}

export default Contribute
