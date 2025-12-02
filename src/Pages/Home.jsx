import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Banner_Bg02 from "../assets/banner-bg-02.png";
import Banner_Bg04 from "../assets/banner-bg-04.png";
import Banner_Bg03 from "../assets/banner-bg-03.png";
import Banner_Bg05 from "../assets/banner-bg-05.png";
import Banner_Icon from "../assets/banner-icon-01.svg";
import Doctor1 from "../assets/dr-abhishek-bansal-13241.jpg";
import Doctor2 from "../assets/Dr-Ravi-Kant.webp";
import Doctor3 from "../assets/Dr.-Sanjay-Rai.jpg";
import HeroDoctorImg from "../assets/Mask-Group-7-1.png";
import { HiBuildingOffice2, HiMapPin, HiChevronDown } from "react-icons/hi2";
import { FaTrophy } from "react-icons/fa";
import { FaStar, FaUserMd, FaPrescriptionBottleAlt } from "react-icons/fa";
import { HiVideoCamera } from "react-icons/hi";
import { RiSearchFill } from "react-icons/ri";
import FeaturedDoctor from "../Pages/FeaturedDoctors";
import TopSpecialities from "../Pages/TopSpecialities";
import WhyBook from "./WhyBook";
import Tstmnl from "./Testimonials";
import FAQs from "../Pages/FAQs";
import Footer from "../Components/Footer";
import OurPartners from "./OurPrtners";

