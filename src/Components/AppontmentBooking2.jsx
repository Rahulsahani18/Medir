import React, { useState } from 'react';
import { Calendar, MapPin, Star, Building2, Video, Phone, MessageSquare, Home, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState('Clinic');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedPeriod, setSelectedPeriod] = useState('Morning');
  const [expandedSpecialty, setExpandedSpecialty] = useState(null);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    patient: '',
    symptoms: '',
    reason: '',
    attachment: null
  });

  const steps = [
    { num: 1, label: 'Select Doctor', active: currentStep >= 1 },
    { num: 2, label: 'Appointment Type', active: currentStep >= 2 },
    { num: 3, label: 'Date & Time', active: currentStep >= 3 },
    { num: 4, label: 'Basic Information', active: currentStep >= 4 },
    { num: 5, label: 'Confirmation', active: currentStep >= 5 }
  ];

  const appointmentTypes = [
    { id: 'clinic', label: 'Clinic', icon: Building2 },
    { id: 'video', label: 'Video Call', icon: Video },
    { id: 'audio', label: 'Audio Call', icon: Phone },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'home', label: 'Home Visit', icon: Home }
  ];

  const specialtiesWithDoctors = [
    {
      id: 1,
      specialty: 'Psychologist',
      doctors: [
        {
          id: 1,
          name: 'Dr. Michael Brown',
          rating: 5.0,
          specialty: 'Psychologist',
          address: '5th Street - 1011 W 5th St, Suite 120, Austin, TX 78703',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop'
        },
        {
          id: 2,
          name: 'Dr. Sarah Johnson',
          rating: 4.9,
          specialty: 'Psychologist',
          address: '2nd Avenue - 456 2nd Ave, Suite 200, Austin, TX 78701',
          image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop'
        },
        {
          id: 3,
          name: 'Dr. James Wilson',
          rating: 4.8,
          specialty: 'Psychologist',
          address: '8th Street - 890 8th St, Suite 400, Austin, TX 78705',
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop'
        }
      ]
    },
    {
      id: 2,
      specialty: 'Cardiologist',
      doctors: [
        {
          id: 4,
          name: 'Dr. Robert Martinez',
          rating: 4.8,
          specialty: 'Cardiologist',
          address: '3rd Street - 789 3rd St, Suite 300, Austin, TX 78702',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop'
        },
        {
          id: 5,
          name: 'Dr. Emily Davis',
          rating: 4.7,
          specialty: 'Cardiologist',
          address: '4th Avenue - 321 4th Ave, Suite 150, Austin, TX 78703',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop'
        }
      ]
    },
    {
      id: 3,
      specialty: 'Dermatologist',
      doctors: [
        {
          id: 6,
          name: 'Dr. Jennifer Lee',
          rating: 4.9,
          specialty: 'Dermatologist',
          address: '6th Street - 555 6th St, Suite 100, Austin, TX 78704',
          image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=150&h=150&fit=crop'
        },
        {
          id: 7,
          name: 'Dr. Amanda Chen',
          rating: 4.8,
          specialty: 'Dermatologist',
          address: '7th Avenue - 222 7th Ave, Suite 250, Austin, TX 78706',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop'
        }
      ]
    },
    {
      id: 4,
      specialty: 'Pediatrician',
      doctors: [
        {
          id: 8,
          name: 'Dr. Lisa Anderson',
          rating: 5.0,
          specialty: 'Pediatrician',
          address: '9th Street - 333 9th St, Suite 180, Austin, TX 78707',
          image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop'
        }
      ]
    }
  ];

  const clinics = [
    {
      id: 1,
      name: 'AllCare Family Medicine',
      address: '3343 Private Lane, Valdosta',
      distance: '500 Meters',
      color: '#7DD3C0'
    },
    {
      id: 2,
      name: 'Vitalplus Clinic',
      address: '4223 Pleasant Hill Road, Miami, FL 33169',
      distance: '12 KM',
      color: '#FF6B6B'
    },
    {
      id: 3,
      name: 'Wellness Path Chiropractic',
      address: '418 Patton Lane, Garner, NC 27529, FL 33169',
      distance: '16 KM',
      color: '#A0C4FF'
    }
  ];

  const timeSlots = {
    Morning: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'],
    Afternoon: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'],
    Evening: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
    if (direction === 'prev') {
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
  };

  const calendarDates = generateCalendarDates();

  return (
    <div className="bookApntmt__container">
      <style>{`
        .bookApntmt__container {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .bookApntmt__wrapper {
          margin: 0 auto;
        }

        .bookApntmt__stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .bookApntmt__step {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bookApntmt__stepNumber {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }

        .bookApntmt__stepNumber.active {
          background: #04bd6c;
          color: white;
        }

        .bookApntmt__stepNumber.inactive {
          background: #e9ecef;
          color: #6c757d;
        }

        .bookApntmt__stepLabel {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
        }

        .bookApntmt__stepLabel.active {
          color: #04bd6c;
        }

        .bookApntmt__stepDivider {
          width: 40px;
          height: 2px;
          background: #dee2e6;
          margin: 0 5px;
          transition: all 0.3s;
        }

        .bookApntmt__stepDivider.active {
          background: #04bd6c;
        }

        .bookApntmt__card {
          background: white;
          border-radius: 12px;
          padding: 30px;
        //   box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border: 1px solid #e6e8ee;
        }

        .bookApntmt__doctorHeader {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 30px;
        }

        .bookApntmt__doctorImage {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .bookApntmt__doctorInfo h3 {
          margin: 0 0 5px 0;
          font-size: 22px;
          font-weight: 600;
          color: #212529;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bookApntmt__rating {
          background: #ff6b35;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .bookApntmt__specialty {
          color: #0d6efd;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .bookApntmt__address {
          color: #6c757d;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .bookApntmt__bookingInfo {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .bookApntmt__infoItem h4 {
          font-size: 12px;
          color: #6c757d;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .bookApntmt__infoItem p {
          margin: 0;
          font-size: 14px;
          color: #212529;
          font-weight: 500;
        }

        .bookApntmt__formGroup {
          margin-bottom: 20px;
        }

        .bookApntmt__label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #212529;
          font-size: 14px;
        }

        .bookApntmt__input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .bookApntmt__input:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .bookApntmt__textarea {
          min-height: 100px;
          resize: vertical;
        }

        .bookApntmt__actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          gap: 15px;
        }

        .bookApntmt__btn {
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bookApntmt__btnBack {
          background: #1e293b;
          color: white;
        }

        .bookApntmt__btnBack:hover {
          background: #0f172a;
        }

        .bookApntmt__btnNext {
          background: #41c0d6;
          color: white;
          margin-left: auto;
        }

        .bookApntmt__btnNext:hover {
          background: #0b5ed7;
        }

        .bookApntmt__btnNext:disabled {
          background: #adb5bd;
          cursor: not-allowed;
        }

        .bookApntmt__typeGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .bookApntmt__typeCard {
          padding: 20px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: white;
        }

        .bookApntmt__typeCard:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
        }

        .bookApntmt__typeCard.selected {
          border-color: #0d6efd;
          background: #f0f7ff;
        }

        .bookApntmt__typeIcon {
          width: 40px;
          height: 40px;
          margin: 0 auto 10px;
          color: #6c757d;
        }

        .bookApntmt__typeCard.selected .bookApntmt__typeIcon {
          color: #0d6efd;
        }

        .bookApntmt__typeLabel {
          font-size: 14px;
          font-weight: 500;
          color: #212529;
          margin: 0;
        }

        .bookApntmt__sectionTitle {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #212529;
        }

        .bookApntmt__clinicCard {
          padding: 20px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .bookApntmt__clinicCard:hover {
          border-color: #0d6efd;
        }

        .bookApntmt__clinicCard.selected {
          border-color: #0d6efd;
          background: #f0f7ff;
        }

        .bookApntmt__clinicIcon {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bookApntmt__clinicInfo {
          flex: 1;
        }

        .bookApntmt__clinicName {
          font-weight: 600;
          font-size: 16px;
          color: #212529;
          margin: 0 0 5px 0;
        }

        .bookApntmt__clinicAddress {
          font-size: 13px;
          color: #6c757d;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .bookApntmt__clinicDistance {
          color: #0d6efd;
          font-weight: 600;
          font-size: 13px;
        }

        .bookApntmt__calendar {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .bookApntmt__calendarLeft {
          flex: 1;
        }

        .bookApntmt__calendarHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .bookApntmt__calendarNav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bookApntmt__navBtn {
          width: 32px;
          height: 32px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .bookApntmt__navBtn:hover {
          border-color: #0d6efd;
          color: #0d6efd;
        }

        .bookApntmt__currentMonth {
          font-size: 16px;
          font-weight: 600;
          color: #212529;
        }

        .bookApntmt__calendarSelects {
          display: flex;
          gap: 10px;
        }

        .bookApntmt__select {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .bookApntmt__calendarGrid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }

        .bookApntmt__calendarDay {
          text-align: center;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #6c757d;
        }

        .bookApntmt__calendarDate {
          text-align: center;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          border: none;
          background: white;
        }

        .bookApntmt__calendarDate:hover:not(.disabled):not(.past) {
          background: #e9ecef;
        }

        .bookApntmt__calendarDate.selected {
          background: #0d6efd;
          color: white;
        }

        .bookApntmt__calendarDate.disabled {
          color: #dee2e6;
          cursor: not-allowed;
        }

        .bookApntmt__calendarDate.past {
          color: #adb5bd;
          cursor: not-allowed;
          background: #f8f9fa;
        }

        .bookApntmt__timeSlotsRight {
          flex: 1;
        }

        .bookApntmt__periodSection {
          margin-bottom: 20px;
        }

        .bookApntmt__periodTitle {
          font-size: 14px;
          font-weight: 600;
          color: #212529;
          margin-bottom: 10px;
        }

        .bookApntmt__timeGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          gap: 10px;
        }

        .bookApntmt__timeSlot {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
          background: white;
        }

        .bookApntmt__timeSlot:hover {
          border-color: #0d6efd;
        }

        .bookApntmt__timeSlot.selected {
          background: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }

        .bookApntmt__timeSlot.disabled {
          background: #e9ecef;
          cursor: not-allowed;
          color: #adb5bd;
        }

        /* Doctor Selection Accordion Styles */
        .bookApntmt__accordionContainer {
          max-height: 500px;
          overflow-y: auto;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .bookApntmt__accordionContainer::-webkit-scrollbar {
          width: 8px;
        }

        .bookApntmt__accordionContainer::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .bookApntmt__accordionContainer::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .bookApntmt__accordionContainer::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .bookApntmt__specialtyAccordion {
          border-bottom: 1px solid #e9ecef;
        }

        .bookApntmt__specialtyAccordion:last-child {
          border-bottom: none;
        }

        .bookApntmt__specialtyHeader {
          padding: 20px;
          background: #f8f9fa;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s;
        }

        .bookApntmt__specialtyHeader:hover {
          background: #e9ecef;
        }

        .bookApntmt__specialtyTitle {
          font-size: 16px;
          font-weight: 600;
          color: #212529;
          margin: 0;
        }

        .bookApntmt__specialtyToggle {
          transition: transform 0.3s;
          color: #6c757d;
        }

        .bookApntmt__specialtyToggle.expanded {
          transform: rotate(90deg);
        }

        .bookApntmt__doctorsList {
          padding: 15px;
          background: white;
        }

        .bookApntmt__doctorCard {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .bookApntmt__doctorCard:last-child {
          margin-bottom: 0;
        }

        .bookApntmt__doctorCard:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .bookApntmt__doctorCard.selected {
          border-color: #0d6efd;
          background: #f0f7ff;
        }

        .bookApntmt__doctorAvatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .bookApntmt__doctorDetails {
          flex: 1;
        }

        .bookApntmt__doctorName {
          font-size: 16px;
          font-weight: 600;
          color: #212529;
          margin: 0 0 5px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bookApntmt__doctorSpecialty {
          color: #0d6efd;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .bookApntmt__doctorAddress {
          color: #6c757d;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        @media (max-width: 768px) {
          .bookApntmt__stepper {
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 10px;
          }

          .bookApntmt__calendar {
            flex-direction: column;
          }

          .bookApntmt__calendarHeader {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .bookApntmt__calendarSelects {
            justify-content: center;
          }

          .bookApntmt__typeGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .bookApntmt__actions {
            flex-direction: column;
          }

          .bookApntmt__btnNext {
            margin-left: 0;
          }

          .bookApntmt__accordionContainer {
            max-height: 400px;
          }
        }
      `}</style>

      <div className="bookApntmt__wrapper container">
        {/* Stepper */}
        <div className="bookApntmt__stepper">
          {steps.map((step, index) => (
            <React.Fragment key={step.num}>
              <div className="bookApntmt__step">
                <div className={`bookApntmt__stepNumber ${step.active ? 'active' : 'inactive'}`}>
                  {step.num}
                </div>
                <span className={`bookApntmt__stepLabel ${step.active ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`bookApntmt__stepDivider ${step.active ? 'active' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Card */}
        <div className="bookApntmt__card">
          {/* Doctor Header - Only show if doctor is selected */}
          {selectedDoctor && currentStep > 1 && (
            <div className="bookApntmt__doctorHeader">
              <img 
                src={selectedDoctor.image} 
                alt={selectedDoctor.name}
                className="bookApntmt__doctorImage"
              />
              <div className="bookApntmt__doctorInfo">
                <h3>
                  {selectedDoctor.name}
                  <span className="bookApntmt__rating">
                    <Star size={12} fill="white" /> {selectedDoctor.rating}
                  </span>
                </h3>
                <div className="bookApntmt__specialty">{selectedDoctor.specialty}</div>
                <div className="bookApntmt__address">
                  <MapPin size={14} />
                  {selectedDoctor.address}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Select Doctor */}
          {currentStep === 1 && (
            <>
              <h2 className="bookApntmt__sectionTitle">Select a Doctor</h2>
              <div className="bookApntmt__accordionContainer">
                {specialtiesWithDoctors.map(specialty => (
                  <div key={specialty.id} className="bookApntmt__specialtyAccordion">
                    <div 
                      className="bookApntmt__specialtyHeader"
                      onClick={() => setExpandedSpecialty(expandedSpecialty === specialty.id ? null : specialty.id)}
                    >
                      <h3 className="bookApntmt__specialtyTitle">{specialty.specialty}</h3>
                      <ChevronRight 
                        size={20} 
                        className={`bookApntmt__specialtyToggle ${expandedSpecialty === specialty.id ? 'expanded' : ''}`}
                      />
                    </div>
                    {expandedSpecialty === specialty.id && (
                      <div className="bookApntmt__doctorsList">
                        {specialty.doctors.map(doctor => (
                          <div
                            key={doctor.id}
                            className={`bookApntmt__doctorCard ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                            onClick={() => setSelectedDoctor(doctor)}
                          >
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="bookApntmt__doctorAvatar"
                            />
                            <div className="bookApntmt__doctorDetails">
                              <div className="bookApntmt__doctorName">
                                {doctor.name}
                                <span className="bookApntmt__rating">
                                  <Star size={12} fill="white" /> {doctor.rating}
                                </span>
                              </div>
                              <div className="bookApntmt__doctorSpecialty">{doctor.specialty}</div>
                              <div className="bookApntmt__doctorAddress">
                                <MapPin size={12} />
                                {doctor.address}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Appointment Type */}
          {currentStep === 2 && (
            <>
              <h2 className="bookApntmt__sectionTitle">Select Appointment Type</h2>
              <div className="bookApntmt__typeGrid">
                {appointmentTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`bookApntmt__typeCard ${selectedAppointmentType === type.label ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedAppointmentType(type.label);
                        if (type.label !== 'Clinic') {
                          setSelectedClinic(null);
                        }
                      }}
                    >
                      <Icon className="bookApntmt__typeIcon" />
                      <p className="bookApntmt__typeLabel">{type.label}</p>
                    </div>
                  );
                })}
              </div>

              {selectedAppointmentType === 'Clinic' && (
                <>
                  <h2 className="bookApntmt__sectionTitle">Select Clinics</h2>
                  {clinics.map(clinic => (
                    <div
                      key={clinic.id}
                      className={`bookApntmt__clinicCard ${selectedClinic === clinic.id ? 'selected' : ''}`}
                      onClick={() => setSelectedClinic(clinic.id)}
                    >
                      <div className="bookApntmt__clinicIcon" style={{ background: clinic.color }}>
                        <Building2 color="white" />
                      </div>
                      <div className="bookApntmt__clinicInfo">
                        <h3 className="bookApntmt__clinicName">{clinic.name}</h3>
                        <p className="bookApntmt__clinicAddress">
                          {clinic.address} • <span className="bookApntmt__clinicDistance">{clinic.distance}</span>
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
            <div className="bookApntmt__calendar">
              <div className="bookApntmt__calendarLeft">
                <div className="bookApntmt__calendarHeader">
                  <div className="bookApntmt__calendarNav">
                    <button className="bookApntmt__navBtn" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft size={16} />
                    </button>
                    <div className="bookApntmt__currentMonth">
                      {months[currentMonth]} {currentYear}
                    </div>
                    <button className="bookApntmt__navBtn" onClick={() => navigateMonth('next')}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="bookApntmt__calendarSelects">
                    <select 
                      className="bookApntmt__select"
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                    <select 
                      className="bookApntmt__select"
                      value={currentYear}
                      onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bookApntmt__calendarGrid">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="bookApntmt__calendarDay">{day}</div>
                  ))}
                  {calendarDates.map((dateObj, idx) => (
                    <button
                      key={idx}
                      className={`bookApntmt__calendarDate ${
                        dateObj.date === selectedDate && dateObj.isCurrentMonth ? 'selected' : ''
                      } ${
                        !dateObj.isCurrentMonth ? 'disabled' : ''
                      } ${
                        dateObj.isPast ? 'past' : ''
                      }`}
                      onClick={() => dateObj.isCurrentMonth && !dateObj.isPast && setSelectedDate(dateObj.date)}
                      disabled={!dateObj.isCurrentMonth || dateObj.isPast}
                    >
                      {dateObj.date}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bookApntmt__timeSlotsRight">
                {Object.keys(timeSlots).map(period => (
                  <div key={period} className="bookApntmt__periodSection">
                    <div className="bookApntmt__periodTitle">{period}</div>
                    <div className="bookApntmt__timeGrid">
                      {timeSlots[period].map((time, idx) => (
                        <button
                          key={idx}
                          className={`bookApntmt__timeSlot ${time === selectedTime && period === selectedPeriod ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedTime(time);
                            setSelectedPeriod(period);
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Basic Information */}
          {currentStep === 4 && (
            <>
              <div className="bookApntmt__bookingInfo">
                <div className="bookApntmt__infoItem">
                  <h4>Service</h4>
                  <p>Cardiology (30 Mins)</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Service</h4>
                  <p>Echocardiograms</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Date & Time</h4>
                  <p>10:00 - 11:00 AM, 15, Oct</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Appointment type</h4>
                  <p>Clinic (Wellness Path)</p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="bookApntmt__input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="bookApntmt__input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="bookApntmt__input"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="bookApntmt__input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="bookApntmt__formGroup">
                    <label className="bookApntmt__label">Select Patient</label>
                    <select
                      name="patient"
                      className="bookApntmt__input"
                      value={formData.patient}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
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
                    />
                  </div>
                </div>
              </div>

              <div className="bookApntmt__formGroup">
                <label className="bookApntmt__label">Attachment</label>
                <input
                  type="file"
                  className="bookApntmt__input"
                  onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
                />
              </div>

              <div className="bookApntmt__formGroup">
                <label className="bookApntmt__label">Reason for Visit</label>
                <textarea
                  name="reason"
                  className="bookApntmt__input bookApntmt__textarea"
                  value={formData.reason}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h2 style={{ color: '#04bd6c', marginBottom: '10px' }}>Appointment Confirmed!</h2>
              <p style={{ color: '#6c757d', marginBottom: '30px' }}>
                Your appointment has been successfully booked.
              </p>
              <div className="bookApntmt__bookingInfo" style={{ textAlign: 'left' }}>
                <div className="bookApntmt__infoItem">
                  <h4>Doctor</h4>
                  <p>{selectedDoctor?.name}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Specialty</h4>
                  <p>{selectedDoctor?.specialty}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Appointment Type</h4>
                  <p>{selectedAppointmentType}</p>
                </div>
                <div className="bookApntmt__infoItem">
                  <h4>Date & Time</h4>
                  <p>{selectedDate} {months[currentMonth]}, {currentYear} at {selectedTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bookApntmt__actions">
            {currentStep > 1 && currentStep < 5 && (
              <button className="bookApntmt__btn bookApntmt__btnBack" onClick={handleBack}>
                Back
              </button>
            )}
            {currentStep < 5 && (
              <button 
                className="bookApntmt__btn bookApntmt__btnNext" 
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedDoctor}
              >
                {currentStep === 1 ? 'Select Appointment Type' :
                 currentStep === 2 ? 'Select Date & Time' :
                 currentStep === 3 ? 'Add Basic Information' : 
                 'Confirm Appointment'} 
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;