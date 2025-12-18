import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Pages/Home";
import AllDoctors from "./AllDoctors/AllDoctors";
import ScrollToTop from "./Components/ScrollToTop";
import AppointmentBooking from "./Components/AppointmentBooking";
import AppointmentBooking2 from "./Components/AppontmentBooking2";
import DoctorProfile from "./Doctor Profile/DoctorProfile";
import Auth from "./Authentication/Auth";
import Layout from "./Components/Layout";
import HealthCare from "../src/HealthCare/HealthCare";
import { fetchDoctors } from "./Redux/doctorSlice";
import { fetchUserProfile } from "./Redux/userSlice";
import UserProfile from "./User/UserProfile";
import About from "./Hospital/About";
import NotFoundPage from "./Components/NotFoundPage";
import "react-toastify/dist/ReactToastify.css";
import ToastHandler from "./Components/ToastHandler";
import AuthGuard from "./Components/AuthGuard";

// Component to initialize data fetching
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch doctors immediately when app loads
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Fetch user profile if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, fetching profile...");
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

// Main App Content with Routes
const AppContent = () => {
  return (
    <Router>
      <ToastHandler />
      <ScrollToTop />
      <Routes>
        {/* Routes wrapped with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/all-doctors" element={<AllDoctors />} />
          <Route path="/healthcare" element={<HealthCare />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected routes - require login */}
          <Route path="/booking" element={
            <AuthGuard type="private">
              <AppointmentBooking />
            </AuthGuard>
          } />
          
          <Route path="/book-appointment" element={
            <AuthGuard type="private">
              <AppointmentBooking2 />
            </AuthGuard>
          } />
          
          <Route path="/doctor-profile" element={
            <AuthGuard type="private">
              <DoctorProfile />
            </AuthGuard>
          } />
          
          <Route path="/profile" element={
            <AuthGuard type="private">
              <UserProfile />
            </AuthGuard>
          } />
        </Route>

        {/* Auth route - cannot access if already logged in */}
        <Route path="/auth" element={
          <AuthGuard type="public">
            <Auth />
          </AuthGuard>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

// Main App Component - Now simpler without Provider
function App() {
  return (
    <AppInitializer>
      <AppContent />
    </AppInitializer>
  );
}

export default App;