const Home = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showSpecialities, setShowSpecialities] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const navigate = useNavigate();
  const specialityRef = useRef(null);
  const locationRef = useRef(null);

  const medicalSpecialities = [
    "Aesthetic and Anti-aging Medicine",
    "Allergy & Immunology",
    "Anatomic Pathology",
    "Anesthesia",
    "Audiology",
    "Brain & Spine Surgery",
    "Breast Surgery",
    "Cardiac Anesthesia",
    "Cardiac Surgery",
    "Cardiology",
    "Cardiothoracic Surgery",
    "Chinese and Oriental Medicine",
    "Chiropractic",
    "Colorectal & Laparoscopic Surgery",
    "Cosmetic Surgery",
    "Dental Surgery",
    "Dentistry",
    "Dermatology",
    "Dermatology & Cosmetology",
    "Diabetology",
    "Diabetology & Endocrinology",
    "Dietetics",
    "Emergency Medicine",
    "Endocrine & Breast Surgery",
    "Endocrinology",
    "Endodontics",
    "ENT",
    "ENT & Head Neck Surgery",
    "ENT Surgery",
    "Family & Occupational Medicine",
    "Family Physician",
    "Gastroenterology",
    "Gastroenterology & Diabetology",
    "Gastroenterology & Hepatology",
    "General & Bariatric Surgery",
    "General Medicine",
    "General Physician",
    "General Surgery",
    "Geriatric Medicine",
    "Haematology",
    "Hair Implantation and Transplantation",
    "Hematology Oncology",
    "Hepatology",
    "HistopathologY",
    "Homeopathic",
    "Infectious Diseases",
    "Infertility Specialist",
    "Intensivist",
    "Internal Medicine",
    "Interventional Cardiology",
    "Interventional Neurology",
    "Liver Transplantation Hepatobiliary & Pancreatic Surgery",
    "Medical Specialist",
    "Medicine",
    "Microbiology",
    "Neonatology",
    "Nephrology",
    "Nephrology & Dialysis",
    "Neurology",
    "Neuroradiology",
    "Neurosurgery",
    "Nuclear Cardiology",
    "Nuclear Medicine",
    "Nuclear Medicine and Molecular Imaging",
    "Nutrition",
    "Obstetrics & Gynecology",
    "Oncology",
    "Oncoplastic Breast Surgery",
    "Ophthalmology",
    "Optometry",
    "Oral & Maxillofacial Surgery",
    "Orthodontics",
    "Orthopedic",
    "Otolaryngologist",
    "Paedodontics (Pediatric Dentistry)",
    "Pain Management",
    "Palliative Medicine",
    "Pathology",
    "Pediatric and Adolescent Psychiatry",
    "Pediatric Anesthesia",
    "Pediatric Cardiac Surgery",
    "Pediatric Cardiology",
    "Pediatric Endocrinology",
    "Pediatric Gastroenterology",
    "Pediatric Hematology-Oncology",
    "Pediatric Nephrology",
    "Pediatric Neurosurgery",
    "Pediatric Physiotherapy",
    "Pediatric Radiology",
    "Pediatric Surgery",
    "Pediatric Urology",
    "Pediatrics",
    "Periodontics",
    "Physical Medicine & Rehabilitation",
    "Physical Therapy",
    "Physiotherapy",
    "Plastic Surgery",
    "Podiatry",
    "Prosthodontics",
    "Psychiatry",
    "Psychology",
    "Public & Community Health",
    "Pulmonology",
    "Pulmonology & Critical Care",
    "Pulmonology and Sleep Medicine",
    "Radiation Oncology",
    "Radiology",
    "Regenerative Medicine",
    "Rehabilitation",
    "Rheumatology",
    "Sonologist",
    "Speech Therapy",
    "Spinal and Orthopedic Surgery",
    "Urology",
    "Vascular Surgery",
  ];

  const popularLocations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
    "San Francisco, CA",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Washington, DC",
    "Boston, MA",
    "El Paso, TX",
    "Nashville, TN",
    "Detroit, MI",
    "Oklahoma City, OK",
    "Portland, OR",
    "Las Vegas, NV",
    "Memphis, TN",
    "Louisville, KY",
    "Baltimore, MD",
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        specialityRef.current &&
        !specialityRef.current.contains(event.target)
      ) {
        setShowSpecialities(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    // REMOVED THE REQUIRED FIELD VALIDATION
    // Users can search with just speciality, just location, or both

    console.log("Searching with:", {
      speciality: selectedSpeciality,
      location: selectedLocation,
    });

    // Navigate to AllDoctors page with search parameters
    navigate("/all-doctors", {
      state: {
        searchQuery: selectedSpeciality,
        locationQuery: selectedLocation,
        speciality: selectedSpeciality,
      },
    });
  };

  const handleSpecialitySelect = (speciality) => {
    setSelectedSpeciality(speciality);
    setShowSpecialities(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocations(false);
  };

  const handleSpecialityInputClick = () => {
    setShowSpecialities(true);
    setShowLocations(false);
  };

  const handleLocationInputClick = () => {
    setShowLocations(true);
    setShowSpecialities(false);
  };

  return (
    <>
      {/* Banner Section with Services Overlay */}
      <section className="banner-section banner-sec-one">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="banner-content">
                {/* Rating and Appointments */}
                <div className="rating-appointment d-inline-flex align-items-center gap-3 mb-4">
                  <div className="avatar-list-stacked avatar-group-lg">
                    <span className="avatar avatar-rounded">
                      <img
                        className="border border-white"
                        alt="doctor"
                        src={Doctor1}
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        className="border border-white"
                        alt="doctor"
                        src={Doctor2}
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img alt="doctor" src={Doctor3} />
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold fs-6">
                      22+ Doctors are available just for you.
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex text-orange">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p className="mb-0 text-muted fw-bold">5.0 Ratings</p>
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="display-5 banner-heading">
                  Find The Right
                  <span className="banner-icon mx-2">
                    <img
                      alt="video-icon"
                      src="https://doccure.dreamstechnologies.com/react/template/src/assets/img/icons/video.svg"
                    />
                  </span>
                  <span className="text-gradient">Doctor.</span>
                </h1>
                <span>
                  The Largest Network for Cancer Cure - doctors, facilities and
                  online Appointment.
                </span>
                <div className="d-flex gap-5 align-items-center">
                  <p className="d-flex align-items-center gap-2">
                    <HiVideoCamera size={20} style={{ color: "#18dec5" }} />{" "}
                    Video Consultation
                  </p>

                  <p className="d-flex align-items-center gap-2">
                    <FaUserMd size={20} style={{ color: "#18dec5" }} />{" "}
                    Certified Doctors
                  </p>

                  <p className="d-flex align-items-center gap-2">
                    <FaPrescriptionBottleAlt
                      size={20}
                      style={{ color: "#18dec5" }}
                    />{" "}
                    Online Prescription
                  </p>
                </div>

                {/* Search Form */}
                <div className="search-box-modern">
                  <form
                    className="d-flex align-items-center"
                    onSubmit={handleSearch}
                  >
                    {/* Speciality Selection */}
                    <div
                      className="search-input-wrapper speciality-select-wrapper"
                      ref={specialityRef}
                    >
                      <i className="search-icon">
                        <HiBuildingOffice2 size={20} />
                      </i>
                      <div className="selection-input-container">
                        <input
                          type="text"
                          className="selection-input"
                          placeholder="Select Speciality"
                          value={selectedSpeciality}
                          readOnly
                          onClick={handleSpecialityInputClick}
                        />
                        <button
                          type="button"
                          className="dropdown-toggle"
                          onClick={() => setShowSpecialities(!showSpecialities)}
                        >
                          <HiChevronDown size={16} />
                        </button>

                        {showSpecialities && (
                          <div className="selection-dropdown-menu">
                            <div className="selection-list-container">
                              <div className="selection-header">
                                <span>What</span>
                                <h4>Search Doctors, Conditions, or</h4>
                              </div>
                              {medicalSpecialities.map((speciality, index) => (
                                <div
                                  key={index}
                                  className={`selection-option ${
                                    selectedSpeciality === speciality
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSpecialitySelect(speciality)
                                  }
                                >
                                  <span className="option-text">
                                    {speciality}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Selection */}
                    <div
                      className="search-input-wrapper location-input"
                      ref={locationRef}
                    >
                      <i className="search-icon">
                        <HiMapPin size={20} />
                      </i>
                      <div className="selection-input-container">
                        <input
                          type="text"
                          className="selection-input"
                          placeholder="Select Location"
                          value={selectedLocation}
                          readOnly
                          onClick={handleLocationInputClick}
                        />
                        <button
                          type="button"
                          className="dropdown-toggle"
                          onClick={() => setShowLocations(!showLocations)}
                        >
                          <HiChevronDown size={16} />
                        </button>

                        {showLocations && (
                          <div className="selection-dropdown-menu">
                            <div className="selection-list-container">
                              <div className="selection-header">
                                <span>Where</span>
                                <h4>Select Location</h4>
                              </div>
                              {popularLocations.map((location, index) => (
                                <div
                                  key={index}
                                  className={`selection-option ${
                                    selectedLocation === location
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  <span className="option-text">
                                    {location}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-search">
                      {/* <RiSearchFill className="me-2" /> */}
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="banner-img">
                <img
                  className="img-fluid main-doctor-image"
                  alt="doctor-banner"
                  src={HeroDoctorImg}
                />

                <div className="banner-appointment align-items-center gap-2">
                  <h6 className="align-items-center gap-1">
                    <FaTrophy size={25} color="#f4c21a" />
                  </h6>
                  <p>
                    # A VHK Healthcare
                    <span className="d-block">Initiative !</span>
                  </p>
                </div>

                <div className="banner-patient">
                  <div className="avatar-list-stacked avatar-group-sm">
                    <span className="avatar avatar-rounded">
                      <img
                        alt="patient"
                        src="https://doccure.dreamstechnologies.com/react/template/src/assets/img/doctors/doctor-thumb-22.jpg"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        alt="patient"
                        src="https://doccure.dreamstechnologies.com/react/template/src/assets/img/doctors/doctor-thumb-22.jpg"
                      />
                    </span>
                    <span className="avatar avatar-rounded">
                      <img
                        alt="patient"
                        src="https://doccure.dreamstechnologies.com/react/template/src/assets/img/doctors/doctor-thumb-22.jpg"
                      />
                    </span>
                  </div>
                  <p className="patient-count">15K+</p>
                  <p className="patient-label">Satisfied Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="banner-bg">
          <img className="banner-bg-01" alt="" src={Banner_Bg04} />
          <img className="banner-bg-02" alt="" src={Banner_Bg03} />
          <img className="banner-bg-03" alt="" src={Banner_Bg02} />
          <img className="banner-bg-04" alt="" src={Banner_Bg05} />
          <img className="banner-bg-05" alt="" src={Banner_Icon} />
          <img className="banner-bg-06" alt="" src={Banner_Icon} />
        </div>
      </section>

      <OurPartners />
      <FeaturedDoctor />
      <TopSpecialities />
      <WhyBook />
      <Tstmnl />
      <FAQs />
      <Footer />
    </>
  );
};

export default Home;
