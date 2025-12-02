import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoginImage from "../assets/login-banner.png";
import './Login.css'
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    isDoctor: false
  });

  const handleSubmit = () => {
    console.log("Register submitted", formData);
    alert("Registration functionality would be implemented here");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="login-container">
     

      <div className="login-wrapper">
        <div className="left-section">
          <div className="illustration-placeholder">
            <img
              src={LoginImage}
              alt="Medical illustration"
              className="illustration"
            />
          </div>
        </div>

        <div className="right-section">
          <div className="login-header">
            <h2>Patient Register</h2>
            {/* <div className="doctor-toggle">
              <span>Are you a Doctor?</span>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={formData.isDoctor}
                  onChange={(e) => handleInputChange('isDoctor', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div> */}
          </div>

          <div>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-signup">
              Sign Up
            </button>
          </div>

          {/* <div className="divider">
            <span>or</span>
          </div> */}

          {/* <div className="social-login">
            <button className="btn-social btn-google">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in With Google
            </button>
            <button className="btn-social btn-facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Sign in With Facebook
            </button>
          </div> */}

          <div className="signin-link">
            Already have account?{" "}
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}