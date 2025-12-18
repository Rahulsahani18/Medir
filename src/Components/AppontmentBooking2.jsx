import React, { useState, useEffect, useRef } from "react";
import "../Components/AppointmentBooking.css";
import {
  Calendar,
  MapPin,
  Star,
  Building2,
  Video,
  Phone,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Home,
  Users,
  Eye,
  Clock,
  Award,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment, resetBookingState } from "../Redux/bookingSlice";
import apiClient from "../utils/axiosInterceptors";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get doctors from Redux store
  const doctorsState = useSelector((state) => state.doctors);
  const doctors = doctorsState?.doctors?.doctors || [];
  
  // Get booking state from Redux
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.book
  );

  // Refs to track previous values for time slots API
  const prevDateRef = useRef(null);
  const prevMonthRef = useRef(null);
  const prevYearRef = useRef(null);
  const prevDoctorIdRef = useRef(null);

  // Function to clear all localStorage data
  const clearLocalStorage = () => {
    localStorage.removeItem("appointmentCurrentStep");
    localStorage.removeItem("selectedDoctor");
    localStorage.removeItem("selectedAppointmentType");
    localStorage.removeItem("selectedConsultationTypeId");
    localStorage.removeItem("selectedClinic");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedTime");
    localStorage.removeItem("selectedPeriod");
    localStorage.removeItem("appointmentFormData");
    localStorage.removeItem("bookingWasConfirmed");
  };

  // Initialize states - Load from localStorage if exists, otherwise use defaults
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("appointmentCurrentStep");
    return savedStep ? parseInt(savedStep) : 1; // Start from step 1 (Select Doctor)
  });

  // Initialize selected doctor from localStorage or location state
  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    const savedDoctor = localStorage.getItem("selectedDoctor");
    if (savedDoctor && savedDoctor !== "undefined" && savedDoctor !== "null") {
      return JSON.parse(savedDoctor);
    }
    return location.state?.doctor || null;
  });

  const [selectedAppointmentType, setSelectedAppointmentType] = useState(() => {
    const savedType = localStorage.getItem("selectedAppointmentType");
    return savedType || "";
  });

  const [selectedConsultationTypeId, setSelectedConsultationTypeId] = useState(
    () => {
      const savedId = localStorage.getItem("selectedConsultationTypeId");
      return savedId || "";
    }
  );

  const [selectedClinic, setSelectedClinic] = useState(() => {
    const savedClinic = localStorage.getItem("selectedClinic");
    if (savedClinic === "null" || savedClinic === null) {
      return null;
    }
    return savedClinic ? parseInt(savedClinic) : 1;
  });

  // Initialize selectedDate as null (changed from default date)
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? parseInt(savedDate) : null;
  });

  const [selectedTime, setSelectedTime] = useState(() => {
    const savedTime = localStorage.getItem("selectedTime");
    return savedTime || "";
  });

  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const savedPeriod = localStorage.getItem("selectedPeriod");
    return savedPeriod || "";
  });

  // Calendar state - start with current month
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Add state for time slots from API
  const [timeSlots, setTimeSlots] = useState({});
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("appointmentFormData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          patient: "self",
          symptoms: "",
          reason: "",
          attachment: null,
        };
  });

  
  // Track if user came from another page
  const [pageLoaded, setPageLoaded] = useState(false);

  // Search state for doctors
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Effect to clear localStorage when navigating from another page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Set a flag when page is about to unload
      sessionStorage.setItem("pageUnloading", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sessionStorage.removeItem("pageUnloading");
    };
  }, []);

  // Initialize filtered doctors
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      setFilteredDoctors(doctors);
    }
  }, [doctors]);

  // Filter doctors based on search query
  useEffect(() => {
    if (!doctors || doctors.length === 0) return;

    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(query) ||
          doctor.specialty?.toLowerCase().includes(query) ||
          doctor.qualifications?.toLowerCase().includes(query) ||
          doctor.location?.toLowerCase().includes(query)
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  // Reset everything when component loads
  useEffect(() => {
    // Check if user is coming from another page (not refresh)
    const wasUnloading = sessionStorage.getItem("pageUnloading");
    
    if (wasUnloading === "true") {
      // User came from another page via navigation, clear localStorage
      clearLocalStorage();
      setCurrentStep(1);
      setSelectedDoctor(null);
      setSelectedAppointmentType("");
      setSelectedConsultationTypeId("");
      setSelectedClinic(1);
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedPeriod("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        patient: "self",
        symptoms: "",
        reason: "",
        attachment: null,
      });
      setTimeSlots({});
    } else {
      // This is a refresh, keep localStorage data
      console.log("Page refreshed, keeping localStorage");
    }
    
    dispatch(resetBookingState());
    setPageLoaded(true);
  }, [dispatch]);

  // Function to reset time slots and calendar when doctor changes
  const resetTimeSlotsAndCalendar = () => {
    setTimeSlots({});
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedPeriod("");
    // Reset previous refs
    prevDateRef.current = null;
    prevMonthRef.current = null;
    prevYearRef.current = null;
  };

  // Function to fetch time slots from API
  const fetchTimeSlots = async (date) => {
    if (!selectedDoctor?.id) {
      console.error("Doctor ID is missing");
      return;
    }

    setLoadingTimeSlots(true);
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;

      console.log("Fetching time slots for:", {
        date: formattedDate,
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name
      });

      // Create FormData for POST request
      const formData = new FormData();
      formData.append('date', formattedDate);
      formData.append('doctor_id', selectedDoctor.id);

      const response = await apiClient.post("time_slots", formData);

      if (response.data?.status === true) {
        // Access the nested time_slots property
        const timeSlotsData = response.data?.time_slots || {};
        console.log("Time slots received for doctor", selectedDoctor.name, ":", timeSlotsData);
        setTimeSlots(timeSlotsData);
      } else {
        console.log("No time slots found or status false for doctor", selectedDoctor.name);
        setTimeSlots({});
        toast.error(response.data?.msg || "Failed to fetch time slots");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots({});
      toast.error("Failed to fetch time slots. Please try again.");
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  // Fetch time slots ONLY when date is selected AND date/month/year changed OR doctor changed
  useEffect(() => {
    if (selectedDoctor?.id && selectedDate && currentStep === 3) {
      // Check if doctor changed
      const doctorChanged = selectedDoctor.id !== prevDoctorIdRef.current;
      
      // Check if date, month, or year actually changed
      const dateChanged = selectedDate !== prevDateRef.current;
      const monthChanged = currentMonth !== prevMonthRef.current;
      const yearChanged = currentYear !== prevYearRef.current;
      
      // Only fetch if doctor changed OR date/month/year changed
      if (doctorChanged || dateChanged || monthChanged || yearChanged) {
        console.log("Fetching time slots - Doctor/Date/Month/Year changed");
        fetchTimeSlots(selectedDate);
      }
      
      // Update refs
      prevDateRef.current = selectedDate;
      prevMonthRef.current = currentMonth;
      prevYearRef.current = currentYear;
      prevDoctorIdRef.current = selectedDoctor.id;
    }
  }, [selectedDoctor?.id, selectedDate, currentStep, currentMonth, currentYear]);

  // Reset time slots when doctor changes (even without selecting date)
  useEffect(() => {
    // If doctor changes and we're on step 3, reset time slots
    if (selectedDoctor?.id && prevDoctorIdRef.current && selectedDoctor.id !== prevDoctorIdRef.current && currentStep === 3) {
      console.log("Doctor changed, resetting time slots");
      resetTimeSlotsAndCalendar();
      prevDoctorIdRef.current = selectedDoctor.id;
    } else if (!prevDoctorIdRef.current && selectedDoctor?.id) {
      // Initialize the ref
      prevDoctorIdRef.current = selectedDoctor.id;
    }
  }, [selectedDoctor?.id, currentStep]);

  // Consultation types mapping based on your JSON
  const consultationTypes = [
    {
      id: "1",
      name: "Audio Call",
      description: "Voice-only consultation via phone or in-app VoIP.",
      icon: Phone,
    },
    {
      id: "2",
      name: "Video Call",
      description: "One-to-one video consultation with screen-sharing option.",
      icon: Video,
    },
    {
      id: "3",
      name: "Clinic",
      description: "On-demand immediate counseling; shorter sessions.",
      icon: Building2,
    },
  ];

  // Steps - 5 steps total (with Select Doctor as first step)
  const steps = [
    { num: 1, label: "Select Doctor", active: currentStep >= 1 },
    { num: 2, label: "Appointment Type", active: currentStep >= 2 },
    { num: 3, label: "Date & Time", active: currentStep >= 3 },
    { num: 4, label: "Basic Information", active: currentStep >= 4 },
    { num: 5, label: "Confirmation", active: currentStep >= 5 },
  ];

  const clinics = [
    {
      id: 1,
      name: "AllCare Family Medicine",
      address: "3343 Private Lane, Valdosta",
      distance: "500 Meters",
      color: "#7DD3C0",
    },
    {
      id: 2,
      name: "Vitalplus Clinic",
      address: "4223 Pleasant Hill Road, Miami, FL 33169",
      distance: "12 KM",
      color: "#FF6B6B",
    },
    {
      id: 3,
      name: "Wellness Path Chiropractic",
      address: "418 Patton Lane, Garner, NC 27529, FL 33169",
      distance: "16 KM",
      color: "#A0C4FF",
    },
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Function to get time slots by period from API response
  const getTimeSlotsByPeriod = (period) => {
    const periodKey = period.toLowerCase();
    
    if (timeSlots[periodKey] && Array.isArray(timeSlots[periodKey])) {
      return timeSlots[periodKey];
    }

    return [];
  };

  // Get available periods from API response
  const getAvailablePeriods = () => {
    if (!timeSlots || Object.keys(timeSlots).length === 0) {
      return [];
    }

    const periods = [];
    if (timeSlots.morning && timeSlots.morning.length > 0) {
      periods.push("Morning");
    }
    if (timeSlots.afternoon && timeSlots.afternoon.length > 0) {
      periods.push("Afternoon");
    }
    if (timeSlots.evening && timeSlots.evening.length > 0) {
      periods.push("Evening");
    }

    return periods;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    // Reset time slots and calendar when selecting a new doctor
    if (selectedDoctor?.id !== doctor.id) {
      resetTimeSlotsAndCalendar();
    }
    setSelectedDoctor(doctor);
  };

  // Handle view doctor profile
  const handleViewProfile = (doctor) => {
    navigate('/doctor-profile', { 
      state: { doctorId: doctor.id, doctor: doctor }
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
    // Clear previous time selection when date changes
    setSelectedTime("");
    setSelectedPeriod("");
    // Time slots will be fetched in the useEffect above
  };

  // Handle Redux state changes
  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to book appointment");
      dispatch(resetBookingState());
    }

    if (isSuccess) {
      toast.success(message || "Appointment booked successfully!");

      // Clear localStorage before moving to confirmation
      clearLocalStorage();
      
      // Move to confirmation step
      setCurrentStep(5);

      // Reset Redux state after success
      setTimeout(() => {
        dispatch(resetBookingState());
      }, 2000);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleNext = async () => {
    // Validate before proceeding
    if (currentStep === 1 && !selectedDoctor) {
      toast.error("Please select a doctor before proceeding.");
      return;
    }

    if (currentStep === 2 && !selectedConsultationTypeId) {
      toast.error("Please select an appointment type before proceeding.");
      return;
    }

    if (currentStep === 3) {
      // Check if both date and time are missing
      const hasNoDate = !selectedDate || selectedDate === null || selectedDate === undefined;
      const hasNoTime = !selectedTime || !selectedPeriod;
      
      // If both are missing, show combined error
      if (hasNoDate && hasNoTime) {
        toast.error("Please select a date and time before proceeding.");
        return;
      }
      
      // Check if only date is missing
      if (hasNoDate) {
        toast.error("Please select a date before proceeding.");
        return;
      }
      
      // Check if only time is missing
      if (hasNoTime) {
        toast.error("Please select a time slot before proceeding.");
        return;
      }
      
      // Validate that the selected date exists in the current month
      const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      if (selectedDate > daysInCurrentMonth) {
        toast.error("Selected date is not valid for the current month. Please select a new date.");
        setSelectedDate(null);
        setSelectedTime("");
        setSelectedPeriod("");
        setTimeSlots({});
        return;
      }
      
      // Validate that the selected month/year is not in the past
      const selectedDateObj = new Date(currentYear, currentMonth, selectedDate);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (selectedDateObj < todayStart) {
        toast.error("Cannot select a past date. Please select today or a future date.");
        return;
      }
    }

    if (currentStep === 4) {
      // Validate form data
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // If we're on step 4 and clicking Next, submit the booking
      await handleSubmitBooking();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Function to generate calendar dates
  const generateCalendarDates = () => {
    const dates = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Previous month dates
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: false, isPast: false });
    }

    // Current month dates
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      dates.push({ date: i, isCurrentMonth: true, isPast });
    }

    // Next month dates
    const totalCells = 42; // 6 weeks
    const nextMonthDays = totalCells - dates.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: false, isPast: false });
    }

    return dates;
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    
    // Clear selected date when changing months
    if (selectedDate) {
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedPeriod("");
      setTimeSlots({});
    }
  };

  // Handle time slot selection
  const handleTimeSlotClick = (time, period, status) => {
    if (status === 1) {
      setSelectedTime(time);
      setSelectedPeriod(period);
    }
  };

  // Handle appointment type selection
  const handleAppointmentTypeSelect = (type) => {
    setSelectedAppointmentType(type.name);
    setSelectedConsultationTypeId(type.id);

    // If not clinic type, clear clinic selection
    if (type.name !== "Clinic") {
      setSelectedClinic(null);
    } else {
      setSelectedClinic(1);
    }
  };

  // Function to submit booking using Redux
  const handleSubmitBooking = async () => {
    // Validate required fields
    if (!selectedDoctor?.id) {
      toast.error("Doctor information is missing");
      return;
    }

    if (!selectedConsultationTypeId) {
      toast.error("Please select appointment type");
      return;
    }

    // First validate date
    if (!selectedDate || selectedDate === null || selectedDate === undefined) {
      toast.error("Please select appointment date");
      return;
    }

    // Then validate time
    if (!selectedTime || !selectedPeriod) {
      toast.error("Please select appointment time");
      return;
    }

    // Validate that the selected date exists in the current month
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    if (selectedDate > daysInCurrentMonth) {
      toast.error("Selected date is not valid for the current month. Please select a new date.");
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedPeriod("");
      setTimeSlots({});
      return;
    }

    // Format date properly - use the same format as API
    const formattedDate = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`;

    // Prepare the booking data for Redux
    const bookingData = {
      doctor_id: selectedDoctor.id,
      consultation_type_id: selectedConsultationTypeId,
      date: formattedDate,
      time_slot: selectedTime,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      patient_type: formData.patient,
      symptoms: formData.symptoms || "",
      reason: formData.reason || "",
      attachment: formData.attachment,
    };

    // Dispatch the booking action
    dispatch(bookAppointment(bookingData));
  };

  // Save state to localStorage
  useEffect(() => {
    // Only save if we're not on the confirmation step (step 5)
    if (currentStep !== 5) {
      localStorage.setItem("appointmentCurrentStep", currentStep.toString());
      
      // Save selected doctor
      if (selectedDoctor) {
        localStorage.setItem("selectedDoctor", JSON.stringify(selectedDoctor));
      }
      
      localStorage.setItem("selectedAppointmentType", selectedAppointmentType);
      localStorage.setItem(
        "selectedConsultationTypeId",
        selectedConsultationTypeId
      );
      localStorage.setItem("selectedClinic", String(selectedClinic));
      localStorage.setItem("selectedDate", selectedDate ? selectedDate.toString() : "");
      if (selectedTime) localStorage.setItem("selectedTime", selectedTime);
      if (selectedPeriod) localStorage.setItem("selectedPeriod", selectedPeriod);
      localStorage.setItem("appointmentFormData", JSON.stringify(formData));
    }
  }, [
    currentStep,
    selectedDoctor,
    selectedAppointmentType,
    selectedConsultationTypeId,
    selectedClinic,
    selectedDate,
    selectedTime,
    selectedPeriod,
    formData,
  ]);

  // Clear localStorage when component unmounts (user leaves page via navigation)
  useEffect(() => {
    return () => {
      // Only clear if not refreshing
      const wasUnloading = sessionStorage.getItem("pageUnloading");
      if (wasUnloading !== "true") {
        // This is navigation away, clear localStorage
        clearLocalStorage();
      }
    };
  }, []);

  // Function to generate and download PDF receipt
  const downloadReceiptPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // HEADER BACKGROUND
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("MEDICAL APPOINTMENT", 105, 18, { align: "center" });

      doc.setFontSize(16);
      doc.text("CONFIRMATION RECEIPT", 105, 30, { align: "center" });

      // Checkmark
      const cx = 105;
      const cy = 60;
      doc.setDrawColor(46, 204, 113);
      doc.setLineWidth(3);
      doc.line(cx - 5, cy + 1, cx - 0, cy + 5);
      doc.line(cx - 1, cy + 6, cx + 6, cy - 3);

      // Confirm text
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Appointment Confirmed!", 105, 82, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Thank you for booking with us. Below are your appointment details:",
        105,
        90,
        { align: "center" }
      );

      // DETAILS SECTION
      doc.setFillColor(241, 243, 245);
      doc.rect(10, 100, 190, 80, "F");

      doc.setTextColor(52, 73, 94);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("APPOINTMENT DETAILS", 105, 112, { align: "center" });

      const appointmentDate = `${selectedDate} ${months[currentMonth]} ${currentYear}`;
      const appointmentTime =
        selectedTime && selectedPeriod
          ? `${selectedTime} ${selectedPeriod}`
          : "Not selected";
      const selectedClinicData = clinics.find((c) => c.id === selectedClinic);

      const details = [
        {
          label: "Appointment ID:",
          value: `APT-${currentYear}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
        },
        { label: "Date:", value: appointmentDate },
        { label: "Time:", value: appointmentTime },
        { label: "Doctor:", value: selectedDoctor?.name || "Dr. Unknown" },
        { label: "Specialty:", value: selectedDoctor?.specialty || "General Medicine" },
        { label: "Appointment Type:", value: selectedAppointmentType },
        {
          label: "Clinic:",
          value: selectedClinicData?.name || "Not specified",
        },
        {
          label: "Patient Name:",
          value: `${formData.firstName} ${formData.lastName}`,
        },
        { label: "Contact Email:", value: formData.email },
        { label: "Contact Phone:", value: formData.phone },
      ];

      let y = 125;
      details.forEach((detail, index) => {
        const left = index % 2 === 0;
        const x = left ? 20 : 120;

        if (left && index > 0) y += 8;

        doc.setTextColor(127, 140, 141);
        doc.setFontSize(10);
        doc.text(detail.label, x, y);

        doc.setTextColor(44, 62, 80);
        doc.setFontSize(11);
        doc.text(detail.value, x + 35, y);
      });

      // FEES SECTION
      doc.setFillColor(241, 243, 245);
      doc.rect(10, 185, 190, 30, "F");

      doc.setTextColor(52, 73, 94);
      doc.setFontSize(14);
      doc.text("FEES SUMMARY", 20, 197);

      const fees = [
        { item: "Consultation Fee", amount: selectedDoctor?.fee || 150 },
        { item: "Service Fee", amount: 15 },
        { item: "Tax", amount: 12.5 },
      ];

      y = 205;
      fees.forEach((f) => {
        doc.setTextColor(127, 140, 141);
        doc.setFontSize(10);
        doc.text(f.item, 20, y);

        doc.setTextColor(44, 62, 80);
        doc.text(`$${f.amount.toFixed(2)}`, 180, y, { align: "right" });

        y += 6;
      });

      const total = fees.reduce((sum, f) => sum + f.amount, 0);
      doc.line(20, y + 2, 190, y + 2);

      doc.setTextColor(41, 128, 185);
      doc.setFontSize(12);
      doc.text("Total Amount:", 20, y + 10);
      doc.text(`$${total.toFixed(2)}`, 180, y + 10, { align: "right" });

      // FOOTER
      doc.setTextColor(127, 140, 141);
      doc.setFontSize(10);
      doc.text("For any queries contact support@medicalclinic.com", 105, 260, {
        align: "center",
      });
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        105,
        265,
        { align: "center" }
      );
      doc.text("Thank you for choosing our medical services!", 105, 270, {
        align: "center" }
      );

      doc.save(`Appointment-Receipt-${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF.");
    }
  };

  // Function to generate and print receipt
  const printReceipt = () => {
    const appointmentTime =
      selectedTime && selectedPeriod
        ? `${selectedTime} ${selectedPeriod}`
        : "Not selected";
    const appointmentDate = `${selectedDate} ${months[currentMonth]} ${currentYear}`;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointment Receipt</title>
        <style>
          @media print {
            @page {
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .receipt-header {
              background: #2980b9;
              color: white;
              padding: 30px;
              text-align: center;
              margin-bottom: 30px;
              border-radius: 10px;
            }
            .checkmark {
              font-size: 60px;
              color: #2ecc71;
              margin: 20px 0;
            }
            .section-title {
              background: #f1f3f5;
              padding: 10px;
              border-radius: 5px;
              margin: 25px 0 15px 0;
              font-weight: bold;
              color: #34495e;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 20px 0;
            }
            .detail-item {
              margin-bottom: 10px;
            }
            .detail-label {
              color: #7f8c8d;
              font-weight: bold;
              font-size: 14px;
            }
            .detail-value {
              color: #2c3e50;
              font-size: 16px;
            }
            .fees-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .fees-table td {
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            .total-row {
              border-top: 2px solid #ddd;
              font-weight: bold;
              font-size: 18px;
              color: #2980b9;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #7f8c8d;
              font-size: 12px;
              text-align: center;
            }
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <h1>MEDICAL APPOINTMENT</h1>
          <h2>CONFIRMATION RECEIPT</h2>
        </div>
        
        <div style="text-align: center;">
          <div class="checkmark">✓</div>
          <h2>Appointment Confirmed!</h2>
          <p>Thank you for booking with us. Below are your appointment details:</p>
        </div>
        
        <div class="section-title">APPOINTMENT DETAILS</div>
        
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Appointment ID:</div>
            <div class="detail-value">APT-${currentYear}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Date:</div>
            <div class="detail-value">${appointmentDate}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Time:</div>
            <div class="detail-value">${appointmentTime}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Doctor:</div>
            <div class="detail-value">${selectedDoctor?.name || "Dr. Unknown"}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Specialty:</div>
            <div class="detail-value">${
              selectedDoctor?.specialty || "General Medicine"
            }</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Appointment Type:</div>
            <div class="detail-value">${selectedAppointmentType}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Clinic:</div>
            <div class="detail-value">${
              clinics.find((c) => c.id === selectedClinic)?.name ||
              "Not specified"
            }</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Patient Name:</div>
            <div class="detail-value">${formData.firstName} ${
      formData.lastName
    }</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Contact Email:</div>
            <div class="detail-value">${formData.email}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Contact Phone:</div>
            <div class="detail-value">${formData.phone}</div>
          </div>
        </div>
        
        <div class="section-title">FEES SUMMARY</div>
        
        <table class="fees-table">
          <tr>
            <td>Consultation Fee</td>
            <td align="right">$${(selectedDoctor?.fee || 150).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Service Fee</td>
            <td align="right">$15.00</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td align="right">$12.50</td>
          </tr>
          <tr class="total-row">
            <td>Total Amount</td>
            <td align="right">$${((selectedDoctor?.fee || 150) + 15 + 12.5).toFixed(
              2
            )}</td>
          </tr>
        </table>
        
        <div class="footer">
          <p>For any queries or changes, please contact our support team at support@medicalclinic.com</p>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Thank you for choosing our medical services!</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;" class="print-button">
          <button onclick="window.print()">Print Receipt</button>
          <button onclick="window.close()">Close</button>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Function to complete booking and clear localStorage
  const handleCompleteBooking = () => {
    // Clear all localStorage data
    clearLocalStorage();

    // Reset Redux state
    dispatch(resetBookingState());

    // Redirect to dashboard or show success message
    navigate("/");
  };

  const calendarDates = generateCalendarDates();
  const availablePeriods = getAvailablePeriods();

  return (
    <div className="bookApntmt__container">
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="bookApntmt__wrapper container">
        {/* Stepper - Showing 5 steps */}
        <div className="bookApntmt__stepper">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="bookApntmt__step">
                <div
                  className={`bookApntmt__stepNumber ${
                    step.active ? "active" : "inactive"
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`bookApntmt__stepLabel ${
                    step.active ? "active" : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`bookApntmt__stepDivider ${
                    step.active ? "active" : ""
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Card */}
        <div className="bookApntmt__card">
          {/* Doctor Header - Show from step 2 onwards */}
          {selectedDoctor && currentStep > 1 && (
            <div className="bookApntmt__doctorHeader">
              <img
                src={selectedDoctor?.image || "https://via.placeholder.com/85"}
                className="rounded-pill bookApntmt__doctorImage"
                alt="doctor"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/85";
                }}
              />
              <div className="bookApntmt__doctorInfo">
                <h3>
                  {selectedDoctor?.name || "Dr. Unknown"}
                  <span className="bookApntmt__rating">
                    <Star size={12} fill="white" /> {selectedDoctor?.rating || "4.5"}
                  </span>
                </h3>
                <div className="bookApntmt__specialty">
                  {selectedDoctor?.qualifications || "MBBS"} -{" "}
                  {selectedDoctor?.specialty || "General Medicine"}
                </div>
                <div className="bookApntmt__address">
                  <MapPin size={14} />
                  {selectedDoctor?.location || "Not specified"}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Select Doctor */}
          {currentStep === 1 && (
            <>
              <h2 className="bookApntmt__sectionTitle">Select a Doctor</h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search doctors by name, specialty, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="input-group-text bg-white">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
                {searchQuery && (
                  <small className="text-muted">
                    Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                  </small>
                )}
              </div>

              {/* Doctors List - Scrollable Container */}
              <div className="bookApntmt__doctorsListContainer">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`bookApntmt__doctorCard ${
                        selectedDoctor?.id === doctor.id ? "selected" : ""
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="bookApntmt__doctorCardContent">
                        <div className="bookApntmt__doctorAvatarSection">
                          <img
                            src={doctor.image || "https://via.placeholder.com/60"}
                            alt={doctor.name}
                            className="bookApntmt__doctorAvatar"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60";
                            }}
                          />
                          {doctor.availableToday && (
                            <span className="bookApntmt__availableBadge">
                              Available Today
                            </span>
                          )}
                        </div>
                        <div className="bookApntmt__doctorInfoSection">
                          <div className="bookApntmt__doctorName">
                            {doctor.name}
                            <span className="bookApntmt__rating">
                              <Star size={12} fill="currentColor" /> {doctor.rating || "N/A"}
                            </span>
                          </div>
                          <div className="bookApntmt__doctorSpecialty">
                            {doctor.specialty}
                          </div>
                          <div className="bookApntmt__doctorQualifications">
                            {doctor.qualifications}
                          </div>
                          <div className="bookApntmt__doctorDetails">
                            <div className="bookApntmt__doctorDetail">
                              <MapPin size={12} />
                              <span>{doctor.location || "Not specified"}</span>
                            </div>
                            <div className="bookApntmt__doctorDetail">
                              <Clock size={12} />
                              <span>{doctor.duration || "30 Min"}</span>
                            </div>
                            <div className="bookApntmt__doctorDetail">
                              <Award size={12} />
                              <span>{doctor.experience || 0} years experience</span>
                            </div>
                          </div>
                        </div>
                        <div className="bookApntmt__doctorActions">
                          <button
                            className="bookApntmt__viewProfileBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(doctor);
                            }}
                            title="View Doctor Profile"
                          >
                            <Eye size={18} className="m-0"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-5">
                    <p className="text-muted">
                      {searchQuery ? "No doctors found matching your search." : "No doctors available at the moment."}
                    </p>
                    {searchQuery && (
                      <button
                        className="btn btn-outline-primary mt-2"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 2: Appointment Type */}
          {currentStep === 2 && (
            <>
              <h2 className="bookApntmt__sectionTitle">
                Select Appointment Type
              </h2>
              <div className="bookApntmt__typeGrid">
                {consultationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`bookApntmt__typeCard ${
                        selectedConsultationTypeId === type.id ? "selected" : ""
                      }`}
                      onClick={() => handleAppointmentTypeSelect(type)}
                    >
                      <Icon className="bookApntmt__typeIcon" />
                      <p className="bookApntmt__typeLabel">{type.name}</p>
                      <small className="bookApntmt__typeDescription">
                        {type.description}
                      </small>
                    </div>
                  );
                })}
              </div>

              {selectedAppointmentType === "Clinic" && (
                <>
                  <h2 className="bookApntmt__sectionTitle">Select Clinic</h2>
                  {clinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className={`bookApntmt__clinicCard ${
                        selectedClinic === clinic.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedClinic(clinic.id)}
                    >
                      <div
                        className="bookApntmt__clinicIcon"
                        style={{ background: clinic.color }}
                      >
                        <Building2 color="white" />
                      </div>
                      <div className="bookApntmt__clinicInfo">
                        <h3 className="bookApntmt__clinicName">
                          {clinic.name}
                        </h3>
                        <p className="bookApntmt__clinicAddress">
                          {clinic.address} •{" "}
                          <span className="bookApntmt__clinicDistance">
                            {clinic.distance}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <>
              <h2 className="bookApntmt__sectionTitle">Select Date & Time</h2>
              <div className="bookApntmt__calendar">
                <div className="bookApntmt__calendarLeft">
                  <div className="bookApntmt__calendarHeader">
                    <div className="bookApntmt__calendarNav">
                      <button
                        className="bookApntmt__navBtn"
                        onClick={() => navigateMonth("prev")}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="bookApntmt__currentMonth">
                        {months[currentMonth]} {currentYear}
                      </div>
                      <button
                        className="bookApntmt__navBtn"
                        onClick={() => navigateMonth("next")}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="bookApntmt__calendarSelects">
                      <select
                        className="bookApntmt__select"
                        value={currentMonth}
                        onChange={(e) => {
                          const newMonth = parseInt(e.target.value);
                          setCurrentMonth(newMonth);
                          // Clear selection when month changes
                          if (selectedDate) {
                            setSelectedDate(null);
                            setSelectedTime("");
                            setSelectedPeriod("");
                            setTimeSlots({});
                          }
                        }}
                      >
                        {months.map((month, index) => (
                          <option key={month} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        className="bookApntmt__select"
                        value={currentYear}
                        onChange={(e) => {
                          const newYear = parseInt(e.target.value);
                          setCurrentYear(newYear);
                          // Clear selection when year changes
                          if (selectedDate) {
                            setSelectedDate(null);
                            setSelectedTime("");
                            setSelectedPeriod("");
                            setTimeSlots({});
                          }
                        }}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bookApntmt__calendarGrid">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div key={day} className="bookApntmt__calendarDay">
                        {day}
                      </div>
                    ))}
                    {calendarDates.map((dateObj, idx) => {
                      const today = new Date();
                      const isCurrentMonthAndNotPast = dateObj.isCurrentMonth && !dateObj.isPast;
                      const isSelected = dateObj.date === selectedDate && dateObj.isCurrentMonth;
                      
                      return (
                        <button
                          key={idx}
                          className={`bookApntmt__calendarDate ${
                            isSelected ? "selected" : ""
                          } ${!dateObj.isCurrentMonth ? "disabled" : ""} ${
                            dateObj.isPast ? "past" : ""
                          }`}
                          onClick={() => isCurrentMonthAndNotPast && handleDateSelect(dateObj.date)}
                          disabled={!isCurrentMonthAndNotPast}
                          title={
                            dateObj.isPast 
                              ? "Past date" 
                              : !dateObj.isCurrentMonth 
                              ? "Not in current month" 
                              : "Select date"
                          }
                        >
                          {dateObj.date}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="bookApntmt__timeSlotsRight">
                  {loadingTimeSlots ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading available time slots...</p>
                    </div>
                  ) : !selectedDate ? (
                    <div className="text-center p-4">
                      <div className="text-warning mb-2">
                        <Calendar size={48} />
                      </div>
                      <p className="text-muted">
                        Please select a date to see available time slots
                      </p>
                      <small className="text-muted">
                        Click on any available date in the calendar
                      </small>
                    </div>
                  ) : availablePeriods.length > 0 ? (
                    availablePeriods.map((period) => {
                      const timeSlots = getTimeSlotsByPeriod(period);
                      return (
                        <div key={period} className="bookApntmt__periodSection">
                          <div className="bookApntmt__periodTitle">
                            {period}
                          </div>
                          <div className="bookApntmt__timeGrid">
                            {timeSlots.map((slot, idx) => {
                              const isAvailable = slot.status === 1;
                              const isSelected =
                                selectedTime === slot.time &&
                                selectedPeriod === period;
                              return (
                                <button
                                  key={idx}
                                  className={`bookApntmt__timeSlot ${
                                    isSelected ? "selected" : ""
                                  } ${!isAvailable ? "disabled" : ""}`}
                                  onClick={() =>
                                    handleTimeSlotClick(
                                      slot.time,
                                      period,
                                      slot.status
                                    )
                                  }
                                  disabled={!isAvailable}
                                  title={
                                    !isAvailable
                                      ? "This time slot is not available"
                                      : "Available"
                                  }
                                >
                                  {slot.time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-danger mb-2">
                        <Calendar size={48} />
                      </div>
                      <p className="text-muted">
                        No available time slots for {selectedDate} {months[currentMonth]}
                      </p>
                      <small className="text-muted">
                        Please select a different date
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Basic Information */}
          {currentStep === 4 && (
            <>
              <div className="bookApntmt__bookingInfo">
                <div className="bookApntmt__infoItem">
                  <h4>Doctor</h4>
                  <p>{selectedDoctor?.name || "Dr. Unknown"}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Specialty</h4>
                  <p>{selectedDoctor?.specialty || "General Medicine"}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Date & Time</h4>
                  <p>
                    {selectedTime && selectedPeriod
                      ? `${selectedTime} ${selectedPeriod}, ${selectedDate} ${months[currentMonth]}`
                      : "Not selected"}
                  </p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Duration</h4>
                  <p>{selectedDoctor?.duration || "30 Min"}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Appointment type</h4>
                  <p>
                    {selectedAppointmentType}
                    {selectedAppointmentType === "Clinic" && selectedClinic
                      ? ` (${
                          clinics.find((c) => c.id === selectedClinic)?.name ||
                          ""
                        })`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      className="bookApntmt__input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      className="bookApntmt__input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="bookApntmt__input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="bookApntmt__input"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">
                      Select Patient *
                    </label>
                    <select
                      name="patient"
                      className="bookApntmt__input"
                      value={formData.patient}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select patient</option>
                      <option value="self">Self</option>
                      <option value="family">Family Member</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Symptoms</label>
                    <input
                      type="text"
                      name="symptoms"
                      className="bookApntmt__input"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      placeholder="Describe symptoms"
                    />
                  </div>
                </div>
              </div>

              <div className="bookApntmt__formGroup">
                <label className="bookApntmt__label">Attachment</label>
                <input
                  type="file"
                  className="bookApntmt__input"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      attachment: e.target.files[0],
                    }))
                  }
                />
                <small className="text-muted">
                  You can upload medical reports, prescriptions, or other
                  relevant documents
                </small>
              </div>

              <div className="bookApntmt__formGroup">
                <label className="bookApntmt__label">Reason for Visit</label>
                <textarea
                  name="reason"
                  className="bookApntmt__input bookApntmt__textarea"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please describe the reason for your visit in detail..."
                  rows="4"
                />
              </div>
            </>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="bookApntmt__confirmation">
              <div className="bookApntmt__confirmationIcon">
                <Check size={40} />
              </div>

              <h2 className="bookApntmt__confirmationTitle">
                Appointment Confirmed!
              </h2>

              <p className="bookApntmt__confirmationText">
                Your appointment has been successfully booked. You will receive
                a confirmation email with all the details shortly.
              </p>

              <div className="bookApntmt__appointmentDetails">
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">Doctor:</span>
                  <span className="bookApntmt__detailValue">
                    {selectedDoctor?.name || "Dr. Unknown"}
                  </span>
                </div>
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">Specialty:</span>
                  <span className="bookApntmt__detailValue">
                    {selectedDoctor?.specialty || "General Medicine"}
                  </span>
                </div>
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">Date & Time:</span>
                  <span className="bookApntmt__detailValue">
                    {selectedTime && selectedPeriod
                      ? `${selectedTime} ${selectedPeriod}, ${selectedDate} ${months[currentMonth]} ${currentYear}`
                      : "Not selected"}
                  </span>
                </div>
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">Duration:</span>
                  <span className="bookApntmt__detailValue">
                    {selectedDoctor?.duration || "30 Min"}
                  </span>
                </div>
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">
                    Appointment Type:
                  </span>
                  <span className="bookApntmt__detailValue">
                    {selectedAppointmentType}
                  </span>
                </div>
                {selectedAppointmentType === "Clinic" && selectedClinic && (
                  <div className="bookApntmt__detailRow">
                    <span className="bookApntmt__detailLabel">Clinic:</span>
                    <span className="bookApntmt__detailValue">
                      {clinics.find((c) => c.id === selectedClinic)?.name ||
                        "Not specified"}
                    </span>
                  </div>
                )}
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">Patient:</span>
                  <span className="bookApntmt__detailValue">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="bookApntmt__detailRow">
                  <span className="bookApntmt__detailLabel">
                    Appointment ID:
                  </span>
                  <span className="bookApntmt__detailValue">
                    APT-${currentYear}-$
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </span>
                </div>

                <div className="bookApntmt__totalAmount">
                  <span>Total Amount:</span>
                  <span>${((selectedDoctor?.fee || 150) + 15 + 12.5).toFixed(2)}</span>
                </div>
              </div>

              <div className="bookApntmt__actionButtons">
                <button
                  className="bookApntmt__btn bookApntmt__btnDownload"
                  onClick={downloadReceiptPDF}
                >
                  <Download size={18} />
                  Download PDF Receipt
                </button>
                <button
                  className="bookApntmt__btn bookApntmt__btnPrint"
                  onClick={printReceipt}
                >
                  Print Receipt
                </button>
                <button
                  className="bookApntmt__btn bookApntmt__btnDashboard"
                  onClick={handleCompleteBooking}
                >
                  Go to Home
                </button>
              </div>
            </div>
          )}

          {/* Actions - Show only if not on confirmation step */}
          {currentStep !== 5 && (
            <div className="bookApntmt__actions">
              {/* Show Back button only from step 2 onwards */}
              {currentStep > 1 && (
                <button
                  className="bookApntmt__btn bookApntmt__btnBack"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Back
                </button>
              )}
              <button
                className="bookApntmt__btn bookApntmt__btnNext"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading
                  ? "Submitting..."
                  : currentStep === 4
                  ? "Confirm Appointment"
                  : currentStep === 3
                  ? "Add Basic Information"
                  : currentStep === 2
                  ? "Select Date & Time"
                  : "Select Appointment Type"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;