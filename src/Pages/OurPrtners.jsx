import "./Home.css";
import { Heart, MapPin, Clock } from "lucide-react";
import React, { useRef } from 'react';
import {
  FaStar,
  FaCalendarCheck,

  FaHeartbeat,
} from "react-icons/fa";
import {
  FaHeart,
  FaBrain,
  FaBaby,
  FaUserMd,
  FaClinicMedical,
  FaCommentMedical,
  FaPills,
  FaFlask,
  FaHome,
  FaHospital,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import DOH from "../assets/DOH.png";
import ESIC from "../assets/ESIC.png";
import MRU from "../assets/MRU.png";
import { Link } from "react-router-dom";
const DoctorCard = ({ doctor }) => {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="doctor-card">
        <div className="doctor-image-wrapper">
          <img src={doctor.image} alt={doctor.name} className="doctor-image" />
          <div className="rating-badge">
            <span className="star">★</span> {doctor.rating}
          </div>
          <button className="favorite-btn">
            <Heart size={18} />
          </button>
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
              <p className="consultation-label">Consultation Fees</p>
              <p className="consultation-fee">${doctor.fee}</p>
            </div>
            <button className="btn-book ">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OurPartners = () => {

  const trackRef2 = useRef(null);

    const companies = [DOH, MRU, ESIC];

  const services = [
    { icon: <FaCalendarCheck />, title: "Book Appointment",  url:"booking",  color: "#822bd4" },
    { icon: <FaCommentMedical />, title: "Talk to Doctors", url:"all-doctors", color: "#0e82fd" },
    { icon: <FaHospital />, title: "Hospitals & Clinics", color: "#dd2590" },
    { icon: <FaHeartbeat />, title: "Healthcare", color: "#06aed4" },
    { icon: <FaPills />, title: "Medicine & Supplies", color: "#6938ef" },
    { icon: <FaFlask />, title: "Lab Testing", color: "#e04f16" },
    { icon: <FaHome />, title: "Home Care", color: "#0e9384" },
  ];
  const servicesRow2 = [
    { id: 1, name: "Health Care Services", icon: <FaHospital size={24} /> },
    { id: 2, name: "Talk to Doctors", icon: <FaUserMd size={24} /> },
    { id: 3, name: "Home Care Services", icon: <FaHome size={24} /> },
    {
      id: 4,
      name: "Multi Speciality Treatments & Doctors",
      icon: <FaClinicMedical size={24} />,
    },
    { id: 5, name: "Lab Testing Services", icon: <FaFlask size={24} /> },
    { id: 6, name: "Medicines & Supplies", icon: <FaPills size={24} /> },
    { id: 7, name: "Hospitals & Clinics", icon: <FaHospital size={24} /> },
    { id: 8, name: "Health Care", icon: <FaHeart size={24} /> },
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Michael Brown",
      specialty: "Psychologist",
      rating: 5.0,
      location: "Minneapolis, MN",
      duration: "30 Min",
      fee: 650,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Dr. Nicholas Tello",
      specialty: "Pediatrician",
      rating: 4.8,
      location: "Ogden, IA",
      duration: "60 Min",
      fee: 400,
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
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
      <div className="services-overlay-box">
        <div className="services-container container">
          {services.map((service, index) => (
            <Link to={service.url} key={index} className="service-item text-decoration-none">
              <div
                className="service-icon"
                style={{ background: service.color }}
              >
                {service.icon}
              </div>
              <span className="service-text">{service.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-fluid">
        {/* Dots Pattern Overlay */}
                {/* Services Navigation Section */}
      <div className="topSpecialities__servicesSection">
        <div className="topSpecialities__servicesMarquee">
          <div 
            ref={trackRef2}
            className="topSpecialities__servicesTrack"
          >
            {[...servicesRow2, ...servicesRow2, ...servicesRow2].map((service, index) => (
              <div
                key={`${service.id}-${index}`}
                className="topSpecialities__serviceItem"
              >
                <span className="topSpecialities__serviceIcon">{service.icon}</span>
                <span className="topSpecialities__serviceName">{service.name}</span>
              </div>
            ))}
          </div>

      </div>

        </div>
      </div>

      <div className="container">
        <div className="section-header">
          <div className="featured-badge">✦  Our Knowledge Partners for Cancer Care ✦</div>
          {/* <h2 className="section-title">Our Highlighted Doctors</h2> */}
        </div>

         <div className="tstmnls-companies">
        <div className="container">
          <div className="text-center">
            {/* <p className="tstmnls-companies-title">
             
            </p> */}
            <div className="tstmnls-companies-grid">
              {companies.map((company, index) => (
                <img
                  key={index}
                  src={company}
                  className="tstmnls-company-logo"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OurPartners;
