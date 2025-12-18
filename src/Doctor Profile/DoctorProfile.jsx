import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
  XCircle,
} from "lucide-react";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // Get doctors data from Redux store
   const doctorData = location.state?.doctor;
  // const doctorsState = useSelector((state) => state.doctors);

  // Find the specific doctor by ID
  // const doctorData = doctorsState.doctors?.doctors?.find(
  //   (doctor) => doctor.id === id
  // );

  const handleShare = (doctor) => {
    const shareUrl = `${window.location.origin}/doctor/${doctor.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Dr. ${doctor.name}`,
          text: `Check out Dr. ${doctor.name}.`,
          url: shareUrl,
        })
        .catch((err) => console.log(err));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (
      !doctorData?.profile?.reviews ||
      doctorData.profile.reviews.length === 0
    ) {
      return doctorData?.rating || 0;
    }

    const totalRating = doctorData.profile.reviews.reduce((sum, review) => {
      return sum + review.rating;
    }, 0);

    return (totalRating / doctorData.profile.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  // Handle book appointment click
  const handleBookAppointment = () => {
    if (doctorData?.availableToday) {
      navigate("/booking", { state: { doctor: doctorData } });
    }
  };

  // If doctor not found, show loading or error
  if (!doctorData) {
    return (
      <div className="doctor-profile-container">
        <div className="container-fluid">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading doctor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Default images if not provided in API
  const defaultImages = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
  ];

  // Mock contact data (since it's null in API)
  const contactData = {
    phone: "+1 (555) 123-4567",
    email: "doctor@example.com",
    website: "www.doctorwebsite.com",
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "localities", label: "Localities" },
    { id: "reviews", label: "Reviews" },
    { id: "business-hours", label: "Business Hours" },
  ];

  const nextImage = () => {
    const images = doctorData.profile?.images || defaultImages;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    const images = doctorData.profile?.images || defaultImages;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const renderStars = (rating) => {
    const numericRating = parseFloat(rating);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < numericRating ? "text-warning fill-warning" : "text-muted"
        }
      />
    ));
  };

  const renderTabContent = () => {
    const images = doctorData.profile?.images || defaultImages;

    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <div className="row">
              <div className="col-lg-8">
                <div className="about-section">
                  <h4>About Me</h4>
                  <p>
                    {doctorData.profile?.about || "No information available."}
                  </p>
                </div>

                <div className="education-section mt-4">
                  <h4>Education</h4>
                  {doctorData.profile?.education?.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h6>{edu.degree}</h6>
                      <p className="text-muted mb-1">{edu.institution}</p>
                      <small className="text-muted">
                        Graduated: {edu.year}
                      </small>
                    </div>
                  )) || (
                    <p className="text-muted">
                      No education information available.
                    </p>
                  )}
                </div>

                <div className="services-section mt-4">
                  <h4>Services</h4>
                  <div className="services-grid">
                    {doctorData.profile?.services?.map((service, index) => (
                      <div key={index} className="service-items">
                        {service}
                      </div>
                    )) || <p className="text-muted">No services listed.</p>}
                  </div>
                </div>

                <div className="awards-section mt-4">
                  <h4>Awards & Recognition</h4>
                  <ul className="awards-list">
                    {doctorData.profile?.awards?.map((award, index) => (
                      <li key={index}>{award}</li>
                    )) || <li className="text-muted">No awards listed.</li>}
                  </ul>
                </div>

                <div className="memberships-section mt-4">
                  <h4>Memberships</h4>
                  <ul className="memberships-list">
                    {doctorData.profile?.memberships?.map(
                      (membership, index) => <li key={index}>{membership}</li>
                    ) || <li className="text-muted">No memberships listed.</li>}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="clinic-images">
                  <h5>Clinic Images</h5>
                  <div className="image-gallery">
                    <div className="main-image">
                      <img
                        src={images[currentImageIndex]}
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
                      {images.map((image, index) => (
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
                  {doctorData.location || "Location not specified"}
                </p>
                <p className="text-muted mb-2">
                  <Phone size={16} className="me-2" />
                  {contactData.phone}
                </p>
                {/* <div className="location-features">
                  <span className="feature-badge">Parking Available</span>
                  <span className="feature-badge">Wheelchair Access</span>
                  <span className="feature-badge">Metro Access</span>
                </div> */}
              </div>
              <div className="location-map">
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
                  <h2>{averageRating}</h2>
                  <div className="stars">{renderStars(averageRating)}</div>
                  {/* <p className="text-muted">
                    Based on {doctorData.profile?.reviews?.length || 0} reviews
                  </p> */}
                </div>
              </div>
            </div>

            <div className="reviews-list">
              {doctorData.profile?.reviews?.map((review) => (
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
              )) || <p className="text-muted">No reviews yet.</p>}
            </div>
          </div>
        );

      case "business-hours":
        return (
          <div className="tab-content">
            <h4>Business Hours</h4>
            <div className="business-hours">
              {doctorData.profile?.businessHours?.map((day, index) => (
                <div key={index} className="hour-row">
                  <span className="day">{day.day}</span>
                  <span className="hours">{day.hours}</span>
                </div>
              )) || (
                <div className="hour-row">
                  <span className="day">Monday - Friday</span>
                  <span className="hours">9:00 AM - 6:00 PM</span>
                </div>
              )}
            </div>

            <div className="emergency-info mt-4">
              <h5>Emergency Contact</h5>
              <p className="text-muted">
                For emergencies outside business hours, please call:
                <strong> {contactData.phone}</strong>
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
          <span className="current">{doctorData.name}</span>
        </nav>

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            <div className="doctor-profile-card">
              {/* Doctor Header */}
              <div className="doctor-header">
                <div className="doctor-avatar">
                  <img
                    src={doctorData.image}
                    alt={doctorData.name}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face";
                    }}
                  />
                </div>
                <div className="doctor-info">
                  <h1>{doctorData.name}</h1>
                  <p className="qualifications">{doctorData.qualifications}</p>
                  <div className="specialty-badge">{doctorData.specialty}</div>

                  <div className="doctor-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>
                        {doctorData.location || "Location not specified"}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Star size={16} />
                      <span>
                        {averageRating}
                        {/* (
                        {doctorData.profile?.reviews?.length || 0} ) */}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{doctorData.experience} years Experience</span>
                    </div>
                  </div>

                  <div className="languages">
                    <strong>Languages: </strong>
                    {doctorData.languages?.join(", ") || "English"}
                  </div>
                </div>

                <div className="doctor-actions">
                  {/* <button className="btn-favorite">
                    <Heart size={20} />
                  </button> */}
                  <button
                    className="btn-share"
                    onClick={() => handleShare(doctorData)}
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="contact-social">
                <div className="contact-inffo">
                  {/* Phone */}
                  {doctorData.profile?.contact.phone && (
                    <a
                      href={`tel:${doctorData.profile?.contact.phone}`}
                      className="contact-item text-decoration-none"
                    >
                      <Phone size={16} />
                      <span>{doctorData.profile?.contact.phone}</span>
                    </a>
                  )}

                  {/* Email */}
                  {doctorData.profile?.contact.email && (
                    <a
                      href={`mailto:${doctorData.profile?.contact.email}`}
                      className="contact-item text-decoration-none"
                    >
                      <Mail size={16} />
                      <span>{doctorData.profile?.contact.email}</span>
                    </a>
                  )}

                  {/* Website (only if available) */}
                  {/* {doctorData.profile?.contact.website && (
                    <a
                      href={doctorData.profile?.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-item"
                    >
                      <Globe size={16} />
                      <span>Visit Website</span>
                    </a>
                  )} */}
                </div>

                {/* Social Buttons */}
                <div className="social-links">
                  {/* Facebook */}
                  {doctorData.profile?.contact.facebook && (
                    <a
                      href={doctorData.profile?.contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                    >
                      <Facebook size={16} />
                    </a>
                  )}

                  {/* Twitter */}
                  {doctorData.profile?.contact.twitter && (
                    <a
                      href={doctorData.profile?.contact.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                    >
                      <Twitter size={16} />
                    </a>
                  )}

                  {/* Instagram */}
                  {doctorData.profile?.contact.instagram && (
                    <a
                      href={doctorData.profile?.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                    >
                      <Instagram size={16} />
                    </a>
                  )}

                  {/* LinkedIn */}
                  {doctorData.profile?.contact.linkedin && (
                    <a
                      href={doctorData.profile?.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-btn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
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

                {/* <div className="fee-section">
                  <span className="fee-label">Consultation Fee</span>
                  <span className="fee-amount">${doctorData.fee}</span>
                </div> */}

                <div className="availability-section d-flex justify-content-between">
                  <div className="availability-status">
                    <div
                      className={`status-indicator ${
                        doctorData.availableToday ? "available" : "unavailable"
                      }`}
                    ></div>
                    <span>
                      {doctorData.availableToday
                        ? "Available Today"
                        : "Not Available"}
                    </span>
                  </div>
                  {doctorData.nextAvailable && (
                    <p className="next-available">
                      Next: {doctorData.nextAvailable}
                    </p>
                  )}
                </div>

                <div
                  className={`booking-actions ${
                    !doctorData.availableToday ? "disabled-buttons" : ""
                  }`}
                  onMouseEnter={() => true && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <button
                    className={`btn-book-now ${
                      !doctorData.availableToday ? "disabled" : ""
                    }`}
                    onClick={handleBookAppointment}
                    disabled={!doctorData.availableToday}
                  >
                    <Calendar size={16} className="me-2" />
                    Book Appointment
                    {!doctorData.availableToday && (
                      <XCircle size={16} className="ms-2 denied-icon" />
                    )}
                  </button>
                  <button
                    className={`btn-consult-online ${
                      !doctorData.availableToday ? "disabled" : ""
                    }`}
                    disabled={!doctorData.availableToday}
                  >
                    <Phone size={16} className="me-2" />
                    Online Consultation
                    {!doctorData.availableToday && (
                      <XCircle size={16} className="ms-2 denied-icon" />
                    )}
                  </button>

                  {/* Tooltip */}
                  {showTooltip && !doctorData.availableToday && (
                    <div className="availability-tooltip">
                      <XCircle size={16} />
                      <span className="">
                        Doctor is not available today. Next available:{" "}
                        {doctorData.nextAvailable}
                      </span>
                    </div>
                  )}
                </div>

                <div className="quick-info">
                  <div className="info-item">
                    <strong>Response Time:</strong>
                    <span>{doctorData.response_time}</span>
                  </div>
                  <div className="info-item">
                    <strong>Follow-up:</strong>
                    <span>{doctorData.follow_up}</span>
                  </div>
                  <div className="info-item">
                    <strong>Cancellation:</strong>
                    <span>{doctorData.cancellation}</span>
                  </div>
                </div>
              </div>

              <div className="similar-doctors">
                <h5>Similar Doctors</h5>
                {/* You can add similar doctors logic here based on specialty */}
                <div className="similar-doctor-card">
                  <img src={doctorData.image} alt="Similar Doctor" />
                  <div className="similar-doctor-info">
                    <h6>{doctorData.name}</h6>
                    <p>
                      {doctorData.specialty} • {averageRating} ★
                    </p>
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
