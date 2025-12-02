import {
  FaUserMd,
  FaBone,
  FaHeartbeat,
  FaTooth,
  FaBrain,
  FaBaby,
  FaPaw,
  FaUserNurse,
  FaArrowRight,
  FaUsers,
  FaAward,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import "../Pages/Home.css";
import { MapPin } from "lucide-react";
import AbhishekBansal from "../assets/Dr. Abhishek Bansal.png";
import RightHeroImage from '../assets/Mask-Group-7-1.png'
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from '../Components/Footer';

// DoctorCard component from your shared code
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className="doctor-card"
        onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
      >
        <div className="doctor-image-wrapper">
          <img
            src={doctor.image || AbhishekBansal}
            alt={doctor.name}
            className="doctor-image"
            onError={(e) => {
              e.target.src = AbhishekBansal;
            }}
          />
          <div className="rating-badge">
            <span className="star">★</span> {doctor.rating || 4.8}
          </div>
          <p className="consultation-fee">${doctor.fee}</p>
        </div>

        <div className="doctor-info">
          <div className="specialty-status">
            <span className="specialty">{doctor.specialty}</span>
            {doctor.availableToday ? (
              <span className="status-available">● Available</span>
            ) : (
              <span className="status-unavailable">● Unavailable</span>
            )}
          </div>

          <h5 className="doctor-name">{doctor.name}</h5>

          <div className="doctor-details">
            <MapPin size={14} className="icon" />
            <span>{doctor.location}</span>
          </div>

          <div className="doctor-footer">
            <div>
              <button
                className="View-Profile-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/doctor-profile/${doctor.id}`);
                }}
              >
                View Profile
              </button>
            </div>
            <button
              className="btn-book"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/booking");
                console.log("Book now clicked for:", doctor.name);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FeaturedDoctors component from your shared code
