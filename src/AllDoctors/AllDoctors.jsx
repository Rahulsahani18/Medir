import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Star,
  Calendar,
  Clock,
  Building,
} from "lucide-react";
import "../AllDoctors/AllDoctors.css";

const AllDoctors = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get search parameters from navigation state
  const searchParams = location.state || {};

  console.log("Received search params in AllDoctors:", searchParams);

  // Initialize state with search parameters from home page
  const [searchQuery, setSearchQuery] = useState(
    searchParams.searchQuery || ""
  );
  const [locationQuery, setLocationQuery] = useState(
    searchParams.locationQuery || ""
  );
  const [viewMode, setViewMode] = useState("list");
  const [expandedFilters, setExpandedFilters] = useState({
    specialities: true,
    consultationType: false,
    languages: false,
    experience: false,
    availability: false,
    gender: false,
  });

  const [filters, setFilters] = useState({
    specialities: [],
    gender: [],
    availability: [],
    consultationType: [],
    languages: [],
    experience: [],
    sortBy: "price-low",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 9;

  // All Medical Specialities
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

  // All Popular Locations
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

  // Mock data for doctors
  const allDoctors = [
    {
      id: 1,
      name: "Dr. Charles Scott",
      specialty: "Neurology",
      rating: 4.8,
      location: "New York, NY",
      duration: "30 Min",
      fee: 600,
      gender: "Male",
      experience: 20,
      languages: ["English", "French"],
      availableToday: true,
      nextAvailable: "10:00 AM - 15 Oct, Tue",
      qualifications: "MBBS, DNB - Neurology",
      votes: "98% (252 / 287 Votes)",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-teal",
    },
    {
      id: 2,
      name: "Dr. Robert Thomas",
      specialty: "Cardiology",
      rating: 4.3,
      location: "Los Angeles, CA",
      duration: "45 Min",
      fee: 450,
      gender: "Male",
      experience: 30,
      languages: ["English", "Spanish"],
      availableToday: false,
      nextAvailable: "11:00 AM - 19 Oct, Sat",
      qualifications: "MBBS, MD - Cardiology",
      votes: "92% (270 / 300 Votes)",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-info",
    },
    {
      id: 3,
      name: "Dr. Margaret Koller",
      specialty: "Psychiatry",
      rating: 4.7,
      location: "Chicago, IL",
      duration: "50 Min",
      fee: 700,
      gender: "Female",
      experience: 15,
      languages: ["English", "Portuguese"],
      availableToday: true,
      nextAvailable: "10:30 AM - 29 Oct, Tue",
      qualifications: "B.S, M.S - Psychology",
      votes: "94% (268 / 312 Votes)",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-indigo",
    },
    {
      id: 4,
      name: "Dr. Cath Busick",
      specialty: "Pediatrics",
      rating: 4.5,
      location: "Houston, TX",
      duration: "40 Min",
      fee: 750,
      gender: "Female",
      experience: 12,
      languages: ["English", "Arabic"],
      availableToday: false,
      nextAvailable: "02:00 PM - 04 Nov, Mon",
      qualifications: "MBBS, MD - Pediatrics",
      votes: "87% (237 / 250 Votes)",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-pink",
    },
    {
      id: 5,
      name: "Dr. Michael Brown",
      specialty: "Dermatology",
      rating: 5.0,
      location: "Phoenix, AZ",
      duration: "45 Min",
      fee: 400,
      gender: "Male",
      experience: 18,
      languages: ["English", "German"],
      availableToday: true,
      nextAvailable: "04:00 PM - 20 Nov, Wed",
      qualifications: "B.S, M.S - Psychology",
      votes: "90% (228 / 240 Votes)",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-indigo",
    },
    {
      id: 6,
      name: "Dr. Nicholas Tello",
      specialty: "Orthopedic",
      rating: 4.6,
      location: "Philadelphia, PA",
      duration: "35 Min",
      fee: 400,
      gender: "Male",
      experience: 15,
      languages: ["English", "Korean"],
      availableToday: true,
      nextAvailable: "11:00 AM - 14 Nov, Thu",
      qualifications: "MBBS, MD - Pediatrics",
      votes: "95% (200 / 220 Votes)",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-pink",
    },
    {
      id: 7,
      name: "Dr. Tyrone Patrick",
      specialty: "Urology",
      rating: 4.4,
      location: "San Antonio, TX",
      duration: "40 Min",
      fee: 400,
      gender: "Male",
      experience: 22,
      languages: ["English", "Russian"],
      availableToday: true,
      nextAvailable: "06:00 PM - 29 Nov, Fri",
      qualifications: "MBBS, MD - Cardiology",
      votes: "97% (232 / 248 Votes)",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-info",
    },
    {
      id: 8,
      name: "Dr. Sarah Johnson",
      specialty: "Endocrinology",
      rating: 4.9,
      location: "San Diego, CA",
      duration: "35 Min",
      fee: 650,
      gender: "Female",
      experience: 25,
      languages: ["English", "French"],
      availableToday: true,
      nextAvailable: "09:00 AM - 16 Oct, Wed",
      qualifications: "MBBS, MD - Neurology",
      votes: "96% (245 / 255 Votes)",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-teal",
    },
    {
      id: 9,
      name: "Dr. James Wilson",
      specialty: "Pulmonology",
      rating: 4.7,
      location: "Dallas, TX",
      duration: "40 Min",
      fee: 550,
      gender: "Male",
      experience: 28,
      languages: ["English", "Spanish"],
      availableToday: false,
      nextAvailable: "01:00 PM - 18 Oct, Fri",
      qualifications: "MBBS, MD - Cardiology",
      votes: "94% (260 / 276 Votes)",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-info",
    },
    {
      id: 10,
      name: "Dr. Emily Davis",
      specialty: "Ophthalmology",
      rating: 4.8,
      location: "San Jose, CA",
      duration: "30 Min",
      fee: 500,
      gender: "Female",
      experience: 16,
      languages: ["English", "Korean"],
      availableToday: true,
      nextAvailable: "10:30 AM - 15 Oct, Tue",
      qualifications: "MBBS, MD - Pediatrics",
      votes: "95% (230 / 242 Votes)",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-pink",
    },
    {
      id: 11,
      name: "Dr. David Miller",
      specialty: "Gastroenterology",
      rating: 4.6,
      location: "Austin, TX",
      duration: "40 Min",
      fee: 480,
      gender: "Male",
      experience: 14,
      languages: ["English", "Hindi"],
      availableToday: true,
      nextAvailable: "02:00 PM - 16 Oct, Wed",
      qualifications: "MBBS, MD - Gastroenterology",
      votes: "93% (210 / 225 Votes)",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-info",
    },
    {
      id: 12,
      name: "Dr. Lisa Anderson",
      specialty: "Obstetrics & Gynecology",
      rating: 4.9,
      location: "Jacksonville, FL",
      duration: "45 Min",
      fee: 520,
      gender: "Female",
      experience: 19,
      languages: ["English", "Spanish"],
      availableToday: false,
      nextAvailable: "09:30 AM - 17 Oct, Thu",
      qualifications: "MBBS, MD - Gynecology",
      votes: "96% (245 / 255 Votes)",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      specialtyColor: "text-pink",
    },
  ];

  const consultationTypes = [
    "Audio Call",
    "Video Call",
    "Instant Counseling",
    "Chat",
  ];
  const languages = [
    "English",
    "Hindi",
    "French",
    "Spanish",
    "Portuguese",
    "Arabic",
    "German",
    "Korean",
    "Russian",
  ];
  const experiences = ["2+ Years", "5+ Years", "10+ Years", "15+ Years"];
  const availabilityOptions = ["Available Today", "Available Tomorrow"];
  const genders = ["Male", "Female"];

  // Effect to handle when search parameters are passed from home page
  useEffect(() => {
    if (searchParams.searchQuery || searchParams.locationQuery) {
      console.log("Processing search params from Home:", {
        searchQuery: searchParams.searchQuery,
        locationQuery: searchParams.locationQuery,
      });

      // Auto-set the search query and location query
      if (searchParams.searchQuery) {
        setSearchQuery(searchParams.searchQuery);
      }
      if (searchParams.locationQuery) {
        setLocationQuery(searchParams.locationQuery);
      }
    }
  }, [searchParams]);

  // Filter doctors based on search and filters
  const filteredDoctors = allDoctors.filter((doctor) => {
    // Search filter - match by specialty or name (case insensitive)
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.specialty.toLowerCase().includes(searchLower) ||
      doctor.qualifications.toLowerCase().includes(searchLower);

    // Location filter (case insensitive)
    const locationLower = locationQuery.toLowerCase();
    const matchesLocation =
      locationQuery === "" ||
      doctor.location.toLowerCase().includes(locationLower);

    // Specialities filter
    const matchesSpecialities =
      filters.specialities.length === 0 ||
      filters.specialities.some((speciality) =>
        doctor.specialty.toLowerCase().includes(speciality.toLowerCase())
      );

    // Gender filter
    const matchesGender =
      filters.gender.length === 0 || filters.gender.includes(doctor.gender);

    // Availability filter
    const matchesAvailability =
      filters.availability.length === 0 ||
      (filters.availability.includes("Available Today") &&
        doctor.availableToday) ||
      (filters.availability.includes("Available Tomorrow") &&
        !doctor.availableToday);

    // Languages filter
    const matchesLanguages =
      filters.languages.length === 0 ||
      filters.languages.some((lang) => doctor.languages.includes(lang));

    // Experience filter
    const matchesExperience =
      filters.experience.length === 0 ||
      (filters.experience.includes("2+ Years") && doctor.experience >= 2) ||
      (filters.experience.includes("5+ Years") && doctor.experience >= 5) ||
      (filters.experience.includes("10+ Years") && doctor.experience >= 10) ||
      (filters.experience.includes("15+ Years") && doctor.experience >= 15);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesSpecialities &&
      matchesGender &&
      matchesAvailability &&
      matchesLanguages &&
      matchesExperience
    );
  });

  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (filters.sortBy === "price-low") {
      return a.fee - b.fee;
    } else if (filters.sortBy === "price-high") {
      return b.fee - a.fee;
    } else if (filters.sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Pagination - Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, locationQuery, filters]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = sortedDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      specialities: [],
      gender: [],
      availability: [],
      consultationType: [],
      languages: [],
      experience: [],
      sortBy: "price-low",
    });
    setSearchQuery("");
    setLocationQuery("");
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // List View Doctor Card
  const DoctorCardList = ({ doctor }) => {
    return (
      <div className="col-lg-12">
        <div className="card doctor-list-card" 

        >
          <div className="d-md-flex align-items-center">
            {/* Doctor Image */}
            <div className="card-img card-img-hover">
              <Link to={`/doctor-profile/${doctor.id}`}>
                <img alt={doctor.name} src={doctor.image} />
              </Link>
              <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                <span className="badge bg-orange">
                  <Star size={12} className="me-1" />
                  {doctor.rating}
                </span>
                <a className="fav-icon" href="#">
                  <Heart size={14} />
                </a>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="card-body p-0">
              {/* Specialty and Availability */}
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <a
                  className={`${doctor.specialtyColor} fw-medium fs-14`}
                  href="#"
                >
                  {doctor.specialty}
                </a>
                <span
                  className={`badge ${
                    doctor.availableToday
                      ? "bg-success-light"
                      : "bg-danger-light"
                  } d-inline-flex align-items-center`}
                >
                  <span className="dot me-1"></span>
                  {doctor.availableToday ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Doctor Details */}
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    {/* Left Column */}
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to={`/doctor-profile/${doctor.id}`}>
                            {doctor.name}
                          </Link>
                          <span className="tick-circle text-success ms-2">
                            ✓
                          </span>
                        </h6>
                        <p className="mb-2">{doctor.qualifications}</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <MapPin size={14} className="me-2" />
                          {doctor.location}
                          <a
                            className="text-primary text-decoration-underline ms-2"
                            href="#"
                          >
                            Get Direction
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <span className="language-icon me-2">🌐</span>
                          {doctor.languages.join(", ")}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <span className="like-icon me-2">👍</span>
                          {doctor.votes}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <span className="experience-icon me-2">📚</span>
                          {doctor.experience} Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Fees and Booking */}
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h4 className="text-orange">${doctor.fee}</h4>
                    </div>
                    <p className="">
                      Next available at <br />
                      {doctor.nextAvailable}
                    </p>
                  </div>
                  <a
                  onClick={(e)=>{
                    e.stopPropagation()
                    navigate("/booking")}
                  }
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                 
                  >
                    <Calendar size={14} className="me-2" />
                    Book Appointment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grid View Doctor Card
  const DoctorCardGrid = ({ doctor }) => {
    return (
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="allDoctors-doctor-card " onClick={(e) =>  {
                e.stopPropagation();
                navigate(`/doctor-profile/${doctor.id}`)}}>
          <div className="allDoctors-doctor-image-wrapper">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="allDoctors-doctor-image"
            />
            <div className="allDoctors-rating-badge">
              <Star size={14} className="allDoctors-star" />
              {doctor.rating}
            </div>

            <h4 className="text-orange-viewGrid">$ {doctor.fee}</h4>
          </div>

          <div className="allDoctors-doctor-info">
            <div className="allDoctors-specialty-status">
              <span className="allDoctors-specialty">{doctor.specialty}</span>
              <span
                className={`allDoctors-status ${
                  doctor.availableToday ? "available" : "unavailable"
                }`}
              >
                ● {doctor.availableToday ? "Available" : "Unavailable"}
              </span>
            </div>

            <h5 className="allDoctors-doctor-name">{doctor.name}</h5>

            <div className="allDoctors-doctor-details">
              <MapPin size={14} className="allDoctors-icon" />
              <span>
                {doctor.location} • {doctor.duration}
              </span>
            </div>

            <div className="allDoctors-doctor-footer">
              <div>
                <button
                  className="btn-view-profile btn-primary-gradient rounded-pill"
                  onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                >
                  {/* <User size={14} className="me-1" /> */}
                  View Profile
                </button>
              </div>
              <button className="btn-primary-gradient rounded-pill" 
              onClick={(e) =>  {
                e.stopPropagation();
                navigate("/booking")}}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FilterSection = ({
    title,
    children,
    sectionKey,
    scrollable = false,
  }) => (
    <div className="allDoctors-filter-section">
      <div
        className="allDoctors-filter-header"
        onClick={() => toggleFilterSection(sectionKey)}
      >
        <span className="allDoctors-filter-title">{title}</span>
        <span className="allDoctors-filter-toggle">
          {expandedFilters[sectionKey] ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </span>
      </div>
      <div
        className={`allDoctors-filter-content ${
          !expandedFilters[sectionKey] ? "collapsed" : ""
        } ${scrollable ? "scrollable" : ""}`}
      >
        {children}
      </div>
    </div>
  );

  const FilterCheckbox = ({ label, checked, onChange, count }) => (
    <label className="allDoctors-filter-checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="allDoctors-checkmark"></span>
      <span className="allDoctors-filter-label">{label}</span>
      {count && <span className="allDoctors-filter-count">({count})</span>}
    </label>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the state updates
  };

  return (
    <div className="allDoctors-container">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="allDoctors-header">
          <h1 className="allDoctors-main-title">
            Search for Doctors, Hospitals, Clinics
          </h1>
          <div className="AllDoctor-search-box">
            <form className="d-flex align-items-center" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <i className="search-icon">
                  <Building size={20} />
                </i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search doctors, clinics, hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="search-input-wrapper location-input">
                <i className="search-icon">
                  <MapPin size={20} />
                </i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-search">
                <Search className="me-2" size={16} />
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="allDoctors-filters-sidebar">
              <div className="allDoctors-filters-header">
                <h3 className="allDoctors-filters-title">Filter</h3>
                <button
                  className="allDoctors-clear-all"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>

              <FilterSection
                title="Specialities"
                sectionKey="specialities"
                scrollable={true}
              >
                <div className="specialities-scroll-container">
                  {medicalSpecialities.map((speciality) => (
                    <FilterCheckbox
                      key={speciality}
                      label={speciality}
                      checked={filters.specialities.includes(speciality)}
                      onChange={() =>
                        handleFilterChange("specialities", speciality)
                      }
                    />
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Consultation Type"
                sectionKey="consultationType"
              >
                {consultationTypes.map((type) => (
                  <FilterCheckbox
                    key={type}
                    label={type}
                    checked={filters.consultationType.includes(type)}
                    onChange={() =>
                      handleFilterChange("consultationType", type)
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection title="Languages" sectionKey="languages">
                {languages.map((language) => (
                  <FilterCheckbox
                    key={language}
                    label={language}
                    checked={filters.languages.includes(language)}
                    onChange={() => handleFilterChange("languages", language)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Experience" sectionKey="experience">
                {experiences.map((experience) => (
                  <FilterCheckbox
                    key={experience}
                    label={experience}
                    checked={filters.experience.includes(experience)}
                    onChange={() =>
                      handleFilterChange("experience", experience)
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection title="Availability" sectionKey="availability">
                {availabilityOptions.map((availability) => (
                  <FilterCheckbox
                    key={availability}
                    label={availability}
                    checked={filters.availability.includes(availability)}
                    onChange={() =>
                      handleFilterChange("availability", availability)
                    }
                  />
                ))}
              </FilterSection>

              <FilterSection title="Gender" sectionKey="gender">
                {genders.map((gender) => (
                  <FilterCheckbox
                    key={gender}
                    label={gender}
                    checked={filters.gender.includes(gender)}
                    onChange={() => handleFilterChange("gender", gender)}
                  />
                ))}
              </FilterSection>
            </div>
          </div>

          {/* Doctors List */}
          <div className="col-lg-9 col-md-8">
            <div className="allDoctors-grid-container">
              {/* Results Header */}
              <div className="allDoctors-results-header">
                <div className="allDoctors-results-info">
                  <span className="allDoctors-doctors-count">
                    Showing {currentDoctors.length} of {sortedDoctors.length}{" "}
                    Doctors
                    {searchQuery && (
                      <span className="search-query-info">
                        {" "}
                        for "{searchQuery}"
                      </span>
                    )}
                    {locationQuery && (
                      <span className="location-query-info">
                        {" "}
                        in "{locationQuery}"
                      </span>
                    )}
                  </span>
                </div>
                <div className="allDoctors-view-controls">
                  <div className="allDoctors-sort-by">
                    <span>Sort By:</span>
                    <select
                      className="allDoctors-sort-select"
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value,
                        }))
                      }
                    >
                      <option value="price-low">Price (Low to High)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                  <div className="allDoctors-view-toggle">
                    <button
                      className={`view-toggle-btn ${
                        viewMode === "grid" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      className={`view-toggle-btn ${
                        viewMode === "list" ? "active" : ""
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Doctors List/Grid */}
              <div className="row">
                {currentDoctors.length > 0 ? (
                  currentDoctors.map((doctor) =>
                    viewMode === "grid" ? (
                      <DoctorCardGrid key={doctor.id} doctor={doctor} />
                    ) : (
                      <DoctorCardList key={doctor.id} doctor={doctor} />
                    )
                  )
                ) : (
                  <div className="col-12">
                    <div className="allDoctors-no-results">
                      <h3>No doctors found</h3>
                      <p>Try adjusting your search or filters</p>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination dashboard-pagination mt-md-3 mt-0 mb-4">
                  <ul>
                    <li>
                      <a
                        className={`page-link prev ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
                        style={{
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        Prev
                      </a>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1}>
                        <a
                          className={`page-link ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                          onClick={() => paginate(index + 1)}
                          style={{ cursor: "pointer" }}
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        className={`page-link next ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                        onClick={() =>
                          currentPage < totalPages && paginate(currentPage + 1)
                        }
                        style={{
                          cursor:
                            currentPage === totalPages
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
