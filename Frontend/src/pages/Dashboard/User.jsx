import React, { useState, useEffect } from "react";

const UserDashboard = () => {
  const [contributedProject, setContributedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch user contribution status
    fetch("/api/user/contribution")
      .then((res) => res.json())
      .then((data) => setContributedProject(data.project));

    // Fetch available projects
    fetch("/api/projects/available")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const handleRequestContribution = (projectId) => {
    fetch(`/api/projects/${projectId}/request`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setContributedProject(data.project));
  };

  const handleWithdrawContribution = () => {
    fetch(`/api/projects/${contributedProject.id}/withdraw`, { method: "POST" })
      .then(() => setContributedProject(null));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600">User Dashboard</h1>

      {contributedProject ? (
        <div className="mt-6 p-6 bg-white shadow-lg rounded-xl w-full max-w-3xl text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Contribution
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            You are currently contributing to: <strong>{contributedProject.name}</strong>
          </p>
          <button
            onClick={handleWithdrawContribution}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-lg font-medium hover:bg-red-700 transition"
          >
            ❌ Withdraw Contribution
          </button>
        </div>
      ) : (
        <div className="mt-6 w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Available Projects
          </h2>
          <ul className="mt-4 space-y-3">
            {projects.length > 0 ? (
              projects.map((project) => (
                <li key={project.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                  <span className="text-lg font-medium">{project.name}</span>
                  <button
                    onClick={() => handleRequestContribution(project.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    ✨ Request to Contribute
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600 text-center">No projects available for contribution.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
