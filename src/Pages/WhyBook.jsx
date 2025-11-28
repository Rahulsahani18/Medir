import { useState } from "react";
import { Video, Award, FileText } from "lucide-react";

const WhyBook = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const reasons = [
    {
      icon: <Video size={24} />,
      title: "Follow-Up Care",
      description:
        "We ensure continuity of care through regular follow-ups and communication, helping you stay on track with health goals.",
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
    },
    {
      icon: <Award size={24} />,
      title: "Patient-Centered Approach",
      description:
        "We prioritize your comfort and preferences, tailoring our services to meet your individual needs and Care from Our Experts.",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      icon: <FileText size={24} />,
      title: "Convenient Access",
      description:
        "Easily book appointments online or through our dedicated customer service team, with flexible hours to fit your schedule.",
      iconBg: "#CFFAFE",
      iconColor: "#0891B2",
    },
  ];

  return (
    <>
      <div
        style={{
          //   backgroundColor: '#F9FAFB',
          padding: "50px 20px 25px",
          //   minHeight: '100vh',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="container"
          style={{
            // maxWidth: '1200px',
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Header Section */}
          <div className="section-header">
            <div className="featured-badge">✦ Why Book With Us ✦</div>
            <h2 className="section-title">Compelling Reasons to Choose</h2>
          </div>

          {/* Cards Container */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              alignItems: "stretch",
              marginBottom: "10px",
            }}
          >
            {reasons.map((reason, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "2rem",
                  // boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  display: "flex",
                  borderLeft: "1px dashed rgb(227, 230, 236)",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    height: "100%",
                  }}
                >
                  {/* Icon Container - Left Side */}
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "12px",
                      backgroundColor: reason.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ color: reason.iconColor }}>{reason.icon}</div>
                  </div>

                  {/* Content - Right Side */}
                  <div style={{ flex: 1 }}>
                    {/* Title */}
                    <h3
                      style={{
                        color: "#111827",
                        fontSize: "1.125rem",
                        fontWeight: "700",
                        lineHeight: "1.3",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {reason.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        color: "#6B7280",
                        lineHeight: "1.6",
                        fontSize: "0.9rem",
                        margin: 0,
                      }}
                    >
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container">
        <div className="row mb-5 g-4">
          <div className="col-lg-3 col-md-6">
            <div className="whyBookFeature">
              <div className="whyBookFeatureIcon whyBookIconBlue">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="whyBookFeatureTitle">Search For Doctors</h4>
              <p className="whyBookFeatureDesc">
                Find qualified doctors based on specialization, location, or
                availability for your medical needs.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="whyBookFeature">
              <div className="whyBookFeatureIcon whyBookIconOrange">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <h4 className="whyBookFeatureTitle">Check Doctor Profile</h4>
              <p className="whyBookFeatureDesc">
                Explore detailed doctor profiles with credentials, experience,
                ratings, and patient reviews.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="whyBookFeature">
              <div className="whyBookFeatureIcon whyBookIconCyan">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h4 className="whyBookFeatureTitle">Schedule Appointment</h4>
              <p className="whyBookFeatureDesc">
                Choose your preferred doctor, select a convenient time slot, and
                confirm your booking instantly online.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="whyBookFeature">
              <div className="whyBookFeatureIcon whyBookIconPurple">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h4 className="whyBookFeatureTitle">Get Digital Prescription</h4>
              <p className="whyBookFeatureDesc">
                Receive secure digital prescriptions after consultation and
                access your medical records anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="whyBookSect">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Side - Images */}
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="whyBookImages">
                <div className="whyBookMainImg mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop"
                    alt="Healthcare professionals with family"
                    className="img-fluid  whyBookImg"
                  />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
                      alt="Doctor with patient"
                      className="img-fluid  whyBookImg"
                    />
                  </div>
                  <div className="col-6">
                    <img
                      src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop"
                      alt="Medical supplies"
                      className="img-fluid  whyBookImg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="col-lg-7">
              <div className="whyBookContent">
                <span className="whyBookBadge">✦ Why Book With Us ✦</span>
                <h2 className="whyBookTitle">
                  Experience seamless healthcare with our
                  <span className="whyBookHighlight"> online appointment </span>
                  booking system.
                </h2>
                <p className="whyBookDesc">
                  As a leading digital healthcare platform, we simplify your
                  medical journey with instant appointment scheduling, verified
                  doctor profiles, and secure prescription management. Book
                  consultations anytime, anywhere with just a few clicks.
                </p>

                {/* Accordion */}
                <div className="whyBookAccordion">
                  <div className="whyBookAccordionItem">
                    <button
                      className={`whyBookAccordionBtn ${
                        openAccordion === 1 ? "active" : ""
                      }`}
                      onClick={() => toggleAccordion(1)}
                    >
                      <span>01. Our Vision</span>
                      <span className="whyBookAccordionIcon">
                        {openAccordion === 1 ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`whyBookAccordionContent ${
                        openAccordion === 1 ? "show" : ""
                      }`}
                    >
                      <p>
                        To revolutionize healthcare accessibility by connecting
                        patients with qualified doctors through our innovative
                        online platform, making quality medical care available
                        to everyone, everywhere.
                      </p>
                    </div>
                  </div>

                  <div className="whyBookAccordionItem">
                    <button
                      className={`whyBookAccordionBtn ${
                        openAccordion === 2 ? "active" : ""
                      }`}
                      onClick={() => toggleAccordion(2)}
                    >
                      <span>02. Our Mission</span>
                      <span className="whyBookAccordionIcon">
                        {openAccordion === 2 ? "−" : "+"}
                      </span>
                    </button>
                    <div
                      className={`whyBookAccordionContent ${
                        openAccordion === 2 ? "show" : ""
                      }`}
                    >
                      <p>
                        To provide a seamless, secure, and user-friendly
                        platform that empowers patients to take control of their
                        health by offering instant appointment booking, digital
                        prescriptions, and 24/7 access to healthcare
                        professionals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyBook;
