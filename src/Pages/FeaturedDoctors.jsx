import "./Home.css";
import { MapPin } from "lucide-react";
import AbhishekBansal from "../assets/Dr. Abhishek Bansal.png";
import SanjayRai from "../assets/Dr. Sanjay Rai.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className="doctor-card"
        onClick={() => navigate('/doctor-profile',{
          state: {doctor}
        })}
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
          {/* <p className="consultation-fee">${doctor.fee}</p> */}
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
                  navigate('/doctor-profile',{
                    state: {doctor}
                  });
                }}
              >
                View Profile
              </button>
            </div>
            <button
              className="btn-book"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/booking",{
                  state: {doctor}
                });
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
          <div className="featured-badge">✦ Featured Doctors ✦</div>
          <h2 className="section-title">Our Highlighted Doctors</h2>
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

export default FeaturedDoctors;
