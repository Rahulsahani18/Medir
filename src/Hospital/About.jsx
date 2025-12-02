import "./About.css";
import HospitalImage from "../assets/hospitalImage.jpg";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { FaCalendarAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa";

import Footer from "../Components/Footer";

const MedicalWebsite = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [counters, setCounters] = useState({
    recovered: 0,
    satisfaction: 0,
    medicalCenter: 0,
    successCase: 0,
    happyPatients: 0,
  });

  const countersRef = useRef(null);
  const [isCountersVisible, setIsCountersVisible] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Choose Your Doctor",
      description:
        "Browse through our expert doctors and select the right specialist for your needs",
      icon: <FaUserDoctor color="#6366f1" />,
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "Select Date & Time",
      description:
        "Pick a convenient appointment slot that fits your schedule perfectly",
      icon: <FaCalendarAlt color="#ec4899" />,
      color: "#ec4899",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "Fill Your Details",
      description:
        "Provide your medical history and reason for consultation securely",
      icon: <FaFileAlt color="#10b981" />,
      color: "#10b981",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: 4,
      title: "Get Confirmation",
      description:
        "Receive instant confirmation via email and SMS with appointment details",
      icon: <FaCheckCircle color="#f59e0b" />,
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
  ];

  // Intersection Observer for counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCountersVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => {
      if (countersRef.current) {
        observer.unobserve(countersRef.current);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (!isCountersVisible) return;

    const targetValues = {
      recovered: 275,
      satisfaction: 96,
      medicalCenter: 66,
      successCase: 93,
      happyPatients: 82,
    };

    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setCounters({
        recovered: Math.floor(targetValues.recovered * progress),
        satisfaction: Math.floor(targetValues.satisfaction * progress),
        medicalCenter: Math.floor(targetValues.medicalCenter * progress),
        successCase: Math.floor(targetValues.successCase * progress),
        happyPatients: Math.floor(targetValues.happyPatients * progress),
      });

      if (frame === totalFrames) {
        clearInterval(counter);
        // Set final values
        setCounters(targetValues);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isCountersVisible]);

  return (
    <>
      {/* New Banner Section */}
      <div className="container-fluid medical-banner">
        <div className="banner-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="banner-contents">
                  <div className="banner-badge">WELCOME TO OUR HOSPITAL</div>
                  <h1 className="banner-main-title">
                    Better Care <span className="highlight">For Your</span>{" "}
                    Health
                  </h1>
                  <div className="banner-description">
                    <p>
                      We believe that healthcare should be more than just a
                      service. It should be a <em>compassionate</em> and
                      <em> collaborative</em> journey towards wellness.
                    </p>
                  </div>
                  <div className="banner-actions">
                    <Link
                      to="/all-doctors"
                      className="btn btn-primary banner-btn"
                    >
                      <span>FIND A DOCTOR</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 5L12.5 10L7.5 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                    <Link
                      to="/book-appointment"
                      className="btn btn-outline-secondary banner-btn"
                    >
                      <span>BOOK APPOINTMENT</span>
                    </Link>
                  </div>
                  {/* <div className="banner-features">
                    <div className="feature-item">
                      <div className="feature-icon">🏥</div>
                      <span>24/7 Emergency</span>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">👨‍⚕️</div>
                      <span>Expert Doctors</span>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">💯</div>
                      <span>Quality Care</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="medical-website">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <p className="welcome-text">WELCOME </p>
                <h1 className="hero-title">
                  Your Journey to Better Health Starts Here
                </h1>

                <div className="hero-content mt-4">
                  <p className="hero-description">
                    Experience a seamless way to manage your healthcare. With
                    our online doctor appointment booking service, you can
                    easily explore specialists, view real-time availability, and
                    schedule appointments at your convenience. Enjoy a smooth,
                    secure, and time-saving process designed to give you more
                    control over your health.
                  </p>
                  <Link
                    to="/book-appointment"
                    className="btn btn-primary learn-more-btn"
                  >
                    Book An Appointment
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="ms-2"
                    >
                      <path
                        d="M8 3L13 8L8 13M13 8H3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className="video-card">
                  <img
                    src={HospitalImage}
                    alt="Medical Staff"
                    className="video-thumbnail"
                  />
                </div>

                <div className="stats-container">
                  <div className="stat-box">
                    <h2 className="stat-number">
                      <span className="stat-unit">1000</span>
                    </h2>
                    <p className="stat-label">Recovered Patients</p>
                  </div>
                  <div className="stat-box">
                    <h2 className="stat-number">
                      <span className="stat-unit">99%</span>
                    </h2>
                    <p className="stat-label">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Steps Section */}
        <div className="booking-container">
          <div className="container">
            <h1 className="main-title">Book Your Appointment Online</h1>
            <p className="main-subtitle">
              Simple, Fast & Secure - Get started in 4 easy steps
            </p>

            <div className="row g-4 steps-row">
              {steps.map((step) => (
                <div key={step.id} className="col-12 col-md-6 col-lg-3">
                  <div
                    className={`step-card ${
                      activeStep === step.id ? "active" : ""
                    }`}
                    style={{
                      "--gradient": step.gradient,
                      "--color": step.color,
                    }}
                    onMouseEnter={() => setActiveStep(step.id)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    <div className="step-card-content">
                      <div className="step-number">{step.id}</div>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                      <div className="step-icon">{step.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-section">
              <Link to="/book-appointment" className="book-now-btn">
                Start Booking Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Success Cases Section */}
        <section className="success-section" ref={countersRef}>
          <div className="container-fluid">
            <div className="row g-0">
              <div className="col-lg-4 col-md-6">
                <div className="success-card ps-0">
                  <div className="circle-progress">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#e6e9ee"
                        strokeWidth="8"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#121618"
                        strokeWidth="8"
                        strokeDasharray="377" // Circumference: 2 * π * r = 2 * 3.14 * 60 ≈ 377
                        strokeDashoffset={
                          377 - (counters.medicalCenter / 100) * 377
                        } // Dynamic offset
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                      <text
                        x="70"
                        y="75"
                        textAnchor="middle"
                        stroke="#1a1f2e"
                        fontSize="28"
                        fontWeight="600"
                      >
                        {counters.medicalCenter}%
                      </text>
                    </svg>
                  </div>
                  <div className="success-content">
                    <h3 className="success-title">Medical Center</h3>
                    <p className="success-description">
                      We work closely with each patient to develop healthcare
                      plans.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="success-card">
                  <div className="circle-progress">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#e6e9ee"
                        strokeWidth="8"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#121618"
                        strokeWidth="8"
                        strokeDasharray="377"
                        strokeDashoffset={
                          377 - (counters.successCase / 100) * 377
                        } // Dynamic offset
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                      <text
                        x="70"
                        y="75"
                        textAnchor="middle"
                        stroke="#1a1f2e"
                        fontSize="28"
                        fontWeight="600"
                      >
                        {counters.successCase}%
                      </text>
                    </svg>
                  </div>
                  <div className="success-content">
                    <h3 className="success-title">Success Case</h3>
                    <p className="success-description">
                      We work closely with each patient to develop healthcare
                      plans.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="success-card pe-0 border-end-0">
                  <div className="circle-progress">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#e6e9ee"
                        strokeWidth="8"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#121618"
                        strokeWidth="8"
                        strokeDasharray="377"
                        strokeDashoffset={
                          377 - (counters.happyPatients / 100) * 377
                        } // Dynamic offset
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                      <text
                        x="70"
                        y="75"
                        textAnchor="middle"
                        stroke="#1a1f2e"
                        fontSize="28"
                        fontWeight="600"
                      >
                        {counters.happyPatients}%
                      </text>
                    </svg>
                  </div>
                  <div className="success-content">
                    <h3 className="success-title">Happy Patients</h3>
                    <p className="success-description">
                      We work closely with each patient to develop healthcare
                      plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default MedicalWebsite;
