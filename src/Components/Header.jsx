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
  FaUserCircle,
  FaCaretDown,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = (e) => {
    e.stopPropagation();
    navigate("/auth?mode=login");
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    navigate("/auth?mode=register");
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user's first name or email for display
  const getUserDisplayName = () => {
    if (user?.firstname) {
      return user.firstname;
    } else if (user?.email) {
      return user.email.split('@')[0]; // Get part before @
    }
    return "User";
  };

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
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
          />

          {/* Right Side Icons + Buttons */}
          <div className="d-flex align-items-center gap-4 ms-auto">
            {/* Search Icon */}
            <FaSearch
              style={{ color: "#6c757d", cursor: "pointer", fontSize: "20px" }}
            />

            {isAuthenticated ? (
              // User dropdown when logged in
              <div className="position-relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent"
                  style={{ cursor: "pointer" }}
                >
                  <FaUserCircle
                    style={{ color: "#41c0d6", fontSize: "24px" }}
                  />
                  <span
                    style={{
                      color: "#333",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {getUserDisplayName()}
                  </span>
                  <FaCaretDown
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      transition: "transform 0.3s",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="dropdown-menu show position-absolute end-0 mt-2"
                    style={{
                      minWidth: "200px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      zIndex: 1000,
                    }}
                  >
                    <div className="dropdown-header px-3 py-2 border-bottom">
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        Signed in as
                      </div>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>
                        {user?.email || "User"}
                      </div>
                    </div>
                    
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
                      onClick={handleProfileClick}
                    >
                      <FaUserCircle style={{ color: "#6c757d", fontSize: "16px" }} />
                      <span>My Profile</span>
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 text-danger"
                      onClick={handleLogout}
                    >
                      <FaSignInAlt style={{ fontSize: "16px" }} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register buttons when not logged in
              <>
                <button
                  onClick={handleLoginClick}
                  className="custom-btn custom-btn-primary fw-normal d-flex align-items-center gap-2 px-3 py-2"
                >
                  <FaUserPlus />
                  Login
                </button>

                <button
                  onClick={handleRegisterClick}
                  className="custom-btn custom-btn-dark fw-normal d-flex align-items-center gap-2 px-3 py-2"
                >
                  <FaSignInAlt />
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}