const FeaturedDoctors = () => {
  const navigate = useNavigate();

  // Get doctors data from Redux store - access the nested doctors array
  const doctorsState = useSelector((state) => state.doctors);

  // Get first 4 doctors from the nested structure
  const featuredDoctors = doctorsState.doctors?.doctors?.slice(0, 4) || [];
  console.log("doctorsState Data", doctorsState);

  const handleViewAll = () => {
    console.log("Redirecting to all doctors page...");
  };

  // Show loading state if data is being fetched
  if (doctorsState.loading) {
    return (
      <div className="featured-doctors-section">
        <div className="container">
          <div className="section-header">
            <div className="featured-badge">✦ Featured Doctors ✦</div>
            <h2 className="section-title">Our Highlighted Doctors</h2>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading featured doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (doctorsState.error) {
    return (
      <div className="featured-doctors-section">
        <div className="container">
          <div className="section-header">
            <div className="featured-badge">✦ Featured Doctors ✦</div>
            <h2 className="section-title">Our Highlighted Doctors</h2>
          </div>
          <div className="alert alert-warning text-center" role="alert">
            Error loading doctors: {doctorsState.error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-doctors-section">
      <div className="container">
        <div className="section-header">
          <div className="featured-badge">✦ Best Doctor ✦</div>
          <h2 className="section-title">Book Our Best Doctor</h2>
          <p className="section-subtitle">Meet our experts & book online</p>
        </div>

        <div className="row">
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/all-doctors">
            <button className="btn-view-all" onClick={handleViewAll}>
              View All Doctors →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const HealthcarePage = () => {
  const specialties = [
    { name: "Urology", doctors: 21, icon: FaUserMd, color: "#00A8E8" },
    { name: "Orthopedic", doctors: 30, icon: FaBone, color: "#00B4D8" },
    { name: "Cardiologist", doctors: 15, icon: FaHeartbeat, color: "#0096C7" },
    { name: "Dentist", doctors: 35, icon: FaTooth, color: "#00A8E8" },
    { name: "Neurology", doctors: 25, icon: FaBrain, color: "#00B4D8" },
    { name: "Pediatrist", doctors: 10, icon: FaBaby, color: "#0096C7" },
    { name: "Veterinary", doctors: 20, icon: FaPaw, color: "#00A8E8" },
    { name: "Psychiatrist", doctors: 12, icon: FaUserNurse, color: "#00B4D8" },
  ];

  const stats = [
    { icon: FaUsers, value: "500+", label: "Expert Doctors", color: "#00A8E8" },
    { icon: FaAward, value: "25+", label: "Specialties", color: "#00B4D8" },
    {
      icon: FaCalendarAlt,
      value: "10k+",
      label: "Happy Patients",
      color: "#0096C7",
    },
    { icon: FaClock, value: "24/7", label: "Emergency Care", color: "#48CAE4" },
  ];

  return (
    <>
      <style>
        {`
          .HealthCarePage {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow-x: hidden;
          }

          .HealthCareHeroSect {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 80px 0 37px;
            position: relative;
            overflow: hidden;
          }

          .HealthCareHeroSect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }

          .HealthCareHeroContent {
            position: relative;
            z-index: 2;
          }

          .HealthCareHeroTitle {
            font-size: 3.5rem;
            font-weight: 800;
            color: #ffffff;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }

          .HealthCareHeroSubtitle {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.95);
            margin-bottom: 40px;
            line-height: 1.6;
          }

          .HealthCareHeroImage {
            width: 100%;
            max-width: 450px;
            height: 450px;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            border: 3px solid rgba(255,255,255,0.3);
          }

          .HealthCareHeroImageIcon {
            font-size: 200px;
            color: rgba(255,255,255,0.9);
          }

          .HealthCareStatsSect {
            padding: 60px 0;
            background: #ffffff;
          }

          .HealthCareStatCard {
            text-align: center;
            padding: 30px 20px;
            transition: transform 0.3s ease;
            border: 1px solid #e6e8ee;
            border-radius: 10px;
            
          }

          .HealthCareStatCard:hover {
            transform: translateY(-10px);
          }

          .HealthCareStatIcon {
            font-size: 3rem;
            margin-bottom: 15px;
            display: inline-block;
          }

          .HealthCareStatValue {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .HealthCareStatLabel {
            font-size: 1rem;
            color: #7f8c8d;
            font-weight: 500;
          }

          .HealthCareSpecialtiesSect {
            padding: 80px 0;
            background: linear-gradient(135deg, #00A8E8 0%, #00B4D8 50%, #48CAE4 100%);
            position: relative;
          }

          .HealthCareSpecialtiesSect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 0.5;
          }

          .HealthCareSectionTitle {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 15px;
            color: #ffffff;
            position: relative;
            z-index: 2;
          }

          .HealthCareSectionSubtitle {
            text-align: center;
            font-size: 1.1rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 50px;
            position: relative;
            z-index: 2;
          }

          .HealthCareSpecialtyCard {
            background: #ffffff;
            border-radius: 20px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            z-index: 2;
          }

          .HealthCareSpecialtyCard:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          }

          .HealthCareSpecialtyCardInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .HealthCareSpecialtyCardLeft {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .HealthCareSpecialtyIcon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #ffffff;
            flex-shrink: 0;
          }

          .HealthCareSpecialtyInfo h3 {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
          }

          .HealthCareSpecialtyInfo p {
            font-size: 0.95rem;
            color: #7f8c8d;
            margin: 0;
          }

          .HealthCareSpecialtyArrow {
            font-size: 1.2rem;
            color: #95a5a6;
            transition: all 0.3s ease;
          }

          .HealthCareSpecialtyCard:hover .HealthCareSpecialtyArrow {
            color: #00A8E8;
            transform: translateX(5px);
          }

          .HealthCareBenefitsSect {
            padding: 80px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
          }

          .HealthCareBenefitsSect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.3;
          }

          .HealthCareBenefitCard {
            background: rgba(255,255,255,0.95);
            border-radius: 20px;
            padding: 40px 30px;
            margin-bottom: 25px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
            backdrop-filter: blur(10px);
          }

          .HealthCareBenefitCard:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            background: #ffffff;
          }

          .HealthCareBenefitIcon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          }

          .HealthCareBenefitIcon svg {
            font-size: 2.5rem;
            color: #ffffff;
          }

          .HealthCareBenefitCard h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
          }

          .HealthCareBenefitCard p {
            color: #7f8c8d;
            line-height: 1.6;
            margin: 0;
          }

          @media (max-width: 991px) {
            .HealthCareHeroTitle {
              font-size: 2.5rem;
            }

            .HealthCareHeroImage {
              max-width: 350px;
              height: 350px;
              margin-top: 40px;
            }

            .HealthCareHeroImageIcon {
              font-size: 150px;
            }
          }

          @media (max-width: 767px) {
            .HealthCareHeroTitle {
              font-size: 2rem;
            }

            .HealthCareSectionTitle {
              font-size: 2rem;
            }

            .HealthCareHeroImage {
              max-width: 280px;
              height: 280px;
            }

            .HealthCareHeroImageIcon {
              font-size: 120px;
            }

            .HealthCareSpecialtyCard {
              padding: 20px;
            }

            .HealthCareSpecialtyCardLeft {
              gap: 15px;
            }

            .HealthCareSpecialtyIcon {
              width: 55px;
              height: 55px;
              font-size: 1.5rem;
            }

            .HealthCareSpecialtyInfo h3 {
              font-size: 1.1rem;
            }
          }

          @media (max-width: 575px) {
            .HealthCareHeroSect,
            .HealthCareSpecialtiesSect,
            .HealthCareBenefitsSect {
              padding: 50px 0;
            }

            .HealthCareStatCard {
              padding: 20px 10px;
            }

            .HealthCareStatIcon {
              font-size: 2.5rem;
            }

            .HealthCareStatValue {
              font-size: 2rem;
            }
          }
        `}
      </style>

      <div className="HealthCarePage">
        {/* Hero Section */}
        <section className="HealthCareHeroSect">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="HealthCareHeroContent">
                  <h1 className="HealthCareHeroTitle">
                    Find The Best Healthcare Services
                  </h1>
                  <p className="HealthCareHeroSubtitle">
                    Access to expert physicians and surgeons, advanced
                    technologies and top-quality surgery facilities right here.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="HealthCareHeroImage">
                 <img src={RightHeroImage} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="HealthCareStatsSect">
          <div className="container">
            <div className="row">
              {stats.map((stat, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="HealthCareStatCard">
                    <stat.icon
                      className="HealthCareStatIcon"
                      style={{ color: stat.color }}
                    />
                    <div className="HealthCareStatValue">{stat.value}</div>
                    <div className="HealthCareStatLabel">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Specialities Section */}
        <section className="HealthCareSpecialtiesSect">
          <div className="container">
            <h2 className="HealthCareSectionTitle">Browse by Specialities</h2>
            <p className="HealthCareSectionSubtitle">
              Find experienced doctors across all specialties
            </p>

            <div className="row">
              {specialties.map((specialty, index) => (
                <div key={index} className="col-lg-3 col-md-6 col-12">
                  <div className="HealthCareSpecialtyCard">
                    <div className="HealthCareSpecialtyCardInner">
                      <div className="HealthCareSpecialtyCardLeft">
                        <div
                          className="HealthCareSpecialtyIcon"
                          style={{
                            background: `linear-gradient(135deg, ${specialty.color} 0%, #48CAE4 100%)`,
                          }}
                        >
                          <specialty.icon />
                        </div>
                        <div className="HealthCareSpecialtyInfo">
                          <h3>{specialty.name}</h3>
                          <p>Doctors</p>
                        </div>
                      </div>
                      <FaArrowRight className="HealthCareSpecialtyArrow" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Doctors Section (Replaced Clinic & Specialities) */}
        <FeaturedDoctors />

        {/* Why Choose Us Section */}
        <section className="HealthCareBenefitsSect">
          <div className="container">
            <h2 className="HealthCareSectionTitle">Why Choose Us</h2>
            <p className="HealthCareSectionSubtitle">
              Comprehensive healthcare solutions tailored to your needs
            </p>

            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="HealthCareBenefitCard">
                  <div className="HealthCareBenefitIcon">
                    <FaUserMd />
                  </div>
                  <h3>Expert Doctors</h3>
                  <p>
                    Highly qualified and experienced medical professionals
                    dedicated to your health and wellbeing.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="HealthCareBenefitCard">
                  <div className="HealthCareBenefitIcon">
                    <FaAward />
                  </div>
                  <h3>Modern Facilities</h3>
                  <p>
                    State-of-the-art medical equipment and comfortable treatment
                    environments for the best care.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="HealthCareBenefitCard">
                  <div className="HealthCareBenefitIcon">
                    <FaClock />
                  </div>
                  <h3>24/7 Support</h3>
                  <p>
                    Round-the-clock emergency services and patient support
                    whenever you need assistance.
                  </p>
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

export default HealthcarePage;