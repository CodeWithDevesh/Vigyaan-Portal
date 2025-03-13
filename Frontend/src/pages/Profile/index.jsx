import React, { use, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar from "@multiavatar/multiavatar";
import {
  BookIcon,
  MailIcon,
  UserIcon,
  GraduationCapIcon,
} from "../../components/icons";
import { AuthContext } from "../../components/auth/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "../../helpers/api";
const server = import.meta.env.VITE_SERVER_URL;

function Profile() {
  const { user, loadUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [gradYear, setGradYear] = useState(new Date().getFullYear());
  const [profileIcon, setProfileIcon] = useState(null);

  useEffect(() => {
    if (!user) {
      // Reset to empty strings if user is not defined
      setFullName("");
      setEmail("");
      setBranch("");
      setGradYear(new Date().getFullYear());
    } else {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setBranch(user.branch || "");
      setGradYear(user.grad_year || new Date().getFullYear());
    }
  }, [user]);

  // For discarding changes if canceled
  const [oldFullName, setOldFullName] = useState(fullName);
  const [oldEmail, setOldEmail] = useState(email);
  const [oldBranch, setOldBranch] = useState(branch);
  const [oldGradYear, setOldGradYear] = useState(gradYear);

  const branches = ["CSE", "IT", "ECE", "EEE", "ME", "CE", "BT"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear + i);

  useEffect(() => {
    const svgCode = avatar(fullName);
    setProfileIcon(svgCode);
  }, [fullName]);

  const handleEditClick = () => {
    if (!isEditing) {
      setOldFullName(fullName);
      setOldEmail(email);
      setOldBranch(branch);
      setOldGradYear(gradYear);
      setIsEditing(true);
    } else {
      setFullName(oldFullName);
      setEmail(oldEmail);
      setBranch(oldBranch);
      setGradYear(oldGradYear);
      setIsEditing(false);
    }
  };

  const handleSaveClick = () => {
    //TODO: Send the updated data to the backend
    api
      .post(`/users/me`, {
        name: fullName,
        branch,
        grad_year: gradYear,
      })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Profile updated successfully");
        } else {
          toast.error("Failed to update profile");
          console.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Failed to update profile");
        console.error(err);
      })
      .finally(() => {
        loadUser();
        setIsEditing(false);
      });
  };

  return (
    <div className="min-h-[80vh] w-screen flex items-center mt-[80px] pb-[80px]">
      <div className=" w-1/2 max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)]">
        <div className="w-full flex justify-center">
          <div
            className="h-[100px] w-[100px] self-center rounded-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          ></div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              id="name"
              name="name"
              placeholder="Rohan Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            College Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@college.edu"
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="branch" className="text-sm font-medium text-gray-700">
            Branch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookIcon />
            </div>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
              required
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="text-sm font-medium text-gray-700">
            Graduation Year
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCapIcon />
            </div>
            <select
              id="year"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none"
              required
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
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
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-950 transition"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
