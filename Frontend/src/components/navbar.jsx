import { useEffect, useState } from "react";
import logo from "../assets/Images/l.png";
import { Link } from "react-router";
import pi from "../assets/Images/profile.png";
import { useNavigate } from "react-router";
import multiavatar from "@multiavatar/multiavatar/esm";

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profileIcon, setProfileIcon] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return;
    }

    let svgCode = multiavatar('Binx Bond');
    console.log(svgCode);
    setProfileIcon(svgCode);

    //TODO: Fetch user data from backend and set profileIcon
  }, [token]);

  return (
    <div className="h-[80px] grid grid-cols-3 items-center justify-items-center px-3 fixed top-0 left-0 right-0 text-2xl text-secondary font-bold font-poppins">
      <div className="justify-self-start">
        <img className="h-[60px]" src={logo} alt="" />
      </div>
      <div className="flex space-x-7 ml-7">
        <Link to={"/"} className="nav-item-cont ">
          <div className="nav-item rotate-3">Home</div>
        </Link>

        <Link to={"/projects"} className="nav-item-cont">
          <div className=" nav-item rotate-[-5deg]">Projects</div>
        </Link>
      </div>

      {!token && (
        <Link
          to={"/login"}
          className="justify-self-end mr-4 bg-bg-1 py-1 px-[10px] rounded-2xl hover:scale-110 active:scale-90 transition-all text-xl"
          style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .3)" }}
        >
          Sign In
        </Link>
      )}
      {token && (
        <div className="relative justify-self-end">
          <button
            className=" mr-4 rounded-full hover:scale-110 active:scale-90 transition-all text-xl h-[40px] w-[40px]"
            style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .3)" }}
            onClick={() => setShowMenu(!showMenu)}
            dangerouslySetInnerHTML={{ __html: profileIcon }}
          >
            {/* <img className="inline-block h-[40px]" src={profileIcon} alt="" /> */}
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0"
                onClick={() => {
                  setShowMenu(false);
                }}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setToken(null);
                    window.location.href = "/";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {/* {token && (
        <Link
        to={"/profile"}
        className="justify-self-end mr-4 rounded-full hover:scale-110 active:scale-90 transition-all text-xl"
          style={{ boxShadow: "4px 5px 5px rgba(0, 0, 0, .3)" }}
        >
          <img className="inline-block h-[40px]" src={profileIcon} alt="" />
        </Link>
      )} */}
    </div>
  );
}

export default Navbar;
