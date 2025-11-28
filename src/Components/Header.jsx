import "./Header.css";
import {
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaSearch,
  FaUserPlus,
  FaSignInAlt,
  FaCog,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header>
      {/* Top Bar */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "4px" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex gap-4">
              <div className="d-flex align-items-center gap-2">
                <FaEnvelope style={{ color: "#41c0d6" }} />
                <span style={{ fontSize: "14px", color: "#6c757d" }}>
                  info@example.com
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaPhone style={{ color: "#41c0d6" }} />
                <span style={{ fontSize: "14px", color: "#6c757d" }}>
                  +1 66589 14556
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <FaCog
                style={{
                  color: "#6c757d",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              />
              <div className="d-flex align-items-center gap-2">
                <img
                  src="https://flagcdn.com/w40/us.png"
                  alt="US Flag"
                  style={{ width: "20px", height: "14px" }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    cursor: "pointer",
                  }}
                >
                  USD
                </span>
              </div>
              <div className="d-flex gap-2">
                <FaFacebookF
                  style={{
                    color: "#6c757d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
                <FaTwitter
                  style={{
                    color: "#6c757d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
                <FaInstagram
                  style={{
                    color: "#6c757d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
                <FaLinkedinIn
                  style={{
                    color: "#6c757d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
                <FaPinterestP
                  style={{
                    color: "#6c757d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container d-flex align-items-center">
          {/* Logo */}

          <img
            className="Logo me-5"
            src={Logo}
            alt="Logo"
            style={{ height: "50px", cursor: "pointer" }}
            onClick={(e) =>
            {
              e.stopPropagation();
                 navigate("/")}
            }
           
          />

          {/* Right Side Icons + Buttons */}
          <div className="d-flex align-items-center gap-4 ms-auto">
            {/* Search Icon */}
            <FaSearch
              style={{ color: "#6c757d", cursor: "pointer", fontSize: "20px" }}
            />

            {/* Custom Styled Buttons */}
            <button className="custom-btn custom-btn-primary fw-normal d-flex align-items-center gap-2 px-3 py-2">
              <FaUserPlus />
              Sign Up
            </button>

            <button className="custom-btn custom-btn-dark fw-normal d-flex align-items-center gap-2 px-3 py-2">
              <FaSignInAlt />
              Register
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
