// Authentication/Auth.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser, loginUser, clearError } from "../Redux/authSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginImage from "../assets/login-banner.png";
import './Login.css';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'register' ? false : true;
  
  const { loading } = useSelector((state) => state.auth);
  
  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login state and errors
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: ""
  });
  
  // Register state and errors
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isDoctor: false
  });
  
  const [registerErrors, setRegisterErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[A-Za-z\s]+$/;

  // Update URL when mode changes
  const updateUrlMode = () => {
    const newMode = isLogin ? 'login' : 'register';
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    let isValid = true;

    if (!loginData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(loginData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!loginData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  // Validate register form
  const validateRegisterForm = () => {
    const errors = {};
    let isValid = true;

    // First name validation
    if (!registerData.firstname.trim()) {
      errors.firstname = "First name is required";
      isValid = false;
    } else if (registerData.firstname.length < 2) {
      errors.firstname = "First name must be at least 2 characters";
      isValid = false;
    } else if (!nameRegex.test(registerData.firstname)) {
      errors.firstname = "First name can only contain letters";
      isValid = false;
    }

    // Last name validation
    if (!registerData.lastname.trim()) {
      errors.lastname = "Last name is required";
      isValid = false;
    } else if (registerData.lastname.length < 2) {
      errors.lastname = "Last name must be at least 2 characters";
      isValid = false;
    } else if (!nameRegex.test(registerData.lastname)) {
      errors.lastname = "Last name can only contain letters";
      isValid = false;
    }

    // Email validation
    if (!registerData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(registerData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation
    if (!registerData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(registerData.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    } else if (registerData.phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
      isValid = false;
    }

    // Password validation
    if (!registerData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (registerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!passwordRegex.test(registerData.password)) {
      errors.password = "Password must contain uppercase, lowercase, number and special character";
      isValid = false;
    }

    // Confirm password validation
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setRegisterErrors(errors);
    return isValid;
  };

  // Handle login input change
  const handleLoginChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginErrors[field]) {
      setLoginErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle register input change
  const handleRegisterChange = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    if (registerErrors[field]) {
      setRegisterErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

// In your Auth.jsx submit handlers:

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  
  if (validateLoginForm()) {
    try {
      const result = await dispatch(loginUser({
        email: loginData.email,
        password: loginData.password
      })).unwrap();
      
      console.log("Login Result", result);
      
      // Show message from backend
      if (result.status === true && result.message) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Reset form
        setLoginData({ email: "", password: "", rememberMe: false });
        setLoginErrors({ email: "", password: "" });
        
        // Only navigate if we have access_token (user is authenticated)
        if (result.access_token) {
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
        
      } else if (result.status === false && result.message) {
        // Show error message from backend
        toast.error(result.message, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      // Check if error has status and message
      // if (error.status === false && error.message) {
      //   toast.error(error.message, {
      //     position: "top-right",
      //     autoClose: 2500,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //   });
      // } 
    }
  }
};

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  
  if (validateRegisterForm()) {
    try {
      const result = await dispatch(registerUser(registerData)).unwrap();
      
      console.log("Register Result", result);
      
      // Show message from backend
      if (result.status === true && result.message) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Reset form
        setRegisterData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          isDoctor: false
        });
        setRegisterErrors({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        });
        
        // Auto-switch to login after successful registration
        setTimeout(() => {
          setIsLogin(true);
        }, 1500);
        
      } else if (result.status === false && result.message) {
        // Show error message from backend
        toast.error(result.message, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
    } catch (error) {
      console.error("Registration failed:", error);
      // Check if error has status and message
      // if (error.status === false && error.message) {
      //   toast.error(error.message, {
      //     position: "top-right",
      //     autoClose: 2500,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //   });
      // }
    }
  }
};


  // Clear specific error on focus
  const handleInputFocus = (field, isLoginForm) => {
    if (isLoginForm) {
      if (loginErrors[field]) {
        setLoginErrors(prev => ({ ...prev, [field]: "" }));
      }
    } else {
      if (registerErrors[field]) {
        setRegisterErrors(prev => ({ ...prev, [field]: "" }));
      }
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    // Clear all errors when switching modes
    setLoginErrors({ email: "", password: "" });
    setRegisterErrors({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    });
    // Clear Redux error
    dispatch(clearError());
    // Update URL
    updateUrlMode();
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
            <h2>{isLogin ? "Login" : "Register"}</h2>
          </div>

          {isLogin ? (
            // Login Form
            <form onSubmit={handleLoginSubmit} noValidate>
              <div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`}
                    value={loginData.email}
                    onChange={(e) => handleLoginChange('email', e.target.value)}
                    onFocus={() => handleInputFocus('email', true)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  {loginErrors.email && (
                    <div className="error-message">{loginErrors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
                      value={loginData.password}
                      onChange={(e) => handleLoginChange('password', e.target.value)}
                      onFocus={() => handleInputFocus('password', true)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <div className="error-message">{loginErrors.password}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={(e) => handleLoginChange('rememberMe', e.target.checked)}
                      disabled={loading}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                  </div>
                  <div className="right-links">
                    <a
                      type="button" 
                      className="forgot-password"
                      onClick={() => alert("Forgot password functionality")}
                      disabled={loading}
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-signin"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Register Form
            <form onSubmit={handleRegisterSubmit} noValidate>
              <div>
                {/* First Name and Last Name in one row */}
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${registerErrors.firstname ? 'is-invalid' : ''}`}
                        value={registerData.firstname}
                        onChange={(e) => handleRegisterChange('firstname', e.target.value)}
                        onFocus={() => handleInputFocus('firstname', false)}
                        placeholder="First name"
                        required
                        disabled={loading}
                      />
                      {registerErrors.firstname && (
                        <div className="error-message">{registerErrors.firstname}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={`form-control ${registerErrors.lastname ? 'is-invalid' : ''}`}
                        value={registerData.lastname}
                        onChange={(e) => handleRegisterChange('lastname', e.target.value)}
                        onFocus={() => handleInputFocus('lastname', false)}
                        placeholder="Last name"
                        required
                        disabled={loading}
                      />
                      {registerErrors.lastname && (
                        <div className="error-message">{registerErrors.lastname}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${registerErrors.email ? 'is-invalid' : ''}`}
                    value={registerData.email}
                    onChange={(e) => handleRegisterChange('email', e.target.value)}
                    onFocus={() => handleInputFocus('email', false)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  {registerErrors.email && (
                    <div className="error-message">{registerErrors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${registerErrors.phone ? 'is-invalid' : ''}`}
                    value={registerData.phone}
                    onChange={(e) => handleRegisterChange('phone', e.target.value)}
                    onFocus={() => handleInputFocus('phone', false)}
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                  />
                  {registerErrors.phone && (
                    <div className="error-message">{registerErrors.phone}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${registerErrors.password ? 'is-invalid' : ''}`}
                      value={registerData.password}
                      onChange={(e) => handleRegisterChange('password', e.target.value)}
                      onFocus={() => handleInputFocus('password', false)}
                      placeholder="Create a strong password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <div className="error-message">{registerErrors.password}</div>
                  )}
                  <div className="password-hint">
                    Password must be at least 8 characters with uppercase, lowercase, number and special character
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${registerErrors.confresh_token ? 'is-invalid' : ''}`}
                      value={registerData.confirmPassword}
                      onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                      onFocus={() => handleInputFocus('confirmPassword', false)}
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                    />
                  </div>
                  {registerErrors.confirmPassword && (
                    <div className="error-message">{registerErrors.confirmPassword}</div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn-signup"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className={`${isLogin ? 'signup-link' : 'signin-link'} `}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              disabled={loading}
              style={{ 
                color: "#3b82f6", 
                fontWeight: 600, 
                cursor: loading ? "not-allowed" : "pointer",
                background: "none",
                border: "none",
                textDecoration: "underline",
                opacity: loading ? 0.6 : 1
              }}
            >
              {isLogin ? "Create Account" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}