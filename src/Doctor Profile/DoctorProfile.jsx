import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Heart,
  Share2,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - In real app, this would come from API
  const doctorData = {
    id: 1,
    name: "Dr. Darren Elder",
    qualifications: "BDS, MDS - Oral & Musculoskeletal Surgery",
    specialty: "Dentist",
    location: "USA",
    address: "Surgery/CA, USA",
    rating: 4.8,
    totalReviews: 124,
    experience: "15+ Years",
    fee: 300,
    availability: "Available Today",
    nextAvailable: "10:00 AM - 15 Oct, Tue",
    languages: ["English", "French", "Spanish"],
    education: [
      {
        degree: "BDS",
        institution: "American Dental Medical University",
        year: "2003",
      },
      {
        degree: "MDS",
        institution: "Harvard Medical School",
        year: "2007",
      },
    ],
    services: [
      "Teeth Cleaning",
      "Root Canal",
      "Dental Implants",
      "Teeth Whitening",
      "Orthodontics",
      "Periodontics",
      "Oral Surgery",
      "Pediatric Dentistry",
    ],
    awards: [
      "Best Dentist Award 2020",
      "Excellence in Oral Surgery 2019",
      "Patient Choice Award 2018-2022",
    ],
    memberships: [
      "American Dental Association",
      "International College of Dentists",
      "Academy of General Dentistry",
    ],
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    images: [
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    ],
    reviews: [
      {
        id: 1,
        patient: "John Smith",
        rating: 5,
        date: "2 days ago",
        comment:
          "Excellent service! Dr. Elder is very professional and caring.",
        verified: true,
      },
      {
        id: 2,
        patient: "Sarah Johnson",
        rating: 4,
        date: "1 week ago",
        comment:
          "Great experience. The staff was friendly and the clinic was clean.",
        verified: true,
      },
      {
        id: 3,
        patient: "Mike Davis",
        rating: 5,
        date: "2 weeks ago",
        comment: "The best dental care I've ever received. Highly recommended!",
        verified: true,
      },
    ],
    businessHours: [
      { day: "Monday", hours: "9:00 AM - 6:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
      { day: "Friday", hours: "9:00 AM - 5:00 PM" },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
    contact: {
      phone: "+1 (555) 123-4567",
      email: "dr.darren.elder@example.com",
      website: "www.drdarrenelder.com",
    },
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "localities", label: "Localities" },
    { id: "reviews", label: "Reviews" },
    { id: "business-hours", label: "Business Hours" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === doctorData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? doctorData.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-warning fill-warning" : "text-muted"}
      />
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <div className="row">
              <div className="col-lg-8">
                <div className="about-section">
                  <h4>About Me</h4>
                  <p>{doctorData.about}</p>
                </div>

                <div className="education-section mt-4">
                  <h4>Education</h4>
                  {doctorData.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h6>{edu.degree}</h6>
                      <p className="text-muted mb-1">{edu.institution}</p>
                      <small className="text-muted">
                        Graduated: {edu.year}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="services-section mt-4">
                  <h4>Services</h4>
                  <div className="services-grid">
                    {doctorData.services.map((service, index) => (
                      <div key={index} className="service-items">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="awards-section mt-4">
                  <h4>Awards & Recognition</h4>
                  <ul className="awards-list">
                    {doctorData.awards.map((award, index) => (
                      <li key={index}>{award}</li>
                    ))}
                  </ul>
                </div>

                <div className="memberships-section mt-4">
                  <h4>Memberships</h4>
                  <ul className="memberships-list">
                    {doctorData.memberships.map((membership, index) => (
                      <li key={index}>{membership}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="clinic-images">
                  <h5>Clinic Images</h5>
                  <div className="image-gallery">
                    <div className="main-image">
                      <img
                        src={doctorData.images[currentImageIndex]}
                        alt={`Clinic ${currentImageIndex + 1}`}
                      />
                      <button className="nav-btn prev" onClick={prevImage}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="nav-btn next" onClick={nextImage}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="image-thumbnails">
                      {doctorData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={
                            index === currentImageIndex ? "active" : ""
                          }
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "localities":
        return (
          <div className="tab-content">
            <h4>Practice Locations</h4>
            <div className="location-card">
              <div className="location-info">
                <h5>Main Clinic</h5>
                <p className="text-muted mb-2">
                  <MapPin size={16} className="me-2" />
                  {doctorData.address}
                </p>
                <p className="text-muted mb-2">
                  <Phone size={16} className="me-2" />
                  {doctorData.contact.phone}
                </p>
                <div className="location-features">
                  <span className="feature-badge">Parking Available</span>
                  <span className="feature-badge">Wheelchair Access</span>
                  <span className="feature-badge">Metro Access</span>
                </div>
              </div>
              <div className="location-map">
                {/* Map placeholder - integrate with Google Maps in real app */}
                <div className="map-placeholder">
                  <MapPin size={32} className="text-primary" />
                  <p>Interactive Map</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "reviews":
        return (
          <div className="tab-content">
            <div className="reviews-header">
              <div className="rating-summary">
                <div className="average-rating">
                  <h2>{doctorData.rating}</h2>
                  <div className="stars">
                    {renderStars(Math.floor(doctorData.rating))}
                  </div>
                  <p className="text-muted">
                    Based on {doctorData.totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="reviews-list">
              {doctorData.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="patient-info">
                      <h6>{review.patient}</h6>
                      {review.verified && (
                        <span className="verified-badge">Verified Patient</span>
                      )}
                    </div>
                    <div className="review-meta">
                      <div className="stars">{renderStars(review.rating)}</div>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "business-hours":
        return (
          <div className="tab-content">
            <h4>Business Hours</h4>
            <div className="business-hours">
              {doctorData.businessHours.map((day, index) => (
                <div key={index} className="hour-row">
                  <span className="day">{day.day}</span>
                  <span className="hours">{day.hours}</span>
                </div>
              ))}
            </div>

            <div className="emergency-info mt-4">
              <h5>Emergency Contact</h5>
              <p className="text-muted">
                For dental emergencies outside business hours, please call:
                <strong> {doctorData.contact.phone}</strong>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="doctor-profile-container">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to="/all-doctors">Doctors</Link>
          <span className="separator">/</span>
          <span className="current">Dr. {doctorData.name.split(" ")[1]}</span>
        </nav>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="doctor-profile-card">
              {/* Doctor Header */}
              <div className="doctor-header">
                <div className="doctor-avatar">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
                    alt={doctorData.name}
                  />
                </div>
                <div className="doctor-info">
                  <h1>{doctorData.name}</h1>
                  <p className="qualifications">{doctorData.qualifications}</p>
                  <div className="specialty-badge">{doctorData.specialty}</div>

                  <div className="doctor-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{doctorData.location}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={16} />
                      <span>
                        {doctorData.rating} ({doctorData.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{doctorData.experience} Experience</span>
                    </div>
                  </div>

                  <div className="languages">
                    <strong>Languages: </strong>
                    {doctorData.languages.join(", ")}
                  </div>
                </div>

                <div className="doctor-actions">
                  <button className="btn-favorite">
                    <Heart size={20} />
                  </button>
                  <button className="btn-share">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="contact-social">
                <div className="contact-inffo">
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{doctorData.contact.phone}</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{doctorData.contact.email}</span>
                  </div>
                </div>
                <div className="social-links">
                  <button className="social-btn">
                    <Facebook size={16} />
                  </button>
                  <button className="social-btn">
                    <Twitter size={16} />
                  </button>
                  <button className="social-btn">
                    <Linkedin size={16} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="profile-tabs">
                <div className="tabs-header">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-btn ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="tabs-content">{renderTabContent()}</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="booking-sidebar">
              <div className="booking-card">
                <h4>Book Appointment</h4>

                <div className="fee-section">
                  <span className="fee-label">Consultation Fee</span>
                  <span className="fee-amount">${doctorData.fee}</span>
                </div>

                <div className="availability-section">
                  <div className="availability-status">
                    <div
                      className={`status-indicator ${
                        doctorData.availability.includes("Available")
                          ? "available"
                          : "unavailable"
                      }`}
                    ></div>
                    <span>{doctorData.availability}</span>
                  </div>
                  <p className="next-available">
                    Next: {doctorData.nextAvailable}
                  </p>
                </div>

                <div className="booking-actions">
                  <button
                    className="btn-book-now"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/booking");
                    }}
                  >
                    <Calendar size={16} className="me-2" />
                    Book Appointment
                  </button>
                  <button className="btn-consult-online">
                    <Phone size={16} className="me-2" />
                    Online Consultation
                  </button>
                </div>

                <div className="quick-info">
                  <div className="info-item">
                    <strong>Response Time:</strong>
                    <span>Within 15 minutes</span>
                  </div>
                  <div className="info-item">
                    <strong>Follow-up:</strong>
                    <span>No charge</span>
                  </div>
                  <div className="info-item">
                    <strong>Cancellation:</strong>
                    <span>Free cancellation</span>
                  </div>
                </div>
              </div>

              <div className="similar-doctors">
                <h5>Similar Doctors</h5>
                {/* Add similar doctors list here */}
                <div className="similar-doctor-card">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face"
                    alt="Similar Doctor"
                  />
                  <div className="similar-doctor-info">
                    <h6>Dr. Sarah Johnson</h6>
                    <p>Dentist • 4.9 ★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
