import React from "react";
import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.webp"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <div
        className={isMenuOpen ? "underlay" : "underlay close"}
        onClick={toggleMenu}
      ></div>
      <header className="nav-header">
        <div className="logo">
          <img src={logo} alt="" className="h-20 object-center object-contain"/>
        </div>
        <nav>
          <ul>
            <li>
              <Link className="hover-effect" to="/">
                Home
              </Link>
            </li>
            <li className="resources">
              <Link className="hover-effect" to="/resources">
                Resources
              </Link>
            </li>
            <li>
              <Link className="hover-effect" to="/aboutus">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover-effect" to="/contribute">
                Contribute
              </Link>
            </li>
          </ul>
          <div
            className={isMenuOpen ? "hamburger" : "hamburger close"}
            onClick={toggleMenu}
          >
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 18L20 18"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12L20 12"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 6L20 6"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </nav>
        <div
          className={isMenuOpen ? "hamburger-cont" : "hamburger-cont close"}
          onClick={toggleMenu}
        >
          <HamburgerMenu />
        </div>
      </header>
    </>
  );
}

function HamburgerMenu() {
  const navigate = useNavigate();
  return (
    <>
      <ul>
        <li onClick={() => navigate("/")}>Home</li>
        <li className="resources" onClick={() => navigate("/resources")}>
          Resources
        </li>
        <li onClick={() => navigate("/aboutus")}>About Us</li>
        <li onClick={() => navigate("/contribute")}>Contribute</li>
      </ul>
    </>
  );
}
