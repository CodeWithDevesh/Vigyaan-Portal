import React, { useContext, useEffect, useState } from "react";
import { LockIcon } from "../../components/icons";
import Input from "../../components/Input";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/auth/AuthContext";
import { useNavigate, Link } from "react-router";
import { api } from "../../helpers/api";

function ChangePass() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    api
      .post(`/auth/change-password`, {
        old_pass: currentPass,
        new_pass: newPass,
      })
      .then((res) => {
        if (res.data.ok) {
          toast.success("Password changed successfully!");
          navigate("/profile");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.response.data.message ||
            "Failed to change password. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-[80vh] w-screen mt-[100px] flex items-center justify-center bg-opacity-50">
      <div className="bg-white flex flex-col rounded-lg shadow-[0px_35px_35px_rgba(0,0,0,0.4)] w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary">Change Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="**********"
            icon={<LockIcon />}
            label={"Current Password"}
            value={currentPass}
            onChange={(e) => {
              setCurrentPass(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="**********"
            icon={<LockIcon />}
            label={"New Password"}
            value={newPass}
            onChange={(e) => {
              setNewPass(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="**********"
            icon={<LockIcon />}
            label={"Confirm New Password"}
            value={confirmPass}
            onChange={(e) => {
              setConfirmPass(e.target.value);
            }}
          />
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer py-2 px-4 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </div>
        </form>

        <Link to={"/forgotPass"} className="mb-3 ml-auto mr-6 text-sm underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}

export default ChangePass;
