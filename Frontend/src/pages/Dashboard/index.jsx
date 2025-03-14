import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../components/auth/AuthContext";
import { useNavigate } from "react-router";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      timeoutRef.current = setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      if (!user.role) {
        navigate("/home");
      }
      setRole(user.role || "");
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, navigate]);

  return (
    <div className="mt-[80px]">
      <h1>Dashboard</h1>
      <h2>Welcome, {user?.name}</h2>
      <h3>Your Role: {role}</h3>
    </div>
  );
}

export default Dashboard;
