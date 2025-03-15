import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../components/auth/AuthContext";
import { useNavigate } from "react-router";
import WinnersDashboard from "./Winner";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      {role === "winner" && <WinnersDashboard/>}
    </div>
  );
}

export default Dashboard;
