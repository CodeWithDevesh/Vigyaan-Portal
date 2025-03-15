import { useContext } from "react";
import { ErrorIcon } from "../icons";
import { Link } from "react-router";
import { AuthContext } from "./AuthContext";

function NotVerified() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && user.verified === false && (
        <div className="flex z-[1] items-center gap-4 p-1 bg-red-600 sticky top-[80px] left-0 right-0 border-y-2 border-red-700 shadow-md">
          <div className="flex items-center text-white">
            <ErrorIcon />
            <p className="ml-2 text-lg font-roboto">Email Not Verified!!!</p>
          </div>
          <Link
            to="/verify" /* adjust as needed */
            className="ml-auto mr-5 wiggle bg-white text-red-600 px-4 py-1 rounded-xl font-medium hover:scale-110 active:scale-90 transition"
          >
            Verify Now
          </Link>
        </div>
      )}
    </>
  );
}

export default NotVerified;
