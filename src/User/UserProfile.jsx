import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Calendar, MapPin, LogOut, User } from "lucide-react";

const UserProfileSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("view"); // 'view' or 'update'
  const [activeAddressTab, setActiveAddressTab] = useState("view"); // 'view' or 'update' for address
  const [profileData, setProfileData] = useState({
    firstName: "Hendrita",
    lastName: "Smith",
    phoneNumber: "+1 504 368 6874",
    email: "hendrita@example.com",
    dateOfBirth: "1992-09-15",
    bloodGroup: "female",
  });

  const [addressData, setAddressData] = useState({
    address: "123 Main Street, Apartment 4B",
    city: "New York",
    state: "New York",
    country: "United States",
    pincode: "10001",
  });

  const appointments = [
    {
      id: "#Apt0001",
      doctorName: "Dr Edalin Hendry",
      email: "Edalin@Example.Com",
      phone: "+1 504 368 6874",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
      appointmentType: "Direct Visit",
      consultationFees: "$200",
      status: "Upcoming",
      dateTime: "22 Jul 2023 - 12:00 pm",
      clinicLocation: "Adrian's Dentistry",
      location: "Newyork, United States",
      visitType: "General",
    },
  ];

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfileChanges = () => {
    console.log("Saving profile changes:", profileData);
    alert("Profile changes saved successfully!");
    setActiveProfileTab("view");
  };

  const handleSaveAddressChanges = () => {
    console.log("Saving address changes:", addressData);
    alert("Address changes saved successfully!");
    setActiveAddressTab("view");
  };

  const handleCancel = () => {
    console.log("Changes cancelled");
    if (activeSection === "profile") {
      setActiveProfileTab("view");
    } else if (activeSection === "address") {
      setActiveAddressTab("view");
    }
  };

  const ProfileViewTab = () => (
    <div className="userProfileViewCard">
      <div className="userProfileViewRow">
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">First Name</span>
          <span className="userProfileViewValue">
            {profileData.firstName}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Last Name</span>
          <span className="userProfileViewValue">
            {profileData.lastName}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Date of Birth</span>
          <span className="userProfileViewValue">
            {profileData.dateOfBirth}
          </span>
        </div>
      </div>

      <div className="userProfileViewRow">
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Phone Number</span>
          <span className="userProfileViewValue">
            {profileData.phoneNumber}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Email Address</span>
          <span className="userProfileViewValue">
            {profileData.email}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Gender</span>
          <span className="userProfileViewValue">
            {profileData.bloodGroup}
          </span>
        </div>
      </div>
    </div>
  );

  const ProfileUpdateTab = () => (
    <>
      <div className="userProfileSection">
        <h3 className="userProfileSectionTitle">Profile Photo</h3>
        <div className="userProfilePhotoUpload">
          <div className="userProfilePhotoPreview">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <div className="userProfilePhotoInfo">
            <div className="userProfilePhotoButtons">
              <button className="userProfileUploadBtn">Upload New</button>
              <button className="userProfileRemoveBtn">Remove</button>
            </div>
            <p className="userProfilePhotoNote">
              Your Image should Below 4 MB, Accepted format jpg,png,svg
            </p>
          </div>
        </div>
      </div>

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
              name="firstName"
              value={profileData.firstName}
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
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileInputChange}
              placeholder="Enter last name"
            />
          </div>
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              Date of Birth <span>*</span>
            </label>
            <input
              type="date"
              className="userProfileInput"
              name="dateOfBirth"
              value={profileData.dateOfBirth}
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
              name="phoneNumber"
              value={profileData.phoneNumber}
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
              placeholder="Enter email address"
            />
          </div>
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              Gender <span>*</span>
            </label>
            <select
              className="userProfileSelect"
              name="bloodGroup"
              value={profileData.bloodGroup}
              onChange={handleProfileInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="userProfileActions">
        <button className="userProfileCancelBtn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="userProfileSaveBtn" onClick={handleSaveProfileChanges}>
          Save Changes
        </button>
      </div>
    </>
  );

  const AddressViewTab = () => (
    <div className="userProfileViewCard">
      <div className="userProfileViewRow">
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Address</span>
          <span className="userProfileViewValue">
            {addressData.address}
          </span>
        </div>
      </div>

      <div className="userProfileViewRow">
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">City</span>
          <span className="userProfileViewValue">
            {addressData.city}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">State</span>
          <span className="userProfileViewValue">
            {addressData.state}
          </span>
        </div>
      </div>

      <div className="userProfileViewRow">
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Country</span>
          <span className="userProfileViewValue">
            {addressData.country}
          </span>
        </div>
        <div className="userProfileViewField">
          <span className="userProfileViewLabel">Pincode</span>
          <span className="userProfileViewValue">
            {addressData.pincode}
          </span>
        </div>
      </div>
    </div>
  );

  const AddressUpdateTab = () => (
    <>
      <div className="userProfileSection">
        <h3 className="userProfileSectionTitle">Address Information</h3>
        <div className="userProfileFormRow">
          <div className="userProfileFormGroup" style={{ gridColumn: "1 / -1" }}>
            <label className="userProfileLabel">
              Address <span>*</span>
            </label>
            <input
              type="text"
              className="userProfileInput"
              name="address"
              value={addressData.address}
              onChange={handleAddressInputChange}
              placeholder="Enter full address"
            />
          </div>
        </div>

        <div className="userProfileFormRow">
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              City <span>*</span>
            </label>
            <input
              type="text"
              className="userProfileInput"
              name="city"
              value={addressData.city}
              onChange={handleAddressInputChange}
              placeholder="Enter city"
            />
          </div>
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              State <span>*</span>
            </label>
            <input
              type="text"
              className="userProfileInput"
              name="state"
              value={addressData.state}
              onChange={handleAddressInputChange}
              placeholder="Enter state"
            />
          </div>
        </div>

        <div className="userProfileFormRow">
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              Country <span>*</span>
            </label>
            <input
              type="text"
              className="userProfileInput"
              name="country"
              value={addressData.country}
              onChange={handleAddressInputChange}
              placeholder="Enter country"
            />
          </div>
          <div className="userProfileFormGroup">
            <label className="userProfileLabel">
              Pincode <span>*</span>
            </label>
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
        <button className="userProfileCancelBtn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="userProfileSaveBtn" onClick={handleSaveAddressChanges}>
          Save Changes
        </button>
      </div>
    </>
  );

  return (
    <div className="userProfileContainer">
      <style>{`
        .userProfileContainer {
          min-height: 100vh;
          background-color: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .userProfileWrapper {
          display: flex;
          margin: 0 auto;
          padding: 40px;
          gap: 20px;
        }

        .userProfileSidebar {
          background: #1a2332;
          border-radius: 12px;
          padding: 30px 0;
          width: 300px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .userProfileHeader {
          text-align: center;
          padding: 0 20px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .userProfileAvatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 15px;
          position: relative;
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .userProfileAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .userProfileOnlineStatus {
          width: 18px;
          height: 18px;
          background: #28a745;
          border: 3px solid #1a2332;
          border-radius: 50%;
          position: absolute;
          bottom: 8px;
          right: 8px;
        }

        .userProfileName {
          color: #fff;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .userProfileId {
          color: #8b95a5;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .userProfileInfo {
          color: #8b95a5;
          font-size: 14px;
        }

        .userProfileMenu {
          padding: 20px 0;
        }

        .userProfileMenuItem {
          display: flex;
          align-items: center;
          padding: 14px 25px;
          color: #8b95a5;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .userProfileMenuItem:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .userProfileMenuItem.active {
          background: rgba(0, 123, 255, 0.1);
          color: #007bff;
          border-left-color: #007bff;
        }

        .userProfileMenuIcon {
          margin-right: 12px;
          width: 20px;
          height: 20px;
        }

        .userProfileContent {
          flex: 1;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #E6E8EE;
          padding: 35px;
        }

        .userProfileTitle {
          font-size: 24px;
          font-weight: 600;
          color: #1a2332;
          margin-bottom: 30px;
        }

        .userProfileSection {
          margin-bottom: 35px;
        }

        .userProfileSectionTitle {
          font-size: 16px;
          font-weight: 600;
          color: #1a2332;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }

        .userProfilePhotoUpload {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .userProfilePhotoPreview {
          width: 80px;
          height: 80px;
          background: #e9ecef;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
        }

        .userProfilePhotoInfo {
          flex: 1;
        }

        .userProfilePhotoButtons {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }

        .userProfileUploadBtn {
          color: #007bff;
          background: none;
          border: none;
          padding: 0;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
        }

        .userProfileUploadBtn:hover {
          text-decoration: underline;
        }

        .userProfileRemoveBtn {
          color: #dc3545;
          background: none;
          border: none;
          padding: 0;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
        }

        .userProfileRemoveBtn:hover {
          text-decoration: underline;
        }

        .userProfilePhotoNote {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }

        .userProfileFormRow {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .userProfileFormGroup {
          display: flex;
          flex-direction: column;
        }

        .userProfileLabel {
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          margin-bottom: 8px;
        }

        .userProfileLabel span {
          color: #dc3545;
          margin-left: 3px;
        }

        .userProfileInput {
          padding: 10px 14px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .userProfileInput:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .userProfileSelect {
          padding: 10px 14px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .userProfileSelect:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .userProfileActions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .userProfileCancelBtn {
          padding: 10px 24px;
          border: 1px solid #dee2e6;
          background: #fff;
          color: #495057;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .userProfileCancelBtn:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .userProfileSaveBtn {
          padding: 10px 24px;
          border: none;
          background: #007bff;
          color: #fff;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .userProfileSaveBtn:hover {
          background: #0056b3;
        }

        .userProfileTabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
        }

        .userProfileTab {
          padding: 12px 24px;
          background: #fff;
          border: none;
          color: #6c757d;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px 6px 0 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .userProfileTab:hover {
          color: #007bff;
        }

        .userProfileTab.active {
          color: #007bff;
          background: #fff;
        }

        .userProfileTab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #007bff;
        }

        .userProfileViewCard {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 25px;
        }

        .userProfileViewRow {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .userProfileViewField {
          display: flex;
          flex-direction: column;
        }

        .userProfileViewLabel {
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .userProfileViewValue {
          font-size: 15px;
          color: #1a2332;
          font-weight: 500;
        }

        .userProfileAppointmentCard {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .userProfileAppointmentHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 25px;
          gap: 20px;
        }

        .userProfileDoctorInfo {
          display: flex;
          gap: 15px;
        }

        .userProfileDoctorImage {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
        }

        .userProfileDoctorImage img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .userProfileDoctorDetails {
          flex: 1;
        }

        .userProfileAppointmentId {
          color: #007bff;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 5px;
        }

        .userProfileDoctorName {
          font-size: 18px;
          font-weight: 600;
          color: #1a2332;
          margin-bottom: 8px;
        }

        .userProfileContactInfo {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .userProfileContactItem {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6c757d;
        }

        .userProfileContactIcon {
          width: 16px;
          height: 16px;
          color: #6c757d;
        }

        .userProfileAppointmentRight {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .userProfileAppointmentType {
          display: flex;
          flex-direction: column;
        }

        .userProfileTypeLabel {
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 5px;
        }

        .userProfileTypeValue {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #1a2332;
        }

        .userProfileStatusBadge {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          background: #fff3cd;
          color: #856404;
        }

        .userProfileConsultationFee {
          font-size: 18px;
          font-weight: 700;
          color: #1a2332;
        }

        .userProfileAppointmentActions {
          display: flex;
          gap: 10px;
        }

        .userProfileActionBtn {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .userProfileActionBtn:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .userProfileAppointmentDetails {
          justify-content: center;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          text-align: center;
          align-items: center;
        }

        .userProfileDetailItem {
          display: flex;
          flex-direction: column;
        }

        .userProfileDetailLabel {
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .userProfileDetailValue {
          font-size: 15px;
          color: #1a2332;
          font-weight: 500;
        }

        .userProfileStartSessionBtn {
          padding: 10px 24px;
          background: #7c3aed;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .userProfileStartSessionBtn:hover {
          background: #6d28d9;
        }

        @media (max-width: 992px) {
          .userProfileWrapper {
            flex-direction: column;
          }

          .userProfileSidebar {
            width: 100%;
            position: static;
          }

          .userProfileMenu {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .userProfileAppointmentHeader {
            flex-direction: column;
          }

          .userProfileAppointmentRight {
            align-items: flex-start;
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .userProfileWrapper {
            padding: 10px;
          }

          .userProfileContent {
            padding: 20px;
          }

          .userProfileFormRow {
            grid-template-columns: 1fr;
          }

          .userProfileMenu {
            grid-template-columns: 1fr;
          }

          .userProfileActions {
            flex-direction: column;
          }

          .userProfileCancelBtn,
          .userProfileSaveBtn {
            width: 100%;
          }

          .userProfileTabs {
            flex-wrap: wrap;
          }

          .userProfileTab {
            flex: 1;
            min-width: 120px;
          }

          .userProfileAppointmentDetails {
            grid-template-columns: 1fr;
          }

          .userProfileDoctorInfo {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="userProfileWrapper">
        <aside className="userProfileSidebar">
          <div className="userProfileHeader">
            <div className="userProfileAvatar">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                alt="Profile"
              />
              <div className="userProfileOnlineStatus"></div>
            </div>
            <h3 className="userProfileName">Hendrita</h3>
            <p className="userProfileId">Patient ID: PT254654</p>
            <p className="userProfileInfo">Female • 32 years 03 Months</p>
          </div>

          <nav className="userProfileMenu">
            <div
              className={`userProfileMenuItem ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <User className="userProfileMenuIcon" size={20} />
              My Profile
            </div>
            <div
              className={`userProfileMenuItem ${
                activeSection === "appointments" ? "active" : ""
              }`}
              onClick={() => setActiveSection("appointments")}
            >
              <Calendar className="userProfileMenuIcon" size={20} />
              My Appointments
            </div>
            <div
              className={`userProfileMenuItem ${
                activeSection === "address" ? "active" : ""
              }`}
              onClick={() => setActiveSection("address")}
            >
              <MapPin className="userProfileMenuIcon" size={20} />
              Address
            </div>
            <div className="userProfileMenuItem">
              <LogOut className="userProfileMenuIcon" size={20} />
              Logout
            </div>
          </nav>
        </aside>

        <main className="userProfileContent">
          {activeSection === "profile" && (
            <>
              <h2 className="userProfileTitle">Profile Settings</h2>

              <div className="userProfileTabs">
                <button
                  className={`userProfileTab ${
                    activeProfileTab === "view" ? "active" : ""
                  }`}
                  onClick={() => setActiveProfileTab("view")}
                >
                  View Profile
                </button>
                <button
                  className={`userProfileTab ${
                    activeProfileTab === "update" ? "active" : ""
                  }`}
                  onClick={() => setActiveProfileTab("update")}
                >
                  Update Profile
                </button>
              </div>

              {activeProfileTab === "view" ? (
                <ProfileViewTab />
              ) : (
                <ProfileUpdateTab />
              )}
            </>
          )}

          {activeSection === "appointments" && (
            <>
              <h2 className="userProfileTitle">My Appointments</h2>
              {appointments.map((appointment) => (
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
                          {appointment.id}
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
                              ></path>
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
                              ></path>
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
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#28a745"
                          stroke="none"
                        >
                          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                        </svg>
                        {appointment.appointmentType}
                      </div>
                    </div>

                    <div className="userProfileAppointmentRight">
                      <span className="userProfileStatusBadge">
                        {appointment.status}
                      </span>
                      <div className="userProfileConsultationFee">
                        Consultation Fees : {appointment.consultationFees}
                      </div>
                      <div className="userProfileAppointmentActions">
                        <button className="userProfileActionBtn">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                        <button className="userProfileActionBtn">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
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
                    <div className="userProfileDetailItem">
                      <span className="userProfileDetailLabel">
                        Clinic Location
                      </span>
                      <span className="userProfileDetailValue">
                        {appointment.clinicLocation}
                      </span>
                    </div>
                    <div className="userProfileDetailItem">
                      <span className="userProfileDetailLabel">Location</span>
                      <span className="userProfileDetailValue">
                        {appointment.location}
                      </span>
                    </div>
                    <div className="userProfileDetailItem">
                      <span className="userProfileDetailLabel">Visit Type</span>
                      <span className="userProfileDetailValue">
                        {appointment.visitType}
                      </span>
                    </div>
                    <div
                      className="userProfileDetailItem"
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <button className="userProfileStartSessionBtn">
                        Start Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeSection === "address" && (
            <>
              <h2 className="userProfileTitle">Address Settings</h2>

              <div className="userProfileTabs">
                <button
                  className={`userProfileTab ${
                    activeAddressTab === "view" ? "active" : ""
                  }`}
                  onClick={() => setActiveAddressTab("view")}
                >
                  View Address
                </button>
                <button
                  className={`userProfileTab ${
                    activeAddressTab === "update" ? "active" : ""
                  }`}
                  onClick={() => setActiveAddressTab("update")}
                >
                  Update Address
                </button>
              </div>

              {activeAddressTab === "view" ? (
                <AddressViewTab />
              ) : (
                <AddressUpdateTab />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfileSettings;