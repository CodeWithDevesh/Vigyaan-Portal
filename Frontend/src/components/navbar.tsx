import { useContext, useEffect, useState } from "react";
import logo from "../assets/Images/l.png";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import multiavatar from "@multiavatar/multiavatar/esm";
import { ProfileIcon, LogoutIcon } from "./icons";
import { AuthContext } from "./auth/AuthContext";
import { LayoutDashboard } from "lucide-react";
import pi from '@/assets/Images/profile.png'

function Navbar() {
  // const [token, setToken] = useState(localStorage.getItem("token"));
  const { user, logout } = useContext(AuthContext);
  const [profileIcon, setProfileIcon] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    //TODO: Fetch user data from backend and set profileIcon

    // For now, using dummy data
    // Replace with name later
    let svgCode = multiavatar(user.name);
    setProfileIcon(svgCode);
  }, [user]);

  const handleBackdropClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="h-[80px] grid grid-cols-3 z-2 bg-bg-1 items-center justify-items-center px-3 fixed top-0 left-0 right-0 text-2xl text-secondary font-bold font-poppins">
      <div className="justify-self-start">
        <img className="h-[60px]" src={logo} alt="" />
      </div>
      <div className="flex space-x-7 ml-7">
        <Link to={"/"} className="nav-item-cont ">
          <div className="nav-item rotate-3 text-xs lg:text-lg">Home</div>
        </Link>

        <Link to={"/projects"} className="nav-item-cont">
          <div className=" nav-item rotate-[-5deg] text-xs lg:text-lg">Projects</div>
        </Link>
      </div>

      {!user && (
        <>
        <Link
          to={"/login"}
          className="justify-self-end mr-4 bg-primary text-bg-1 py-1 px-[10px] rounded-2xl hover:scale-110 active:scale-90 transition-all text-xl hidden lg:block"
          style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .4)" }}
        >
          Sign In
        </Link>
        <Link 
        to={"/login"}
        className="justify-self-end block lg:hidden">
          <img src={pi} height={30} width={30} alt="profile" />
        </Link>
        </>
      )}
      {user && (
        <div className="relative justify-self-end">
          <button
            className=" mr-4 rounded-full hover:scale-110 active:scale-90 transition-all text-xl h-[40px] w-[40px]"
            style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .3)" }}
            onClick={() => setShowMenu(!showMenu)}
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          ></button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={handleBackdropClick}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/dashboard");
                  }}
                >
                  <LayoutDashboard size={20} color="#99a1af" />
                  Dashboard
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                >
                  <ProfileIcon />
                  Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
