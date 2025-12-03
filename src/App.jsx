import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
import { store } from "./Redux/store";
import { fetchDoctors } from "./Redux/doctorSlice";
import UserProfile from "./User/UserProfile";
import About from "./Hospital/About";
import NotFoundPage from "./Components/NotFoundPage";
import "react-toastify/dist/ReactToastify.css";
import ToastHandler from "./Components/ToastHandler";
import AuthGuard from "./Components/AuthGuard";

// Component to initialize data fetching
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch doctors immediately when app loads
    dispatch(fetchDoctors());
  }, [dispatch]);

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
          
          <Route path="/doctor-profile/:id" element={
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

// Root App Component
function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <AppContent />
      </AppInitializer>
    </Provider>
  );
}

export default App;