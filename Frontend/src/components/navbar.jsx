import React from "react";
import logo from "../assets/Images/l.png";
import { Link } from "react-router";

function Navbar() {
  return (
    <div className="h-[80px] grid grid-cols-3 items-center justify-items-center px-3 fixed top-0 left-0 right-0 text-2xl font-bold">
      <div className="justify-self-start">
        <img className="h-[60px]" src={logo} alt="" />
      </div>
      <div className="flex space-x-7 ml-7">
        <div className="nav-item-cont">
          <Link to={"/"} className="nav-item rotate-3">
            Home
          </Link>
        </div>

        <div className="nav-item-cont">
          <Link to={"/projects"} className="nav-item rotate-[-5deg]">
            Projects
          </Link>
        </div>
      </div>

      <div className="justify-self-end mr-4 text-primary bg-bg-1 py-1 px-[10px] rounded-[4px] hover:scale-110 active:scale-90 transition-all" style={{boxShadow: "4px 5px 5px rgba(0, 0, 0, .5)"}}>
        <Link to={"/login"}>Log In</Link>
      </div>
    </div>
  );
}

export default Navbar;
