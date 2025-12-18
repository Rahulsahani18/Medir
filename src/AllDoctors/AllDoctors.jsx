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
import {
  HiBuildingOffice2,
  HiChevronDown as HiChevronDownIcon,
} from "react-icons/hi2";
import "../AllDoctors/AllDoctors.css";
import { useSelector } from "react-redux";

const AllDoctors = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get Redux state - Access the nested structure correctly
  const doctorsState = useSelector((state) => state.doctors);

  // Extract doctors array from the nested structure - use ORIGINAL data
  const doctorsFromAPI = doctorsState?.doctors?.doctors || [];
  console.log("Original doctors from API:", doctorsFromAPI);
  console.log("Number of doctors:", doctorsFromAPI.length);

  // Get search parameters from navigation state
  const searchParams = location.state || {};

  // Initialize state for search inputs (not applied filters yet)
  const [searchInput, setSearchInput] = useState(
    searchParams.searchQuery || ""
  );
  const [locationInput, setLocationInput] = useState(
    searchParams.locationQuery || ""
  );

  // State for applied filters (what's actually being used to filter)
  const [appliedSearch, setAppliedSearch] = useState(
    searchParams.searchQuery || ""
  );
  const [appliedLocation, setAppliedLocation] = useState(
    searchParams.locationQuery || ""
  );

  const [showSpecialitiesDropdown, setShowSpecialitiesDropdown] =
    useState(false);
  const [showLocationsDropdown, setShowLocationsDropdown] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [expandedFilters, setExpandedFilters] = useState({
    specialities: true,
    consultationType: false,
    languages: false,
    experience: false,
    availability: false,
    gender: false,
    locations: false,
  });

  const [filters, setFilters] = useState({
    specialities: [],
    gender: [],
    availability: [],
    consultationType: [],
    languages: [],
    locations: [],
    experience: [],
    sortBy: "price-low",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 9;

  // Refs for dropdown close handling
  const specialityRef = useRef(null);
  const locationRef = useRef(null);

  // All Popular Locations (keep as static fallback for dropdown)
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

  // Extract unique specialities from ORIGINAL API data
  const getUniqueSpecialities = (doctors) => {
    if (!doctors || !Array.isArray(doctors)) return [];

    const specialitiesSet = new Set();
    doctors.forEach((doctor) => {
      if (doctor.specialty && doctor.specialty.trim() !== "") {
        specialitiesSet.add(doctor.specialty);
      }
    });

    // Convert Set to array and sort alphabetically
    return Array.from(specialitiesSet).sort();
  };

  // Extract unique locations from ORIGINAL API data
  const getUniqueLocations = (doctors) => {
    if (!doctors || !Array.isArray(doctors)) return [];

    const locationsSet = new Set();
    doctors.forEach((doctor) => {
      // Check location
      const location = doctor.location;
      if (location && location.trim() !== "" && location !== "Unknown Location") {
        locationsSet.add(location);
      }
    });

    // Convert Set to array and sort alphabetically
    const locationsArray = Array.from(locationsSet).sort();

    // Add fallback if no locations found
    if (locationsArray.length === 0) {
      return ["New York, NY", "Los Angeles, CA"]; // Default fallback
    }

    return locationsArray;
  };

  // Extract unique languages from ORIGINAL API data
  const getUniqueLanguages = (doctors) => {
    if (!doctors || !Array.isArray(doctors)) return [];

    const languagesSet = new Set();
    doctors.forEach((doctor) => {
      if (doctor.languages && Array.isArray(doctor.languages)) {
        doctor.languages.forEach((language) => {
          if (language && language.trim() !== "") {
            languagesSet.add(language);
          }
        });
      }
    });

    // Convert Set to array and sort alphabetically
    const languagesArray = Array.from(languagesSet).sort();

    // Add "English" as default if no languages exist
    if (languagesArray.length === 0) {
      return ["English"];
    }

    return languagesArray;
  };

  // Consultation types for filtering
  const consultationTypes = [
    "Audio Call",
    "Video Call",
    "Instant Counseling",
    "Chat",
  ];
  
  const experiences = ["2+ Years", "5+ Years", "10+ Years", "15+ Years"];
  const availabilityOptions = ["Available Today", "Available Tomorrow"];
  const genders = ["Male", "Female"];

  // Dynamically generate from ORIGINAL API data
  const medicalSpecialities = getUniqueSpecialities(doctorsFromAPI);
  const uniqueLocations = getUniqueLocations(doctorsFromAPI);
  const uniqueLanguages = getUniqueLanguages(doctorsFromAPI);

  // Helper function to get display properties from ORIGINAL doctor data
  const getDisplayProperties = (doctor, index) => {
    // Generate specialty colors based on index for consistent colors
    const specialtyColors = [
      "text-teal",
      "text-info",
      "text-indigo",
      "text-pink",
    ];
    const specialtyColor = specialtyColors[index % specialtyColors.length];

    // Get rating - use from API or default
    const rating = doctor.rating || 4.5;

    // Get next available time - use from API or generate default
    const nextAvailable = doctor.nextAvailable || "10:00 AM - 15 Oct, Tue";

    // Get location - use from API or fallback
    let location = doctor.location;
    if (!location || location.trim() === "") {
      location = popularLocations[index % popularLocations.length] || "Unknown Location";
    }

    // Get image URL - use from API or fallback
    let imageUrl = doctor.image;
    if (!imageUrl || imageUrl.trim() === "") {
      // Use gender-specific placeholder images
      const gender = doctor.gender || "Male";
      if (gender === "Female") {
        imageUrl =
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face";
      } else {
        imageUrl =
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face";
      }
    }

    // Get fee - if 0, use a reasonable default
    const fee = doctor.fee && doctor.fee > 0 ? doctor.fee : 400;

    // Get specialty - ensure it's not empty
    const specialty = doctor.specialty || "General Medicine";

    // Get languages from API or use default
    const languages =
      doctor.languages && Array.isArray(doctor.languages)
        ? doctor.languages
        : ["English"];

    // Get votes - use from API or generate default
    const votes = doctor.votes || "95% (200 / 210 Votes)";

    // Get qualifications
    const qualifications = doctor.qualifications || "MBBS";

    // Get experience
    const experience = doctor.experience || 5;

    // Get availableToday status
    const availableToday = doctor.availableToday !== undefined ? doctor.availableToday : true;

    // Get duration
    const duration = doctor.duration || "30 Min";

    // Get gender
    const gender = doctor.gender || "Male";

    // Get name
    const name = doctor.name || "Dr. Unknown";

    // Get ID
    const id = doctor.id || index + 1;

    return {
      id: id,
      name: name,
      specialty: specialty,
      rating: parseFloat(rating.toFixed(1)),
      location: location,
      duration: duration,
      fee: fee,
      gender: gender,
      experience: experience,
      languages: languages,
      availableToday: availableToday,
      nextAvailable: nextAvailable,
      qualifications: qualifications,
      votes: votes,
      image: imageUrl,
      specialtyColor: specialtyColor,
    };
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        specialityRef.current &&
        !specialityRef.current.contains(event.target)
      ) {
        setShowSpecialitiesDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect to handle when search parameters are passed from home page
  useEffect(() => {
    if (searchParams.searchQuery || searchParams.locationQuery) {
      console.log("Processing search params from Home:", searchParams);

      // Set both input values and applied filters
      setSearchInput(searchParams.searchQuery || "");
      setLocationInput(searchParams.locationQuery || "");
      setAppliedSearch(searchParams.searchQuery || "");
      setAppliedLocation(searchParams.locationQuery || "");
    }
  }, [searchParams]);

  // Handle speciality selection from dropdown - UPDATED: Only updates input, not applied filter
  const handleSpecialitySelect = (speciality) => {
    setSearchInput(speciality);
    // Removed: setAppliedSearch(speciality); - No auto-apply anymore
    setShowSpecialitiesDropdown(false);
  };

  // Handle location selection from dropdown - UPDATED: Only updates input, not applied filter
  const handleLocationSelect = (location) => {
    setLocationInput(location);
    // Removed: setAppliedLocation(location); - No auto-apply anymore
    setShowLocationsDropdown(false);
  };

  // Handle speciality input click
  const handleSpecialityInputClick = () => {
    setShowSpecialitiesDropdown(true);
    setShowLocationsDropdown(false);
  };

  // Handle location input click
  const handleLocationInputClick = () => {
    setShowLocationsDropdown(true);
    setShowSpecialitiesDropdown(false);
  };

  // Handle search button click - UPDATED: Applies both input values to filters
  const handleSearch = (e) => {
    e.preventDefault();
    // Apply the search filters only when button is clicked
    setAppliedSearch(searchInput);
    setAppliedLocation(locationInput);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter doctors based on ORIGINAL API data
  const filteredDoctors = doctorsFromAPI.filter((doctor, index) => {
    const displayProps = getDisplayProperties(doctor, index);
    
    console.log(
      "Filtering doctor:",
      doctor.name,
      "with specialty:",
      doctor.specialty
    );

    // Speciality filter (using APPLIED search, not input)
    const specialityLower = appliedSearch.toLowerCase();
    const matchesSpeciality =
      appliedSearch === "" ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(specialityLower)) ||
      (doctor.name && doctor.name.toLowerCase().includes(specialityLower)) ||
      (doctor.qualifications &&
        doctor.qualifications.toLowerCase().includes(specialityLower));

    // Location filter (using APPLIED location, not input)
    const locationLower = appliedLocation.toLowerCase();
    const doctorLocation = doctor.location || displayProps.location;
    const matchesLocation =
      appliedLocation === "" ||
      doctorLocation.toLowerCase().includes(locationLower);

    // Checkbox filters - SPECIALITIES FILTER
    const doctorSpecialty = doctor.specialty || displayProps.specialty;
    const matchesCheckboxSpecialities =
      filters.specialities.length === 0 ||
      filters.specialities.includes(doctorSpecialty);

    // Checkbox filters - LOCATIONS FILTER
    const matchesCheckboxLocations =
      filters.locations.length === 0 ||
      filters.locations.includes(doctorLocation);

    // Gender filter
    const doctorGender = doctor.gender || displayProps.gender;
    const matchesGender =
      filters.gender.length === 0 ||
      filters.gender.includes(doctorGender);

    // Availability filter
    const doctorAvailableToday = doctor.availableToday !== undefined ? doctor.availableToday : displayProps.availableToday;
    const matchesAvailability =
      filters.availability.length === 0 ||
      (filters.availability.includes("Available Today") &&
        doctorAvailableToday) ||
      (filters.availability.includes("Available Tomorrow") &&
        !doctorAvailableToday);

    // Languages filter - check if doctor has ANY of the selected languages
    const doctorLanguages = doctor.languages || displayProps.languages;
    const matchesLanguages =
      filters.languages.length === 0 ||
      filters.languages.some((lang) =>
        doctorLanguages.some(
          (doctorLang) => doctorLang.toLowerCase() === lang.toLowerCase()
        )
      );

    // Experience filter
    const doctorExperience = doctor.experience || displayProps.experience;
    const matchesExperience =
      filters.experience.length === 0 ||
      (filters.experience.includes("2+ Years") && doctorExperience >= 2) ||
      (filters.experience.includes("5+ Years") && doctorExperience >= 5) ||
      (filters.experience.includes("10+ Years") && doctorExperience >= 10) ||
      (filters.experience.includes("15+ Years") && doctorExperience >= 15);

    const result =
      matchesSpeciality &&
      matchesLocation &&
      matchesCheckboxSpecialities &&
      matchesCheckboxLocations &&
      matchesGender &&
      matchesAvailability &&
      matchesLanguages &&
      matchesExperience;

    console.log("Final result for", doctor.name, ":", result);
    return result;
  });

  console.log("Filtered doctors count:", filteredDoctors.length);

  // Sort doctors based on display properties
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    const displayA = getDisplayProperties(a, doctorsFromAPI.indexOf(a));
    const displayB = getDisplayProperties(b, doctorsFromAPI.indexOf(b));
    
    if (filters.sortBy === "price-low") {
      return displayA.fee - displayB.fee;
    } else if (filters.sortBy === "price-high") {
      return displayB.fee - displayA.fee;
    } else if (filters.sortBy === "rating") {
      return displayB.rating - displayA.rating;
    }
    return 0;
  });

  // Pagination - Reset to page 1 when APPLIED filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearch, appliedLocation, filters]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = sortedDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (category, value) => {
    console.log("Filter change:", category, value);
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
      locations: [],
      experience: [],
      sortBy: "price-low",
    });
    // Clear both input and applied filters
    setSearchInput("");
    setLocationInput("");
    setAppliedSearch("");
    setAppliedLocation("");
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // List View Doctor Card - Uses ORIGINAL doctor data
  const DoctorCardList = ({ doctor }) => {
    const index = doctorsFromAPI.findIndex(d => d.id === doctor.id);
    const displayProps = getDisplayProperties(doctor, index !== -1 ? index : 0);
    
    const handleViewProfile = (e) => {
      e.stopPropagation();
      navigate('/doctor-profile', {
        state: { doctor: doctor } // Pass ORIGINAL doctor data
      });
    };

    const handleBookAppointment = (e) => {
      e.stopPropagation();
      navigate("/booking", {
        state: { doctor: doctor } // Pass ORIGINAL doctor data
      });
    };

    return (
      <div className="col-lg-12">
        <div
          className="card doctor-list-card"
          onClick={handleViewProfile}
          style={{cursor:"pointer"}}
        >
          <div className="d-md-flex align-items-center">
            {/* Doctor Image */}
            <div className="card-img card-img-hover">
              <img alt={displayProps.name} src={displayProps.image} />
              <div className="grid-overlay-item d-flex align-items-center justify-content-between">
                <span className="badge bg-orange">
                  <Star size={12} className="me-1" />
                  {displayProps.rating}
                </span>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="card-body p-0">
              {/* Specialty and Availability */}
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <span className={`${displayProps.specialtyColor} fw-medium fs-14`}>
                  {displayProps.specialty}
                </span>
                <span
                  className={`badge ${
                    displayProps.availableToday
                      ? "bg-success-light"
                      : "bg-danger-light"
                  } d-inline-flex align-items-center`}
                >
                  <span className="dot me-1"></span>
                  {displayProps.availableToday ? "Available" : "Unavailable"}
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
                          {displayProps.name}
                          <span className="tick-circle text-success ms-2">
                            ✓
                          </span>
                        </h6>
                        <p className="mb-2">
                          {displayProps.qualifications} -{" "}
                          <span>{displayProps.specialty}</span>
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <MapPin size={14} className="me-2" />
                          {displayProps.location}
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
                          {displayProps.languages.join(", ")}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <span className="like-icon me-2">👍</span>
                          {displayProps.votes}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <span className="experience-icon me-2">📚</span>
                          {displayProps.experience} Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Fees and Booking */}
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <p className="">
                      Next available at <br />
                      {displayProps.nextAvailable}
                    </p>
                  </div>
                  <button
                    onClick={handleBookAppointment}
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <Calendar size={14} className="me-2" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grid View Doctor Card - Uses ORIGINAL doctor data
  const DoctorCardGrid = ({ doctor }) => {
    const index = doctorsFromAPI.findIndex(d => d.id === doctor.id);
    const displayProps = getDisplayProperties(doctor, index !== -1 ? index : 0);
    
    const handleViewProfile = (e) => {
      e.stopPropagation();
      navigate('/doctor-profile', {
        state: { doctor: doctor } // Pass ORIGINAL doctor data
      });
    };

    const handleBookNow = (e) => {
      e.stopPropagation();
      navigate("/booking", {
        state: { doctor: doctor } // Pass ORIGINAL doctor data
      });
    };

    const handleViewProfileClick = (e) => {
      e.stopPropagation();
      navigate('/doctor-profile', {
        state: { doctor: doctor } // Pass ORIGINAL doctor data
      });
    };

    return (
      <div className="col-lg-4 col-md-6 mb-4">
        <div
          className="allDoctors-doctor-card"
          onClick={handleViewProfile}
        >
          <div className="allDoctors-doctor-image-wrapper">
            <img
              src={displayProps.image}
              alt={displayProps.name}
              className="allDoctors-doctor-image"
            />
            <div className="allDoctors-rating-badge">
              <Star size={14} className="allDoctors-star" />
              {displayProps.rating}
            </div>

            {/* <h4 className="text-orange-viewGrid">$ {displayProps.fee}</h4> */}
          </div>

          <div className="allDoctors-doctor-info">
            <div className="allDoctors-specialty-status">
              <span className="allDoctors-specialty">{displayProps.specialty}</span>
              <span
                className={`allDoctors-status ${
                  displayProps.availableToday ? "available" : "unavailable"
                }`}
              >
                ● {displayProps.availableToday ? "Available" : "Unavailable"}
              </span>
            </div>

            <h5 className="allDoctors-doctor-name">{displayProps.name}</h5>

            <div className="allDoctors-doctor-details">
              <MapPin size={14} className="allDoctors-icon" />
              <span>
                {displayProps.location} • {displayProps.duration}
              </span>
            </div>

            <div className="allDoctors-doctor-footer">
              <div>
                <button
                  className="btn-view-profile btn-primary-gradient rounded-pill"
                  onClick={handleViewProfileClick}
                >
                  View Profile
                </button>
              </div>
              <button
                className="btn-primary-gradient rounded-pill"
                onClick={handleBookNow}
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
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      <span className="allDoctors-checkmark"></span>
      <span className="allDoctors-filter-label">{label}</span>
      {count && <span className="allDoctors-filter-count">({count})</span>}
    </label>
  );

  // Check if data is loading
  if (doctorsState?.loading) {
    return (
      <div className="allDoctors-container">
        <div className="container-fluid">
          <div className="allDoctors-header">
            <h1 className="allDoctors-main-title">
              Search for Doctors, Hospitals, Clinics
            </h1>
          </div>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if there's an error
  if (doctorsState?.error) {
    return (
      <div className="allDoctors-container">
        <div className="container-fluid">
          <div className="allDoctors-header">
            <h1 className="allDoctors-main-title">
              Search for Doctors, Hospitals, Clinics
            </h1>
          </div>
          <div className="alert alert-danger mt-4" role="alert">
            <h4 className="alert-heading text-center">Error loading doctors</h4>
            <p>
              {doctorsState.error.message ||
                "Failed to load doctors. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              {/* Speciality Selection Dropdown */}
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
                    value={searchInput}
                    readOnly
                    onClick={handleSpecialityInputClick}
                  />
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowSpecialitiesDropdown(!showSpecialitiesDropdown)
                    }
                  >
                    <HiChevronDownIcon size={16} />
                  </button>

                  {showSpecialitiesDropdown && (
                    <div className="selection-dropdown-menu">
                      <div className="selection-list-container">
                        <div className="selection-header">
                          <span>What</span>
                          <h4>Search Doctors, Conditions, or</h4>
                        </div>
                        {medicalSpecialities.length > 0 ? (
                          medicalSpecialities.map((speciality, index) => (
                            <div
                              key={index}
                              className={`selection-option ${
                                searchInput === speciality ? "selected" : ""
                              }`}
                              onClick={() => handleSpecialitySelect(speciality)}
                            >
                              <span className="option-text">{speciality}</span>
                            </div>
                          ))
                        ) : (
                          <div className="selection-option">
                            <span className="option-text">
                              No specialities available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Selection Dropdown */}
              <div
                className="search-input-wrapper location-input"
                ref={locationRef}
              >
                <i className="search-icon">
                  <MapPin size={20} />
                </i>
                <div className="selection-input-container">
                  <input
                    type="text"
                    className="selection-input"
                    placeholder="Select Location"
                    value={locationInput}
                    readOnly
                    onClick={handleLocationInputClick}
                  />
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowLocationsDropdown(!showLocationsDropdown)
                    }
                  >
                    <HiChevronDownIcon size={16} />
                  </button>

                  {showLocationsDropdown && (
                    <div className="selection-dropdown-menu">
                      <div className="selection-list-container">
                        <div className="selection-header">
                          <span>Where</span>
                          <h4>Select Location</h4>
                        </div>
                        {/* Show unique locations from backend, fallback to popular locations */}
                        {(uniqueLocations.length > 0
                          ? uniqueLocations
                          : popularLocations
                        ).map((location, index) => (
                          <div
                            key={index}
                            className={`selection-option ${
                              locationInput === location ? "selected" : ""
                            }`}
                            onClick={() => handleLocationSelect(location)}
                          >
                            <span className="option-text">{location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                  {medicalSpecialities.length > 0 ? (
                    medicalSpecialities.map((speciality) => (
                      <FilterCheckbox
                        key={speciality}
                        label={speciality}
                        checked={filters.specialities.includes(speciality)}
                        onChange={() =>
                          handleFilterChange("specialities", speciality)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-muted small p-2">
                      No specialities available
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* NEW: Locations Filter Section */}
              <FilterSection
                title="Locations"
                sectionKey="locations"
                scrollable={true}
              >
                <div className="specialities-scroll-container">
                  {uniqueLocations.length > 0 ? (
                    uniqueLocations.map((location) => (
                      <FilterCheckbox
                        key={location}
                        label={location}
                        checked={filters.locations.includes(location)}
                        onChange={() =>
                          handleFilterChange("locations", location)
                        }
                      />
                    ))
                  ) : (
                    <div className="text-muted small p-2">
                      No locations available
                    </div>
                  )}
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
                {uniqueLanguages.length > 0 ? (
                  uniqueLanguages.map((language) => (
                    <FilterCheckbox
                      key={language}
                      label={language}
                      checked={filters.languages.includes(language)}
                      onChange={() => handleFilterChange("languages", language)}
                    />
                  ))
                ) : (
                  <div className="text-muted small p-2">
                    No languages available
                  </div>
                )}
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
                    {doctorsFromAPI.length === 0 ? (
                      "No doctors found in the database"
                    ) : (
                      <>
                        Showing {currentDoctors.length} of{" "}
                        {sortedDoctors.length} Doctors
                        {appliedSearch && (
                          <span className="search-query-info">
                            {" "}
                            for "{appliedSearch}"
                          </span>
                        )}
                        {appliedLocation && (
                          <span className="location-query-info">
                            {" "}
                            in "{appliedLocation}"
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </div>
                {doctorsFromAPI.length > 0 && (
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
                )}
              </div>

              {/* Doctors List/Grid */}
              <div className="row">
                {doctorsFromAPI.length === 0 ? (
                  <div className="col-12">
                    <div className="allDoctors-no-results">
                      <h3>No doctors found in the database</h3>
                      <p>Please check back later or contact support</p>
                      <div className="mt-3">
                        <p className="text-muted small">
                          Debug Info: Doctors array is empty. Check if data is
                          being fetched properly.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : currentDoctors.length > 0 ? (
                  currentDoctors.map((doctor) =>
                    viewMode === "grid" ? (
                      <DoctorCardGrid key={doctor.id || `doctor-${doctor.name}`} doctor={doctor} />
                    ) : (
                      <DoctorCardList key={doctor.id || `doctor-${doctor.name}`} doctor={doctor} />
                    )
                  )
                ) : (
                  <div className="col-12">
                    <div className="allDoctors-no-results">
                      <h3>No doctors match your criteria</h3>
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