import "./Home.css";
import { Heart, MapPin } from "lucide-react";
import AbhishekBansal from '../assets/Dr. Abhishek Bansal.png'
import SanjayRai from '../assets/Dr. Sanjay Rai.jpg'
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

const DoctorCard = ({ doctor }) => {

  const navigate = useNavigate();

  return (
    <div className="col-lg-3 col-md-6 mb-4">
<div className="doctor-card" onClick={() => navigate(`/doctor-profile/${doctor.id}`)}>
  <div className="doctor-image-wrapper">
    <img src={doctor.image} alt={doctor.name} className="doctor-image" />
    <div className="rating-badge">
      <span className="star">★</span> {doctor.rating}
    </div>
    <p className="consultation-fee">${doctor.fee}</p>
  </div>

  <div className="doctor-info">
    <div className="specialty-status">
      <span className="specialty">{doctor.specialty}</span>
      <span className="status-available">● Available</span>
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
          navigate('/booking')
          console.log('Book now clicked for:', doctor.name);
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



  const doctors = [
    {
      id: 1,
      name: "Dr. Sanjay Rai",
      specialty: "Hematology Oncology",
      rating: 5.0,
      location: "Minneapolis, MN",
      duration: "30 Min",
      fee: 650,
      image: SanjayRai,
    },
    {
      id: 2,
      name: " Dr. Abhishek Bansal",
      specialty: "Hematology Oncology",
      rating: 4.8,
      location: "Ogden, IA",
      duration: "60 Min",
      fee: 400,
      image: AbhishekBansal,
    },
    {
      id: 3,
      name: "Dr. Harold Bryant",
      specialty: "Neurologist",
      rating: 4.8,
      location: "Winona, MS",
      duration: "30 Min",
      fee: 500,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Dr. Sandra Jones",
      specialty: "Cardiologist",
      rating: 4.8,
      location: "Beckley, WV",
      duration: "30 Min",
      fee: 550,
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    },
  ];

  const handleViewAll = () => {
    console.log("Redirecting to all doctors page...");
  };

  return (
    <div className="featured-doctors-section">


      <div className="container">
        <div className="section-header">
          <div className="featured-badge">✦ Featured Doctors ✦</div>
          <h2 className="section-title">Our Highlighted Doctors</h2>
        </div>

        <div className="row">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="all-doctors">
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
