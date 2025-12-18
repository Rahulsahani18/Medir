import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  LogOut,
  User,
  Loader2,
  Video,
  Phone,
  MessageSquare,
  Building,
  HeartPulse,
  MessagesSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  setTemporaryAvatar,
  clearTemporaryAvatar,
  updateProfileLocally,
  updateFieldImmediately,
  clearUserProfile,
  updateLocationIds,
  updateAddressLocally,
} from "../Redux/userSlice";
import { logout } from "../Redux/authSlice";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
  resetLocationData,
} from "../Redux/locationSlice";
import { fetchAppointments } from "../Redux/appointmentSlice";
import DietAndHealth from "../Cancer Care Module/Diet_health_Advisory";
import SupportGroups from "../Support Groups/SupportGroups";
import "../User/userProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfileSettings = () => {
  const dispatch = useDispatch();
  const {
    profile,
    loading,
    updateLoading,
    uploadLoading,
    tempAvatar,
    locationIds,
  } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    countries,
    states,
    cities,
    loading: locationLoading,
  } = useSelector((state) => state.location);

  // Get appointments from Redux
  const { appointments: realAppointments, loading: appointmentsLoading } =
    useSelector((state) => state.appointment);

  const fileInputRef = useRef(null);

  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("view");
  const [activeAddressTab, setActiveAddressTab] = useState("view");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [appointmentsFetched, setAppointmentsFetched] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(9);

  const navigate = useNavigate();

  // Form states
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
  });

  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // Store original data for revert
  const [originalProfileData, setOriginalProfileData] = useState(null);
  const [originalAddressData, setOriginalAddressData] = useState(null);

  // Store selected IDs
  const [selectedIds, setSelectedIds] = useState({
    city_id: "",
    state_id: "",
    country_id: "",
  });

  // Gender mapping
  const genderMapping = {
    2: "Female",
    1: "Male",
    3: "Other",
  };

  const reverseGenderMapping = {
    Female: "2",
    Male: "1",
    Other: "3",
  };

  // Format appointment data for display
  // Format appointment data for display
  const formatAppointments = useCallback(() => {
    if (!realAppointments || !realAppointments.length) return [];

    const formatted = realAppointments.map((appointment) => {
      const doctor = appointment.doctor || {};
      const consultationType = appointment.consultation_type || {};

      // Format date and time
      const appointmentDate = new Date(appointment.appointment_date);
      const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Format time slot
      const timeParts = appointment.time_slot?.split(":") || [];
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1] || "00";
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      // Create a Date object for sorting (combine date and time)
      const appointmentDateTime = new Date(
        appointment.appointment_date + "T" + appointment.time_slot
      );
      const now = new Date();
      const isUpcoming = appointmentDateTime > now;
      const status = isUpcoming ? "Upcoming" : "Completed";

      // Determine status class for styling
      let statusClass = "upcoming";

      // Get doctor's phone from contact info
      const doctorPhone =
        doctor.profile?.contact?.phone || doctor.phone || "N/A";
      const doctorEmail = doctor.profile?.contact?.email || "N/A";

      // Get clinic name and location
      const clinicName = doctor.clinic_name || "Clinic";
      const doctorLocation = doctor.location || "Location not available";

      // Get consultation fee
      const consultationFee =
        consultationType.fee !== undefined
          ? `$${consultationType.fee}`
          : doctor.fee !== undefined
          ? `$${doctor.fee}`
          : "$0";

      // Get doctor's full name
      const doctorName =
        doctor.name ||
        `Dr. ${doctor.first_name || ""} ${doctor.last_name || ""}`.trim() ||
        "Unknown Doctor";

      // Determine appointment type and icon
      const appointmentType = consultationType.name || "Clinic";

      // Determine icon based on appointment type - Using Lucide React components
      let AppointmentIcon = Building; // default icon for clinic
      let iconColor = "#28a745"; // default green

      if (appointmentType.toLowerCase().includes("video")) {
        AppointmentIcon = Video;
        iconColor = "#007bff"; // blue for video
      } else if (appointmentType.toLowerCase().includes("audio")) {
        AppointmentIcon = Phone;
        iconColor = "#6f42c1"; // purple for audio
      } else if (appointmentType.toLowerCase().includes("chat")) {
        AppointmentIcon = MessageSquare;
        iconColor = "#fd7e14"; // orange for chat
      } else {
        AppointmentIcon = Building;
        iconColor = "#28a745"; // green for clinic
      }

      return {
        id: appointment.id || "N/A",
        appointmentNumber: `#Apt${appointment.id.toString().padStart(4, "0")}`,
        doctorName: doctorName,
        email: doctorEmail,
        phone: doctorPhone,
        image:
          doctor.image ||
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
        appointmentType: appointmentType,
        AppointmentIcon: AppointmentIcon,
        iconColor: iconColor,
        consultationFees: consultationFee,
        status: status,
        statusClass: statusClass,
        dateTime: `${formattedDate} - ${formattedTime}`,
        clinicLocation: clinicName,
        location: doctorLocation,
        visitType: appointmentType,
        symptoms: appointment.symptoms || "",
        reasonForVisit: appointment.reason_for_visit || "",
        patientType: appointment.patient_type || "self",
        originalData: appointment,
        // Add these for sorting
        appointmentDateTime: appointmentDateTime,
        isUpcoming: isUpcoming,
        rawDate: appointment.appointment_date,
        rawTime: appointment.time_slot,
      };
    });

    // Sort appointments: upcoming first (by date), then completed (by date descending - most recent completed first)
    return formatted.sort((a, b) => {
      // If both are upcoming or both are completed
      if (a.isUpcoming === b.isUpcoming) {
        if (a.isUpcoming) {
          // Both upcoming: sort by date ascending (earliest first)
          return a.appointmentDateTime - b.appointmentDateTime;
        } else {
          // Both completed: sort by date descending (most recent first)
          return b.appointmentDateTime - a.appointmentDateTime;
        }
      }

      // Upcoming appointments come before completed
      if (a.isUpcoming && !b.isUpcoming) return -1;
      if (!a.isUpcoming && b.isUpcoming) return 1;

      return 0;
    });
  }, [realAppointments]);

  // Get appointments for display
  const displayAppointments = formatAppointments();

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = displayAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(
    displayAppointments.length / appointmentsPerPage
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    if (tempAvatar) return tempAvatar;
    return (
      profile?.avatar ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    );
  };

  // Toast configuration
  const showToast = {
    success: (message) => {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    error: (message) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    info: (message) => {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  };

  // Helper to find ID by name
  const findIdByName = useCallback((items, name) => {
    if (!name || !items.length) return "";
    const exactMatch = items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return exactMatch?.id || "";
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      dispatch(fetchUserProfile())
        .then(() => {
          setHasLoaded(true);
        })
        .catch((error) => {
          showToast.error(error.message || "Failed to load profile");
          setHasLoaded(true);
        });
    }
  }, [dispatch, isAuthenticated, hasLoaded]);

  // Fetch countries on mount
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // Fetch appointments when appointments section is active
  useEffect(() => {
    if (
      isAuthenticated &&
      activeSection === "appointments" &&
      !appointmentsFetched
    ) {
      dispatch(fetchAppointments())
        .unwrap()
        .then(() => {
          setAppointmentsFetched(true);
        })
        .catch((error) => {
          showToast.error(error.message || "Failed to load appointments");
        });
    }
  }, [dispatch, isAuthenticated, activeSection, appointmentsFetched]);

  // Reset appointments fetched flag when section changes
  useEffect(() => {
    if (activeSection !== "appointments") {
      setAppointmentsFetched(false);
      setCurrentPage(1); // Reset to first page when leaving appointments section
    }
  }, [activeSection]);

  // Process profile data when loaded
  useEffect(() => {
    if (profile && hasLoaded && countries.length > 0 && !initialDataLoaded) {
      console.log("Processing profile data:", profile);

      // Set profile form data
      setProfileData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        mobile: profile.mobile || "",
        email: profile.email || "",
        dob: profile.dob === "0000-00-00" || !profile.dob ? "" : profile.dob,
        gender: profile.gender || "",
      });

      // Set address form data from profile
      setAddressData({
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        pincode: profile.pincode || "",
      });

      // Store original data
      setOriginalProfileData({ ...profile });

      // Find country ID by name
      const countryId = findIdByName(countries, profile.country);
      console.log("Found country ID:", countryId, "for:", profile.country);

      if (countryId) {
        // Store country ID
        setSelectedIds((prev) => ({ ...prev, country_id: countryId }));
        dispatch(updateLocationIds({ country_id: countryId }));

        // Fetch states for this country
        dispatch(fetchStates(countryId))
          .unwrap()
          .then((statesData) => {
            const stateId = findIdByName(statesData, profile.state);
            console.log("Found state ID:", stateId, "for:", profile.state);

            if (stateId) {
              setSelectedIds((prev) => ({ ...prev, state_id: stateId }));
              dispatch(updateLocationIds({ state_id: stateId }));

              // Fetch cities for this state
              dispatch(fetchCities(stateId))
                .unwrap()
                .then((citiesData) => {
                  const cityId = findIdByName(citiesData, profile.city);
                  console.log("Found city ID:", cityId, "for:", profile.city);

                  if (cityId) {
                    setSelectedIds((prev) => ({ ...prev, city_id: cityId }));
                    dispatch(updateLocationIds({ city_id: cityId }));
                  }
                });
            }
          });
      }

      setInitialDataLoaded(true);
    }
  }, [
    profile,
    hasLoaded,
    countries,
    dispatch,
    initialDataLoaded,
    findIdByName,
  ]);

  // Clean up temp avatar URL on unmount
  useEffect(() => {
    return () => {
      if (tempAvatar) {
        URL.revokeObjectURL(tempAvatar);
      }
    };
  }, [tempAvatar]);

  // Handlers (keep existing code for profile and address)
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    dispatch(updateFieldImmediately({ field: name, value: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setSelectedIds((prev) => ({ ...prev, [name]: value }));
    dispatch(updateLocationIds({ [name]: value }));

    if (name === "country_id" && value) {
      setSelectedIds((prev) => ({ ...prev, state_id: "", city_id: "" }));
      dispatch(updateLocationIds({ state_id: "", city_id: "" }));
      dispatch(resetLocationData());
      setAddressData((prev) => ({ ...prev, state: "", city: "" }));
      dispatch(fetchStates(value));
    } else if (name === "state_id" && value) {
      setSelectedIds((prev) => ({ ...prev, city_id: "" }));
      dispatch(updateLocationIds({ city_id: "" }));
      setAddressData((prev) => ({ ...prev, city: "" }));
      dispatch(fetchCities(value));
    }
  };

  const handleSaveProfileChanges = () => {
    setOriginalProfileData({ ...profile });
    const genderValue = reverseGenderMapping[profileData.gender] || "2";

    const updateData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      mobile: profileData.mobile,
      email: profileData.email,
      dob: profileData.dob || "0000-00-00",
      gender: genderValue,
    };

    console.log("Sending profile update:", updateData);

    dispatch(updateProfileLocally(updateData));
    dispatch(updateUserProfile(updateData))
      .unwrap()
      .then((result) => {
        showToast.success(result.message || "Profile updated successfully!");
        setActiveProfileTab("view");
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        if (originalProfileData) {
          dispatch(updateProfileLocally(originalProfileData));
        }
        showToast.error(err.message || "Update failed. Please try again.");
      });
  };

  const handleSaveAddressChanges = () => {
    setOriginalAddressData({ ...profile });

    const updateData = {
      address: addressData.address,
      city: selectedIds.city_id,
      state: selectedIds.state_id,
      country: selectedIds.country_id,
      pincode: addressData.pincode,
    };

    console.log("Sending address update with IDs:", updateData);

    dispatch(
      updateAddressLocally({
        address: addressData.address,
        pincode: addressData.pincode,
      })
    );

    dispatch(updateUserProfile(updateData))
      .unwrap()
      .then((result) => {
        showToast.success(result.message || "Address updated successfully!");
        setActiveAddressTab("view");
        setTimeout(() => {
          dispatch(fetchUserProfile());
        }, 1000);
      })
      .catch((err) => {
        console.error("Address update error:", err);
        if (originalAddressData) {
          dispatch(updateProfileLocally(originalAddressData));
        }
        showToast.error(err.message || "Update failed. Please try again.");
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserProfile());
    showToast.info("Logged out successfully");
    navigate("/");
  };

  const handleCancel = () => {
    if (activeSection === "profile") {
      if (originalProfileData) {
        dispatch(updateProfileLocally(originalProfileData));
      }
      setActiveProfileTab("view");
      showToast.info("Changes discarded");
    } else if (activeSection === "address") {
      if (originalAddressData) {
        dispatch(updateProfileLocally(originalAddressData));
      }
      setActiveAddressTab("view");
      showToast.info("Changes discarded");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast.error("File size should be less than 4MB");
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      showToast.error("Only JPG, PNG, and SVG files are allowed");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    dispatch(setTemporaryAvatar(previewUrl));

    try {
      const result = await dispatch(uploadProfilePhoto(file)).unwrap();
      showToast.success(
        result.message || "Profile photo uploaded successfully!"
      );
      fileInputRef.current.value = "";
    } catch (error) {
      console.log("Upload error:", error);
      dispatch(clearTemporaryAvatar());
      setTimeout(async () => {
        try {
          await dispatch(fetchUserProfile()).unwrap();
          showToast.success("Profile photo updated successfully!");
        } catch (refreshError) {
          showToast.error("Please refresh the page to see if upload succeeded");
        }
      }, 1000);
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    dispatch(clearTemporaryAvatar());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast.info("Local preview removed.");
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const displayValue = (value) =>
    value && value !== "0000-00-00" && value !== "null" && value !== "undefined"
      ? value
      : "Not set";

  const calculateAge = (dob) => {
    if (!dob || dob === "0000-00-00") return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const getDisplayGender = () => {
    if (!profile?.gender) return "Not set";
    return genderMapping[profile.gender] || profile.gender;
  };

  const getFullAddress = () => {
    const parts = [];
    if (profile?.address) parts.push(profile.address);
    if (profile?.city) parts.push(profile.city);
    if (profile?.state) parts.push(profile.state);
    if (profile?.country) parts.push(profile.country);
    if (profile?.pincode) parts.push(`Pincode: ${profile.pincode}`);

    return parts.join(", ") || "No address provided";
  };

  // Loading & auth guards
  if (loading && !hasLoaded) {
    return (
      <div
        className="userProfileContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f7fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #007bff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p style={{ color: "#1a2332" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="userProfileContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f7fa",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#1a2332" }}>Please Login</h3>
          <p style={{ color: "#6c757d" }}>
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/auth")}
            style={{
              padding: "12px 30px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile && hasLoaded) {
    return (
      <div
        className="userProfileContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#f5f7fa",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#1a2332" }}>No Profile Data</h3>
          <p style={{ color: "#6c757d" }}>
            Unable to load profile data. Please try again.
          </p>
          <button
            onClick={() => {
              setHasLoaded(false);
              dispatch(fetchUserProfile());
            }}
            style={{
              padding: "12px 30px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            style={{
              padding: "12px 30px",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${profile?.first_name || ""} ${
    profile?.last_name || ""
  }`.trim();
  const age = calculateAge(profile?.dob);
  const displayAge = age ? `${age} years` : "";

  return (
    <div className="userProfileContainer">
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="userProfileWrapper">
        {/* Sidebar */}
        <aside className="userProfileSidebar">
          <div className="userProfileHeader">
            <div className="userProfileAvatar">
              <img src={getAvatarUrl()} alt="Profile" />
            </div>
            <h3 className="userProfileName">{fullName || "User"}</h3>
            <p className="userProfileId">
              Patient ID: {profile?.id ? `PT${profile.id}` : "Not assigned"}
            </p>
            <p className="userProfileInfo">
              {profile?.gender &&
              profile.gender !== "Other" &&
              profile.gender !== "null"
                ? getDisplayGender()
                : ""}
              {displayAge ? ` • ${displayAge}` : ""}
            </p>
          </div>

          <nav className="userProfileMenu">
            <div
              className={`userProfileMenuItem ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <User className="userProfileMenuIcon" size={20} /> My Profile
            </div>
            <div
              className={`userProfileMenuItem ${
                activeSection === "address" ? "active" : ""
              }`}
              onClick={() => setActiveSection("address")}
            >
              <MapPin className="userProfileMenuIcon" size={20} /> Address
            </div>
            <div
              className={`userProfileMenuItem ${
                activeSection === "appointments" ? "active" : ""
              }`}
              onClick={() => setActiveSection("appointments")}
            >
              <Calendar className="userProfileMenuIcon" size={20} /> My
              Appointments
            </div>
            <div
              className={`userProfileMenuItem ${
                activeSection === "Diet & Health" ? "active" : ""
              }`}
              onClick={() => setActiveSection("Diet & Health")}
            >
              <HeartPulse className="userProfileMenuIcon" size={20} /> Diet &
              Health Advisory
            </div>

            <div
              className={`userProfileMenuItem ${
                activeSection === "Support Groups" ? "active" : ""
              }`}
              onClick={() => setActiveSection("Support Groups")}
            >
              <MessagesSquare className="userProfileMenuIcon" size={20} />{" "}
              Support Groups
            </div>

            <div className="userProfileMenuItem" onClick={handleLogout}>
              <LogOut className="userProfileMenuIcon" size={20} /> Logout
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="userProfileContent">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <>
              <h2 className="userProfileTitle">Profile Settings</h2>
              <div className="userProfileTabs">
                <button
                  type="button"
                  className={`userProfileTab ${
                    activeProfileTab === "view" ? "active" : ""
                  }`}
                  onClick={() => setActiveProfileTab("view")}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className={`userProfileTab ${
                    activeProfileTab === "update" ? "active" : ""
                  }`}
                  onClick={() => setActiveProfileTab("update")}
                >
                  Update Profile
                </button>
              </div>

              {activeProfileTab === "view" ? (
                <div className="userProfileViewCard">
                  <div className="userProfileViewRow">
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">First Name</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.first_name)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Last Name</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.last_name)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">
                        Date of Birth
                      </span>
                      <span className="userProfileViewValue">
                        {formatDate(profile?.dob)}
                      </span>
                    </div>
                  </div>
                  <div className="userProfileViewRow">
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Phone Number</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.mobile)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">
                        Email Address
                      </span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.email)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Gender</span>
                      <span className="userProfileViewValue">
                        {getDisplayGender()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Photo Upload */}
                  <div className="userProfileSection">
                    <h3 className="userProfileSectionTitle">Profile Photo</h3>
                    <div className="userProfilePhotoUpload">
                      <div className="userProfilePhotoPreview">
                        {getAvatarUrl() ? (
                          <img
                            src={getAvatarUrl()}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        )}
                      </div>
                      <div className="userProfilePhotoInfo">
                        <div className="userProfilePhotoButtons">
                          <button
                            type="button"
                            className="userProfileUploadBtn"
                            onClick={handleUploadClick}
                            disabled={uploadLoading}
                          >
                            {uploadLoading ? (
                              <>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    border: "2px solid #5582ffff",
                                    borderTop: "2px solid transparent",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    marginRight: "6px",
                                    verticalAlign: "middle",
                                  }}
                                ></span>
                                Uploading...
                              </>
                            ) : (
                              "Upload New"
                            )}
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                            style={{ display: "none" }}
                          />
                        </div>
                        <p className="userProfilePhotoNote">
                          Your Image should Below 4 MB, Accepted format
                          jpg,png,svg
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="userProfileSection">
                    <h3 className="userProfileSectionTitle">Information</h3>
                    <div className="userProfileFormRow">
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">
                          First Name <span>*</span>
                        </label>
                        <input
                          type="text"
                          className="userProfileInput"
                          name="first_name"
                          value={profileData.first_name}
                          onChange={handleProfileInputChange}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">
                          Last Name <span>*</span>
                        </label>
                        <input
                          type="text"
                          className="userProfileInput"
                          name="last_name"
                          value={profileData.last_name}
                          onChange={handleProfileInputChange}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="userProfileInput"
                          name="dob"
                          value={profileData.dob}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                    </div>
                    <div className="userProfileFormRow">
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">
                          Phone Number <span>*</span>
                        </label>
                        <input
                          type="tel"
                          className="userProfileInput"
                          name="mobile"
                          value={profileData.mobile}
                          onChange={handleProfileInputChange}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">
                          Email Address <span>*</span>
                        </label>
                        <input
                          type="email"
                          className="userProfileInput"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">Gender</label>
                        <select
                          className="userProfileSelect"
                          name="gender"
                          value={profileData.gender}
                          onChange={handleProfileInputChange}
                        >
                          <option>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="userProfileActions">
                    <button
                      type="button"
                      className="userProfileCancelBtn"
                      onClick={handleCancel}
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="userProfileSaveBtn"
                      onClick={handleSaveProfileChanges}
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <>
                          <span
                            style={{
                              display: "inline-block",
                              width: "16px",
                              height: "16px",
                              border: "2px solid #fff",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                              marginRight: "8px",
                              verticalAlign: "middle",
                            }}
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Appointments Section */}
          {activeSection === "appointments" && (
            <>
              <h2 className="userProfileTitle">My Appointments</h2>

              {appointmentsLoading && (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading appointments...</p>
                </div>
              )}

              {!appointmentsLoading && displayAppointments.length === 0 && (
                <div className="aptNoAppointments">
                  <p className="text-center">No appointments found.</p>
                </div>
              )}

              {!appointmentsLoading && displayAppointments.length > 0 && (
                <>
                  {/* Appointment Cards */}
                  <div className="aptAppointmentsGrid">
                    {currentAppointments.map((appointment) => {
                      const { AppointmentIcon, iconColor } = appointment;
                      return (
                        <div
                          key={appointment.id}
                          className="userProfileAppointmentCard"
                        >
                          <div className="userProfileAppointmentHeader">
                            <div className="userProfileDoctorInfo">
                              <div className="userProfileDoctorImage">
                                <img
                                  src={appointment.image}
                                  alt={appointment.doctorName}
                                />
                              </div>
                              <div className="userProfileDoctorDetails">
                                <div className="userProfileAppointmentId">
                                  {appointment.appointmentNumber}
                                </div>
                                <h3 className="userProfileDoctorName">
                                  {appointment.doctorName}
                                </h3>
                                <div className="userProfileContactInfo">
                                  <div className="userProfileContactItem">
                                    <svg
                                      className="userProfileContactIcon"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {appointment.email}
                                  </div>
                                  <div className="userProfileContactItem">
                                    <svg
                                      className="userProfileContactIcon"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    {appointment.phone}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="userProfileAppointmentType">
                              <span className="userProfileTypeLabel">
                                Type of Appointment
                              </span>
                              <div className="userProfileTypeValue">
                                <AppointmentIcon
                                  size={18}
                                  style={{
                                    color: iconColor,
                                    marginRight: "6px",
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                  }}
                                />
                                {appointment.appointmentType}
                              </div>
                            </div>

                            <div className="userProfileAppointmentRight">
                              <span
                                className={`userProfileStatusBadge ${appointment.status.toLowerCase()}`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>

                          <div className="userProfileAppointmentDetails">
                            <div className="userProfileDetailItem">
                              <span className="userProfileDetailLabel">
                                Appointment Date & Time
                              </span>
                              <span className="userProfileDetailValue">
                                {appointment.dateTime}
                              </span>
                            </div>

                            {/* Conditionally show clinic location only for "Clinic" appointments */}
                            {appointment.appointmentType === "Clinic" && (
                              <>
                                <div className="userProfileDetailItem">
                                  <span className="userProfileDetailLabel">
                                    Clinic Location
                                  </span>
                                  <span className="userProfileDetailValue">
                                    {appointment.clinicLocation}
                                  </span>
                                </div>
                                <div className="userProfileDetailItem">
                                  <span className="userProfileDetailLabel">
                                    Location
                                  </span>
                                  <span className="userProfileDetailValue">
                                    {appointment.location}
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="userProfileDetailItem">
                              <span className="userProfileDetailLabel">
                                Visit Type
                              </span>
                              <span className="userProfileDetailValue">
                                {appointment.visitType}
                              </span>
                            </div>

                            {/* Show additional appointment details if available */}
                            {appointment.symptoms && (
                              <div className="userProfileDetailItem">
                                <span className="userProfileDetailLabel">
                                  Symptoms
                                </span>
                                <span className="userProfileDetailValue">
                                  {appointment.symptoms}
                                </span>
                              </div>
                            )}

                            {/* For virtual appointments, show connection info */}
                            {appointment.appointmentType !== "Clinic" && (
                              <div className="userProfileDetailItem">
                                <span className="userProfileDetailLabel">
                                  Connection Type
                                </span>
                                <span className="userProfileDetailValue">
                                  {appointment.appointmentType === "Audio Call"
                                    ? "Voice Call"
                                    : appointment.appointmentType ===
                                      "Video Call"
                                    ? "Video Conference"
                                    : "Chat Session"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination - Using unique class names */}
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
                              cursor:
                                currentPage === 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            Prev
                          </a>
                        </li>

                        {/* Show pages dynamically */}
                        {(() => {
                          const pageItems = [];

                          // Always show first page
                          pageItems.push(
                            <li key="page-1">
                              <a
                                className={`page-link ${
                                  currentPage === 1 ? "active" : ""
                                }`}
                                onClick={() => paginate(1)}
                                style={{ cursor: "pointer" }}
                              >
                                1
                              </a>
                            </li>
                          );

                          // Calculate start and end pages
                          let startPage = Math.max(2, currentPage - 1);
                          let endPage = Math.min(
                            totalPages - 1,
                            currentPage + 1
                          );

                          // Add ellipsis after first page if needed
                          if (startPage > 2) {
                            pageItems.push(
                              <li key="ellipsis-start" className="disabled">
                                <span className="page-link">...</span>
                              </li>
                            );
                          }

                          // Show middle pages
                          for (let i = startPage; i <= endPage; i++) {
                            if (i > 1 && i < totalPages) {
                              pageItems.push(
                                <li key={`page-${i}`}>
                                  <a
                                    className={`page-link ${
                                      currentPage === i ? "active" : ""
                                    }`}
                                    onClick={() => paginate(i)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {i}
                                  </a>
                                </li>
                              );
                            }
                          }

                          // Add ellipsis before last page if needed
                          if (endPage < totalPages - 1) {
                            pageItems.push(
                              <li key="ellipsis-end" className="disabled">
                                <span className="page-link">...</span>
                              </li>
                            );
                          }

                          // Always show last page if there's more than 1 page
                          if (totalPages > 1) {
                            pageItems.push(
                              <li key={`page-${totalPages}`}>
                                <a
                                  className={`page-link ${
                                    currentPage === totalPages ? "active" : ""
                                  }`}
                                  onClick={() => paginate(totalPages)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {totalPages}
                                </a>
                              </li>
                            );
                          }

                          return pageItems;
                        })()}

                        <li>
                          <a
                            className={`page-link next ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                            onClick={() =>
                              currentPage < totalPages &&
                              paginate(currentPage + 1)
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
                </>
              )}
            </>
          )}

          {/* Address Section */}
          {activeSection === "address" && (
            <>
              <h2 className="userProfileTitle">Address Settings</h2>
              <div className="userProfileTabs">
                <button
                  type="button"
                  className={`userProfileTab ${
                    activeAddressTab === "view" ? "active" : ""
                  }`}
                  onClick={() => setActiveAddressTab("view")}
                >
                  View Address
                </button>
                <button
                  type="button"
                  className={`userProfileTab ${
                    activeAddressTab === "update" ? "active" : ""
                  }`}
                  onClick={() => setActiveAddressTab("update")}
                >
                  Update Address
                </button>
              </div>

              {activeAddressTab === "view" ? (
                <div className="userProfileViewCard">
                  <div className="userProfileViewRow">
                    <div
                      className="userProfileViewField"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <span className="userProfileViewLabel">Full Address</span>
                      <span className="userProfileViewValue">
                        {getFullAddress()}
                      </span>
                    </div>
                  </div>
                  <div className="userProfileViewRow">
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Address</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.address)}
                      </span>
                    </div>
                  </div>
                  <div className="userProfileViewRow">
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">City</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.city)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">State</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.state)}
                      </span>
                    </div>
                  </div>
                  <div className="userProfileViewRow">
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Country</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.country)}
                      </span>
                    </div>
                    <div className="userProfileViewField">
                      <span className="userProfileViewLabel">Pincode</span>
                      <span className="userProfileViewValue">
                        {displayValue(profile?.pincode)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="userProfileSection">
                    <div className="userProfileFormRow">
                      <div
                        className="userProfileFormGroup"
                        style={{ gridColumn: "1 / -1" }}
                      >
                        <label className="userProfileLabel">Address</label>
                        <textarea
                          type="text"
                          className="userProfileInput"
                          name="address"
                          value={addressData.address}
                          onChange={handleAddressInputChange}
                          placeholder="Enter full address"
                          style={{
                            resize: "none",
                            height: "60px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="userProfileFormRow">
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">Country</label>
                        <div className="select-wrapper">
                          <select
                            className="userProfileSelect"
                            name="country_id"
                            value={selectedIds.country_id}
                            onChange={handleLocationChange}
                            disabled={
                              locationLoading.countries || updateLoading
                            }
                          >
                            <option value="">Select Country</option>
                            {countries.map((country, index) => (
                              <option
                                key={`country-${country.id}-${index}`}
                                value={country.id}
                              >
                                {country.name}
                              </option>
                            ))}
                          </select>
                          {locationLoading.countries && (
                            <div className="select-loading">
                              <Loader2 size={14} className="loading-spinner" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">State</label>
                        <div className="select-wrapper">
                          <select
                            className="userProfileSelect"
                            name="state_id"
                            value={selectedIds.state_id}
                            onChange={handleLocationChange}
                            disabled={
                              !selectedIds.country_id ||
                              locationLoading.states ||
                              updateLoading
                            }
                          >
                            <option value="">Select State</option>
                            {states.map((state, index) => (
                              <option
                                key={`state-${state.id}-${index}`}
                                value={state.id}
                              >
                                {state.name}
                              </option>
                            ))}
                          </select>
                          {locationLoading.states && (
                            <div className="select-loading">
                              <Loader2 size={14} className="loading-spinner" />
                            </div>
                          )}
                        </div>
                        {!selectedIds.country_id && (
                          <div className="select-hint">
                            Please select a country first
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="userProfileFormRow">
                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">City</label>
                        <div className="select-wrapper">
                          <select
                            className="userProfileSelect"
                            name="city_id"
                            value={selectedIds.city_id}
                            onChange={handleLocationChange}
                            disabled={
                              !selectedIds.state_id ||
                              locationLoading.cities ||
                              updateLoading
                            }
                          >
                            <option value="">Select City</option>
                            {cities.map((city, index) => (
                              <option
                                key={`city-${city.id}-${index}`}
                                value={city.id}
                              >
                                {city.name}
                              </option>
                            ))}
                          </select>
                          {locationLoading.cities && (
                            <div className="select-loading">
                              <Loader2 size={14} className="loading-spinner" />
                            </div>
                          )}
                        </div>
                        {!selectedIds.state_id && (
                          <div className="select-hint">
                            Please select a state first
                          </div>
                        )}
                      </div>

                      <div className="userProfileFormGroup">
                        <label className="userProfileLabel">Pincode</label>
                        <input
                          type="text"
                          className="userProfileInput"
                          name="pincode"
                          value={addressData.pincode}
                          onChange={handleAddressInputChange}
                          placeholder="Enter pincode"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="userProfileActions">
                    <button
                      type="button"
                      className="userProfileCancelBtn"
                      onClick={handleCancel}
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="userProfileSaveBtn"
                      onClick={handleSaveAddressChanges}
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <>
                          <span
                            style={{
                              display: "inline-block",
                              width: "16px",
                              height: "16px",
                              border: "2px solid #fff",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                              marginRight: "8px",
                              verticalAlign: "middle",
                            }}
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Diet And Healt Advisory Section  */}
          {activeSection === "Diet & Health" && <DietAndHealth />}

          {/* Support Groups  */}
          {activeSection === "Support Groups" && <SupportGroups />}
        </main>
      </div>
    </div>
  );
};

export default UserProfileSettings;
