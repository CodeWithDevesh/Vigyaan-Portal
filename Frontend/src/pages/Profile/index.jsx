import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "@multiavatar/multiavatar";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("5th");
  const [profileIcon, setProfileIcon] = useState(null);

  // For discarding changes if canceled
  const [oldFullName, setOldFullName] = useState(fullName);
  const [oldEmail, setOldEmail] = useState(email);
  const [oldBranch, setOldBranch] = useState(branch);
  const [oldSemester, setOldSemester] = useState(semester);

  useEffect(() => {
    //TODO: Fetch user data from backend and set the state
  }, []);

  useEffect(() => {
    const svgCode = avatar(fullName);
    setProfileIcon(svgCode);
  }, [fullName]);

  const handleEditClick = () => {
    if (!isEditing) {
      setOldFullName(fullName);
      setOldEmail(email);
      setOldBranch(branch);
      setOldSemester(semester);
      setIsEditing(true);
    } else {
      setFullName(oldFullName);
      setEmail(oldEmail);
      setBranch(oldBranch);
      setSemester(oldSemester);
      setIsEditing(false);
    }
  };

  const handleSaveClick = () => {
    //TODO: Send the updated data to the backend

    setIsEditing(false);
  };

  return (
    <div className="min-h-[80vh] w-screen flex items-center mt-[80px] pb-[80px]">
      <div className=" w-1/2 max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="w-full flex justify-center">
          <div
            className="h-[100px] w-[100px] self-center rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          ></div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name:</label>
          <input
            type="text"
            disabled={!isEditing}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            disabled={!isEditing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Branch:</label>
          <select
            disabled={!isEditing}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Mechanical Engineering">
              Mechanical Engineering
            </option>
            <option value="Electrical Engineering">
              Electrical Engineering
            </option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Semester:</label>
          <input
            type="text"
            disabled={!isEditing}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={!isEditing}
            className={`px-4 py-2 text-white rounded-lg transition ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
          <Link
            to="/changePass"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
